/* ============================================================
   SOULRIFT — /js/ui.js
   Screen router, bottom nav, header sync, toast, utilities.
   Depends on: state.js loaded first.
   ============================================================ */

'use strict';

/* ── Modal focus-trap utility ────────────────────────────── */
let _prevFocusEl = null;

function _focusableEls(el) {
  return Array.from(el.querySelectorAll(
    'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])'
  ));
}

function _openModal(el) {
  if (!el) return;
  _prevFocusEl = document.activeElement;
  requestAnimationFrame(() => {
    const nodes = _focusableEls(el);
    if (nodes.length) nodes[0].focus();
  });
  el._modalTrap = function (e) {
    if (e.key === 'Escape') {
      const closeBtn = el.querySelector('[onclick*="close"],[onclick*="Close"]');
      if (closeBtn) closeBtn.click();
      return;
    }
    if (e.key !== 'Tab') return;
    const nodes = _focusableEls(el);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  el.addEventListener('keydown', el._modalTrap);
}

function _closeModal(el) {
  if (!el) return;
  if (el._modalTrap) { el.removeEventListener('keydown', el._modalTrap); el._modalTrap = null; }
  if (_prevFocusEl) { try { _prevFocusEl.focus(); } catch (_) { } _prevFocusEl = null; }
}

/* ── Screen map: key → HTML id ───────────────────────────── */
const SCREENS = {
  battle: 'screen-battle',
  order: 'screen-order',
  market: 'screen-market',
  items: 'screen-items',
  fusion: 'screen-fusion',
  library: 'screen-library',
};

/* Screen that loads after tower is chosen */
const DEFAULT_SCREEN = 'battle';

/* Callbacks run each time a screen becomes active */
const _hooks = {};

let _activeScreen = null;

/* ── showScreen ──────────────────────────────────────────── */
function showScreen(key) {
  if (!SCREENS[key]) {
    console.warn('[ui] Unknown screen:', key);
    return;
  }

  /* deactivate all screens */
  Object.values(SCREENS).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('is-active');
  });

  /* deactivate all nav buttons */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('is-active');
  });

  /* activate target screen */
  const screenEl = document.getElementById(SCREENS[key]);
  if (screenEl) screenEl.classList.add('is-active');

  /* activate matching nav button */
  const navBtn = document.getElementById('nav-' + key);
  if (navBtn) navBtn.classList.add('is-active');

  _activeScreen = key;

  /* run lifecycle hook if registered */
  if (typeof _hooks[key] === 'function') {
    try { _hooks[key](); } catch (e) { console.error('[ui] Hook error', key, e); }
  }
}

/** Register a function to run each time a screen is shown. */
function onScreen(key, fn) {
  _hooks[key] = fn;
}

/* ── Intro helpers ───────────────────────────────────────── */
function showIntro() {
  /* hide main screens + nav + header */
  document.getElementById('screens').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('screen-intro').classList.add('is-active');
}

function hideIntro() {
  document.getElementById('screen-intro').classList.remove('is-active');
  document.getElementById('screens').style.display = '';
  document.getElementById('bottom-nav').style.display = '';
  document.getElementById('app-header').style.display = '';
}

/* ── Nav init ────────────────────────────────────────────── */
function initNav() {
  Object.keys(SCREENS).forEach(key => {
    const btn = document.getElementById('nav-' + key);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!getState().towerChosen) return;  /* block until tower selected */
      showScreen(key);
    });
  });
}

/* ── Header sync ─────────────────────────────────────────── */
function syncHeader() {
  const s = getState();
  const goldEl = document.getElementById('hud-gold-val');
  const levelEl = document.getElementById('hud-level');
  if (goldEl) goldEl.textContent = s.gold.toLocaleString();
  if (levelEl) {
    levelEl.textContent = 'LV ' + s.player.level;
    levelEl.classList.toggle('has-points', (s.player.skillPoints || 0) > 0);
  }

  /* tower color theme on root */
  const app = document.getElementById('app');
  if (app && s.tower) app.dataset.tower = s.tower;

  /* tower icon */
  const iconEl = document.getElementById('hud-tower-icon');
  if (iconEl && s.tower) iconEl.innerHTML = '<img src="/asset/tower_icons/' + s.tower + '.png" alt="" style="width:20px;height:20px;object-fit:cover;border-radius:50%;vertical-align:middle;">';
  else if (iconEl) iconEl.innerHTML = '';

  /* EXP bar */
  const expEl = document.getElementById('hud-exp-fill');
  const expPct = s.player.expNext > 0
    ? Math.min(100, Math.round((s.player.exp / s.player.expNext) * 100))
    : 0;
  if (expEl) expEl.style.width = expPct + '%';

  /* player name */
  const nameEl = document.getElementById('hud-name');
  if (nameEl) nameEl.textContent = (s.playerName || 'Wanderer').toUpperCase();
}

