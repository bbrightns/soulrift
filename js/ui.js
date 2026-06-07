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
  el._modalTrap = function(e) {
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
  if (_prevFocusEl) { try { _prevFocusEl.focus(); } catch (_) {} _prevFocusEl = null; }
}

/* ── Screen map: key → HTML id ───────────────────────────── */
const SCREENS = {
  battle:  'screen-battle',
  order:   'screen-order',
  market:  'screen-market',
  items:   'screen-items',
  fusion:  'screen-fusion',
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
  const goldEl  = document.getElementById('hud-gold-val');
  const levelEl = document.getElementById('hud-level');
  if (goldEl)  goldEl.textContent  = s.gold.toLocaleString();
  if (levelEl) levelEl.textContent = 'LV ' + s.player.level;

  /* tower color theme on root */
  const app = document.getElementById('app');
  if (app && s.tower) app.dataset.tower = s.tower;

  /* tower icon */
  const towerIcons = { fire: '🔥', dark: '🌑', ice: '❄️', light: '☀️' };
  const iconEl = document.getElementById('hud-tower-icon');
  if (iconEl) iconEl.textContent = towerIcons[s.tower] || '';

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
  const nameEl  = document.getElementById('prof-name');
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
  const panel = document.getElementById('profile-panel');
  _closeModal(panel);
  panel.classList.remove('is-open');
}

function renderProfilePanel() {
  const s  = getState();
  const p  = s.player;
  const towerNames = {
    light: '✦ Light Tower',
    dark:  '◐ Dark Tower',
    fire:  '△ Fire Tower',
    ice:   '◇ Ice Tower',
  };
  const towerBadge = {
    light: 'badge--light',
    dark:  'badge--dark',
    fire:  'badge--fire',
    ice:   'badge--ice',
  };
  const towerAvatars = { light: '✦', dark: '◐', fire: '△', ice: '◇' };

  const fill = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  fill('prof-name',   s.playerName || 'Arcane Wanderer');
  fill('prof-avatar', towerAvatars[s.tower] || '✦');
  fill('prof-tower',  towerNames[s.tower] || '—');
  fill('prof-level',  p.level);
  fill('prof-exp',    p.exp + ' / ' + p.expNext);
  fill('prof-hp',     p.hpMax);
  fill('prof-sp',     p.spMax);
  fill('prof-gold',   s.gold.toLocaleString());
  fill('prof-str',    p.str);
  fill('prof-atk',    p.atk);
  fill('prof-int',    p.int);
  fill('prof-agi',    p.agi);
  fill('prof-def',    p.def);

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
  fill('prof-stat-battles', (st.battles  || 0).toLocaleString());
  fill('prof-stat-wins',    (st.wins     || 0).toLocaleString());
  fill('prof-stat-kills',   (st.kills    || 0).toLocaleString());
  fill('prof-stat-gold',    (st.goldEarned || 0).toLocaleString());

  /* avatar tower glow — use design tokens */
  const towerGlowToken = {
    fire: 'var(--glow-fire)', dark: 'var(--glow-dark)',
    light: 'var(--glow-light)', ice: 'var(--glow-ice)',
  };
  const avatarEl = document.getElementById('prof-avatar');
  if (avatarEl) avatarEl.style.boxShadow = towerGlowToken[s.tower] || 'none';
}

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
function fmtNum(n)     { return Number(n).toLocaleString(); }
function fmtPct(n)     { return Math.round(n * 100) + '%'; }

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
let _libTower  = null;
let _libRarity = 'all';

function renderLibrary() {
  _renderLibFilters();
  _renderLibCards();
}

function _renderLibFilters() {
  const towerEl  = document.getElementById('library-tower-filter');
  const rarityEl = document.getElementById('library-rarity-filter');
  if (!towerEl || !rarityEl) return;

  const towers  = ['light', 'dark', 'fire', 'ice'];
  const tLabels = { light: 'Light', dark: 'Dark', fire: 'Fire', ice: 'Ice' };
  const allTowers = ['all', ...towers];
  const tAllLabels = { all: 'All', ...tLabels };

  towerEl.innerHTML = allTowers.map(t => {
    const on = t === _libTower;
    return `<button class="btn btn--ghost" style="opacity:${on ? '1' : '0.45'};padding:0 var(--sp-3);min-height:32px;font-size:12px;"
      onclick="_libTower='${t}';renderLibrary();">${tAllLabels[t]}</button>`;
  }).join('');

  const rarities = ['all', 'common', 'uncommon', 'rare', 'ultimate'];
  const rLabels  = { all: 'All', common: 'Common', uncommon: 'Uncommon', rare: 'Rare', ultimate: 'Ultimate' };

  rarityEl.innerHTML = rarities.map(r => {
    const on = r === _libRarity;
    return `<button class="btn btn--ghost" style="opacity:${on ? '1' : '0.45'};padding:0 var(--sp-3);min-height:32px;font-size:12px;"
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

  const obtainBadge = s => {
    if (s.obtain === 'shop') return `<span class="lib-obtain lib-obtain--shop">Available in Shop</span>`;
    if (s.obtain === 'boss') return `<span class="lib-obtain lib-obtain--boss">Boss Drop</span>`;
    return                          `<span class="lib-obtain lib-obtain--drop">Drop Only</span>`;
  };

  const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

  list.innerHTML = spells.map(s => `
    <div class="card card--raised lib-spell-card">
      <div class="lib-card-head">
        <img src="/asset/spell_icons/${s.id}.png" class="lib-spell-icon" alt="">
        <div class="lib-card-head-text">
          <span class="lib-spell-name">${s.name}</span>
          <div class="lib-card-tagline">${s.desc}</div>
        </div>
        <div class="lib-card-head-badges">
          <span class="badge badge--${s.rarity}">${cap(s.rarity)}</span>
          <span class="badge badge--${s.tower}">${s.element}</span>
        </div>
      </div>
      <div class="lib-card-meta">
        <span class="lib-role">${s.role}</span>
        <span class="lib-sp">SP ${s.spCost}</span>
      </div>
      <div class="lib-card-effect">${s.effect}</div>
      <div class="lib-card-foot">${obtainBadge(s)}</div>
    </div>
  `).join('');
}

onScreen('library', () => {
  _libTower  = 'all';
  _libRarity = 'all';
  renderLibrary();
});