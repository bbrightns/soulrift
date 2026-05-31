/* ============================================================
   SOULRIFT — /js/state.js
   Single source of truth. All systems read/write here only.
   No framework. No imports. Loaded before all other scripts.
   ============================================================ */

'use strict';

/* ── Save key ────────────────────────────────────────────── */
const SAVE_KEY = 'soulrift_v1';

/* ── Default shape ───────────────────────────────────────── */
const DEFAULTS = {
  _version: '1.0.0',

  /* Player */
  player: {
    name:         'Riftwalker',
    level:        1,
    exp:          0,
    expNext:      100,
    hp:           80,
    hpMax:        80,
    sp:           40,
    spMax:        40,
    atk:          10,
    def:          5,
    int:          8,
    agi:          6,
    str:          8,
  },

  /* Resources */
  gold: 1000,

  /* Player name (set during first-run name step) */
  playerName: 'Arcane Wanderer',

  /* Tower */
  tower:         null,    // 'light' | 'dark' | 'fire' | 'ice'
  towerChosen:   false,

  /* Spell inventory: [{ id, lvl, qty }] */
  spells: [],

  /* Other inventory */
  items:       [],
  equipment:   [],
  relics:      [],

  /* Battle blueprint — 10 slots, each is spellId or null */
  blueprint: Array(10).fill(null),

  /* Dungeon */
  dungeon: {
    active:    null,
    unlocked:  ['booby_forest'],
    history:   {},
  },

  /* Settings */
  settings: {
    battleSpeed: 'normal',  // 'slow' | 'normal' | 'fast'
  },

  /* Meta */
  createdAt: null,
  savedAt:   null,
};

/* ── Live state ──────────────────────────────────────────── */
let _state = null;

/* ── Helpers ─────────────────────────────────────────────── */
function _clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* Safely merge a saved object onto the default shape.
   Prevents crashes when old saves are missing new keys. */
function _hydrate(saved) {
  const base = _clone(DEFAULTS);
  if (!saved) return base;
  for (const k of Object.keys(base)) {
    if (saved[k] === undefined) continue;
    const bv = base[k], sv = saved[k];
    if (bv !== null && typeof bv === 'object' && !Array.isArray(bv)
        && typeof sv === 'object' && !Array.isArray(sv)) {
      base[k] = { ...bv, ...sv };
    } else {
      base[k] = sv;
    }
  }
  return base;
}

/* ── Public API ──────────────────────────────────────────── */

/** Return live state, loading from localStorage if needed. */
function getState() {
  if (_state) return _state;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    _state = raw ? _hydrate(JSON.parse(raw)) : _clone(DEFAULTS);
    if (!_state.createdAt) _state.createdAt = Date.now();
  } catch (e) {
    console.warn('[state] Load failed, resetting.', e);
    _state = _clone(DEFAULTS);
    _state.createdAt = Date.now();
  }
  return _state;
}

/** Persist current state to localStorage. */
function saveState() {
  if (!_state) return;
  _state.savedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.error('[state] Save failed.', e);
  }
}

/** Shallow-merge a patch object into state, then save. */
function patchState(patch) {
  const s = getState();
  for (const k of Object.keys(patch)) {
    const sv = s[k], pv = patch[k];
    if (sv !== null && typeof sv === 'object' && !Array.isArray(sv)
        && pv !== null && typeof pv === 'object' && !Array.isArray(pv)) {
      s[k] = { ...sv, ...pv };
    } else {
      s[k] = pv;
    }
  }
  saveState();
}

/** Wipe save and return fresh default state. */
function resetState() {
  localStorage.removeItem(SAVE_KEY);
  _state = _clone(DEFAULTS);
  _state.createdAt = Date.now();
  return _state;
}

/* ── Convenience accessors ───────────────────────────────── */
function getPlayer()     { return getState().player; }
function getGold()       { return getState().gold; }
function getTower()      { return getState().tower; }
function getBlueprint()  { return getState().blueprint; }
function getSpells()     { return getState().spells; }
function getPlayerName() { return getState().playerName || 'Arcane Wanderer'; }

/* ── Gold helpers ────────────────────────────────────────── */
function addGold(n) {
  getState().gold += n;
  saveState();
}

/** Returns false if insufficient funds, otherwise deducts and saves. */
function spendGold(n) {
  const s = getState();
  if (s.gold < n) return false;
  s.gold -= n;
  saveState();
  return true;
}

/* ── Spell helpers ───────────────────────────────────────── */
function hasSpell(id) {
  return getSpells().some(s => s.id === id);
}

function giveSpell(id, lvl = 1) {
  const list = getSpells();
  const found = list.find(s => s.id === id && s.lvl === lvl);
  if (found) { found.qty++; }
  else       { list.push({ id, lvl, qty: 1 }); }
  saveState();
}

function removeSpell(id, lvl, qty = 1) {
  const list = getSpells();
  const found = list.find(s => s.id === id && s.lvl === lvl);
  if (!found) return false;
  found.qty -= qty;
  if (found.qty <= 0) {
    const idx = list.indexOf(found);
    list.splice(idx, 1);
  }
  saveState();
  return true;
}
window.removeSpell = removeSpell;

const TOWER_STARTERS = {
  light: {
    spellId: 'light_shot',
    player: { hp: 92,  hpMax: 92,  sp: 56, spMax: 56, atk: 7,  def: 8, int: 10, agi: 6,  str: 6  },
  },
  dark: {
    spellId: 'dark_shot',
    player: { hp: 60,  hpMax: 60,  sp: 44, spMax: 44, atk: 13, def: 3, int: 8,  agi: 11, str: 6  },
  },
  fire: {
    spellId: 'fire_shot',
    player: { hp: 104, hpMax: 104, sp: 32, spMax: 32, atk: 12, def: 7, int: 6,  agi: 6,  str: 11 },
  },
  ice: {
    spellId: 'ice_shot',
    player: { hp: 56,  hpMax: 56,  sp: 68, spMax: 68, atk: 8,  def: 4, int: 13, agi: 7,  str: 5  },
  },
};

function applyTowerStart(tower, playerName) {
  const config = TOWER_STARTERS[tower];
  if (!config) return false;

  const s = getState();
  s.tower = tower;
  s.towerChosen = true;
  s.playerName = playerName || 'Arcane Wanderer';
  s.player = { ...s.player, ...config.player };

  for (let i = 0; i < 3; i++) {
    const found = s.spells.find(spell => spell.id === config.spellId && spell.lvl === 1);
    if (found) found.qty++;
    else s.spells.push({ id: config.spellId, lvl: 1, qty: 1 });
  }

  s.blueprint = Array(10).fill(config.spellId + '|1');
  saveState();
  return true;
}

/* ── Blueprint helpers ───────────────────────────────────── */
function setBlueprintSlot(i, spellId) {
  const bp = getState().blueprint;
  if (i >= 0 && i < 10) { bp[i] = spellId ?? null; saveState(); }
}

function clearBlueprint() {
  getState().blueprint = Array(10).fill(null);
  saveState();
}

/* ── Auto-save before tab close ──────────────────────────── */
window.addEventListener('beforeunload', saveState);