/* ── Profile name edit ───────────────────────────────────── */
function startEditName() {
  const nameEl = document.getElementById('prof-name');
  const editBtn = document.getElementById('prof-name-edit-btn');
  if (!nameEl || !editBtn) return;
  const current = getState().playerName || '';
  nameEl.innerHTML =
    '<input id="prof-name-input" class="prof-name-input" type="text"'
    + ' value="' + current.replace(/"/g, '&quot;') + '"'
    + ' maxlength="20" placeholder="Your name"'
    + ' onkeydown="if(event.key===\'Enter\')saveEditName()"'
    + ' />';
  editBtn.textContent = '✓';
  editBtn.setAttribute('aria-label', 'Save name');
  editBtn.onclick = saveEditName;
  requestAnimationFrame(() => {
    const inp = document.getElementById('prof-name-input');
    if (inp) { inp.focus(); inp.select(); }
  });
}

function saveEditName() {
  const inp = document.getElementById('prof-name-input');
  if (!inp) return;
  const newName = inp.value.trim() || 'Arcane Wanderer';
  getState().playerName = newName;
  saveState();
  syncHeader();
  renderProfilePanel();
  /* reset button back to edit mode */
  const editBtn = document.getElementById('prof-name-edit-btn');
  if (editBtn) {
    editBtn.textContent = '✎';
    editBtn.setAttribute('aria-label', 'Edit name');
    editBtn.onclick = startEditName;
  }
}

/* ── Profile panel ───────────────────────────────────────── */
function openProfilePanel() {
  if (!getState().towerChosen) return;
  renderProfilePanel();
  const panel = document.getElementById('profile-panel');
  panel.classList.add('is-open');
  _openModal(panel);
}

function closeProfilePanel() {
  _cancelEditNameIfActive();
  const panel = document.getElementById('profile-panel');
  _closeModal(panel);
  panel.classList.remove('is-open');
}

function _cancelEditNameIfActive() {
  const editBtn = document.getElementById('prof-name-edit-btn');
  if (!editBtn || editBtn.textContent !== '✓') return;
  // Restore display name from state (discard unsaved input)
  const nameEl = document.getElementById('prof-name');
  if (nameEl) nameEl.textContent = getState().playerName || 'Arcane Wanderer';
  editBtn.textContent = '✎';
  editBtn.setAttribute('aria-label', 'Edit name');
  editBtn.onclick = startEditName;
}

function renderProfilePanel() {
  const s = getState();
  const p = s.player;
  const towerNames = {
    light: '✦ Light Tower',
    dark: '◐ Dark Tower',
    fire: '△ Fire Tower',
    ice: '◇ Ice Tower',
  };
  const towerBadge = {
    light: 'badge--light',
    dark: 'badge--dark',
    fire: 'badge--fire',
    ice: 'badge--ice',
  };
  const towerAvatars = { light: '✦', dark: '◐', fire: '△', ice: '◇' };

  const fill = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  fill('prof-name', s.playerName || 'Arcane Wanderer');
  const profAvatarEl = document.getElementById('prof-avatar');
  if (profAvatarEl) {
    const avatarKey = s.playerAvatar || (s.tower + '_1');
    profAvatarEl.innerHTML = '<img src="/asset/player_avatars/' + avatarKey + '.png" '
      + 'style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">';
  }
  fill('prof-tower', towerNames[s.tower] || '—');
  fill('prof-level', p.level);
  fill('prof-exp', p.exp + ' / ' + p.expNext);
  fill('prof-hp', p.hpMax);
  fill('prof-sp', p.spMax);
  fill('prof-gold', s.gold.toLocaleString());
  fill('prof-str', p.str);
  fill('prof-int', p.int);
  fill('prof-atk', p.atk);
  fill('prof-def', p.def);

  /* skill points — badge + inline buttons */
  const pts = p.skillPoints || 0;
  const ptsBadge = document.getElementById('skill-pts-badge');
  const ptsCount = document.getElementById('prof-skill-points');
  if (ptsBadge) ptsBadge.classList.toggle('is-hidden', pts === 0);
  if (ptsCount) ptsCount.textContent = pts;
  ['str', 'int', 'atk', 'def'].forEach(stat => {
    const btn = document.getElementById('skill-up-' + stat);
    if (btn) btn.classList.toggle('is-hidden', pts === 0);
  });

  /* tower badge color */
  const badgeEl = document.getElementById('prof-tower-badge');
  if (badgeEl && s.tower) {
    badgeEl.className = 'badge ' + (towerBadge[s.tower] || 'badge--gold');
    badgeEl.textContent = (s.tower || '').toUpperCase();
  }

  /* vital bars */
  const setBar = (id, pct) => {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%';
  };
  setBar('prof-exp-bar', (p.exp / p.expNext) * 100);

  /* lifetime stats */
  const st = s.stats || {};
  fill('prof-stat-battles', (st.battles || 0).toLocaleString());
  fill('prof-stat-wins', (st.wins || 0).toLocaleString());
  fill('prof-stat-kills', (st.kills || 0).toLocaleString());
  fill('prof-stat-gold', (st.goldEarned || 0).toLocaleString());

  /* avatar tower glow — use design tokens */
  const towerGlowToken = {
    fire: 'var(--glow-fire)', dark: 'var(--glow-dark)',
    light: 'var(--glow-light)', ice: 'var(--glow-ice)',
  };
  const avatarEl = document.getElementById('prof-avatar');
  if (avatarEl) avatarEl.style.boxShadow = towerGlowToken[s.tower] || 'none';

  lucide.createIcons({ nodes: [document.querySelector('.prof-stats-grid')] });
}
window.renderProfilePanel = renderProfilePanel;

/* ── Level Up overlay ────────────────────────────────────── */
function showLevelUpOverlay(level) {
  const ov = document.getElementById('levelup-overlay');
  if (!ov) return;
  const numEl = ov.querySelector('.levelup-number');
  if (numEl) numEl.textContent = level;
  ov.classList.remove('is-active');
  void ov.offsetWidth; // force reflow so animation replays
  ov.classList.add('is-active');
  setTimeout(() => ov.classList.remove('is-active'), 2700);
}
window.showLevelUpOverlay = showLevelUpOverlay;

/* ── Toast ───────────────────────────────────────────────── */
function toast(msg, type = '', ms = 2600) {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' toast--' + type : '');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .22s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 240);
  }, ms);
}

