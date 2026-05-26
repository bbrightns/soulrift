/* ============================================================
   SOULRIFT — ui.js
   Screen router, bottom nav, header sync, toast, utilities.
   Depends on: state.js loaded first.
   ============================================================ */

'use strict';

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
  const goldEl  = document.getElementById('hud-gold');
  const levelEl = document.getElementById('hud-level');
  const nameEl  = document.getElementById('hud-name');
  if (goldEl)  goldEl.textContent  = s.gold.toLocaleString();
  if (levelEl) levelEl.textContent = 'Lv ' + s.player.level;
  if (nameEl)  nameEl.textContent  = s.playerName || 'Arcane Wanderer';

  /* tower color theme on root */
  const app = document.getElementById('app');
  if (app && s.tower) app.dataset.tower = s.tower;
}

/* ── Profile panel ───────────────────────────────────────── */
function openProfilePanel() {
  if (!getState().towerChosen) return;   /* no profile before tower select */
  renderProfilePanel();
  document.getElementById('profile-panel').classList.add('is-open');
}

function closeProfilePanel() {
  document.getElementById('profile-panel').classList.remove('is-open');
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
  fill('prof-hp',     p.hp + ' / ' + p.hpMax);
  fill('prof-sp',     p.sp + ' / ' + p.spMax);
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
}

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