/* ── Format helpers ──────────────────────────────────────── */
function fmtNum(n) { return Number(n).toLocaleString(); }
function fmtPct(n) { return Math.round(n * 100) + '%'; }

/* ── App boot ────────────────────────────────────────────── */
function bootApp() {
  getState();       /* load / init save */
  initNav();
  syncHeader();

  const s = getState();
  if (!s.towerChosen) {
    showIntro();
  } else {
    showScreen(DEFAULT_SCREEN);
  }
}

/* ── Library ─────────────────────────────────────────────── */
let _libTower = null;
let _libRarity = null;

function renderLibrary() {
  _renderLibFilters();
  _renderLibCards();
}

function _renderLibFilters() {
  const towerEl = document.getElementById('library-tower-filter');
  const rarityEl = document.getElementById('library-rarity-filter');
  if (!towerEl || !rarityEl) return;

  const towers = ['all', 'light', 'dark', 'fire', 'ice'];
  const tLabels = { all: 'All', light: 'Light', dark: 'Dark', fire: 'Fire', ice: 'Ice' };

  towerEl.innerHTML = towers.map(t => {
    const on = t === _libTower;
    return `<button class="filter-btn${on ? ' is-active' : ''}"
      onclick="_libTower='${t}';renderLibrary();">${tLabels[t]}</button>`;
  }).join('');

  const rarities = ['all', 'common', 'uncommon', 'rare', 'ultimate'];
  const rLabels = { all: 'All', common: 'Common', uncommon: 'Uncommon', rare: 'Rare', ultimate: 'Ultimate' };

  rarityEl.innerHTML = rarities.map(r => {
    const on = r === _libRarity;
    return `<button class="filter-btn${on ? ' is-active' : ''}"
      onclick="_libRarity='${r}';renderLibrary();">${rLabels[r]}</button>`;
  }).join('');
}

function _renderLibCards() {
  const list = document.getElementById('library-list');
  if (!list) return;

  let spells = getAllSpells();
  if (_libTower !== 'all') spells = spells.filter(s => s.tower === _libTower);
  if (_libRarity !== 'all') spells = spells.filter(s => s.rarity === _libRarity);

  if (!spells.length) {
    list.innerHTML =
      `<div class="empty-state">
        <div class="empty-state__icon">▤</div>
        <div class="empty-state__title">No Spells Found</div>
        <div class="empty-state__body">Try a different filter combination.</div>
      </div>`;
    return;
  }

  const playerTower = getTower();

  const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

  const obtainBadge = s => {
    if (s.obtain === 'shop') {
      if (s.tower === playerTower) {
        return `<span class="lib-obtain lib-obtain--shop">Available in Shop</span>`;
      }
      return `<span class="lib-obtain lib-obtain--drop" style="opacity:.55">Other Tower</span>`;
    }
    if (s.obtain === 'boss') return `<span class="lib-obtain lib-obtain--boss">Boss Drop</span>`;
    return `<span class="lib-obtain lib-obtain--drop">Drop Only</span>`;
  };

  /* damage estimate — same NON_DAMAGE logic as market */
  const NON_DAMAGE = [
    'buff', 'survival', 'support', 'recovery', 'regeneration',
    'cleanse', 'shield', 'defense', 'evasion', 'tempo',
    'summon', 'build', 'setup',
  ];
  const dmgRow = s => {
    const roleLower = (s.role || '').toLowerCase();
    const isDmg = s.role && !NON_DAMAGE.some(kw => roleLower.includes(kw));
    if (isDmg && typeof spellPower === 'function') {
      const player = getPlayer();
      if (player) {
        const dmg = spellPower(s, player, 1);
        return `<span class="spell-expand-dmg c-ok">~${dmg}</span>`;
      }
    }
    return `<span class="spell-expand-dmg" style="color:var(--c-text-2)">No direct damage</span>`;
  };

  /* check if player owns any of this spell */
  const ownedMap = {};
  (getState().spells || []).forEach(sp => {
    ownedMap[sp.id] = (ownedMap[sp.id] || 0) + sp.qty;
  });

  list.innerHTML = spells.map(s => {
    const owned = ownedMap[s.id] || 0;
    const ownedSuffix = owned > 0 ? ` <span class="lib-owned-tag">×${owned}</span>` : '';
    return `
    <div class="card card--raised lib-spell-card">
      <div class="shop-card-top">
        <img src="/asset/spell_icons/${s.id}.png" class="shop-spell-icon" alt="">
        <div class="shop-card-info">
          <div class="spell-card__name">${s.name}</div>
          <div class="spell-card__meta">${s.role} · SP ${s.spCost}</div>
          <div class="spell-card__desc">${s.desc}</div>
        </div>
        <div class="shop-card-badges">
          <span class="badge badge--${s.rarity}">${cap(s.rarity)}</span>
          <span class="badge badge--${s.tower}">${s.element || cap(s.tower)}</span>
        </div>
      </div>
      <div class="lib-detail-panel">
        <div class="spell-expand-row"><span>Effect</span><span class="spell-expand-val">${s.effect || s.desc}</span></div>
        <div class="spell-expand-row"><span>Est. Damage (Lv.1)</span>${dmgRow(s)}</div>
        <div class="spell-expand-row"><span>Rarity</span><span class="badge badge--${s.rarity}">${cap(s.rarity)}</span></div>
        <div class="spell-expand-row" style="border-bottom:none"><span>Where to Find</span><span>${obtainBadge(s)}${ownedSuffix}</span></div>
      </div>
    </div>`;
  }).join('');
}

onScreen('library', () => {
  if (_libTower === null) {
    _libTower = getTower() || 'all';
  }
  if (_libRarity === null) {
    _libRarity = 'all';
  }
  renderLibrary();
});