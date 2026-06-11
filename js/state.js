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
    str:          8,
    skillPoints:  0,   /* unspent stat points from level-ups */
    spentPoints:  { str: 0, int: 0, atk: 0, def: 0 },
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

  /* Lifetime stats */
  stats: {
    battles:   0,
    wins:      0,
    kills:     0,
    goldEarned: 0,
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
function _mergeDeep(base, saved) {
  const out = { ...base };
  for (const k of Object.keys(base)) {
    if (saved[k] === undefined || saved[k] === null) continue;
    const bv = base[k], sv = saved[k];
    if (
      bv !== null && typeof bv === 'object' && !Array.isArray(bv) &&
      sv !== null && typeof sv === 'object' && !Array.isArray(sv)
    ) {
      out[k] = _mergeDeep(bv, sv);
    } else {
      out[k] = sv;
    }
  }
  return out;
}

function _hydrate(saved) {
  if (!saved) return _clone(DEFAULTS);
  return _mergeDeep(_clone(DEFAULTS), saved);
}

/* ── Public API ──────────────────────────────────────────── */

function _sanitize(s) {
  // Top-level numeric fields
  const numericTop = ['gold'];
  numericTop.forEach(k => {
    if (typeof s[k] !== 'number' || !isFinite(s[k])) s[k] = DEFAULTS[k];
  });
  // Player numeric fields
  const numericPlayer = ['level','exp','expNext','hp','hpMax','sp','spMax',
                         'atk','def','int','str','skillPoints'];
  numericPlayer.forEach(k => {
    const v = s.player[k];
    if (typeof v !== 'number' || !isFinite(v)) s.player[k] = DEFAULTS.player[k];
  });
  if (!s.player.spentPoints) {
    s.player.spentPoints = { str: 0, int: 0, atk: 0, def: 0 };
  }
  // Blueprint must be a 10-element array
  if (!Array.isArray(s.blueprint) || s.blueprint.length !== 10) {
    s.blueprint = Array(10).fill(null);
  }
  return s;
}

function getState() {
  if (_state) return _state;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    _state = raw ? _hydrate(JSON.parse(raw)) : _clone(DEFAULTS);
    _sanitize(_state);
    if (_state.towerChosen) {
      recalculatePlayerStats();
    }
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

/* ── Skill Point Allocation ──────────────────────────────── */
/* HP_PER_STR and SP_PER_INT are defined in battle.js         */
function spendSkillPoint(stat) {
  const s = getState();
  if (!s.player.skillPoints || s.player.skillPoints < 1) return;
  const validStats = ['str', 'int', 'atk', 'def'];
  if (!validStats.includes(stat)) return;

  if (!s.player.spentPoints) {
    s.player.spentPoints = { str: 0, int: 0, atk: 0, def: 0 };
  }
  s.player.spentPoints[stat]++;

  recalculatePlayerStats();
  saveState();
  if (typeof syncHeader         === 'function') syncHeader();
  if (typeof renderProfilePanel === 'function') renderProfilePanel();
}
window.spendSkillPoint = spendSkillPoint;

const TOWER_GROWTH = {
  light: { str: 1, int: 1, atk: 0, def: 4 },
  dark:  { str: 1, int: 0, atk: 4, def: 1 },
  fire:  { str: 3, int: 0, atk: 3, def: 0 },
  ice:   { str: 1, int: 3, atk: 1, def: 1 },
};
window.TOWER_GROWTH = TOWER_GROWTH;

const TOWER_STARTERS = {
  light: {
    spellId: 'light_shot',
    player: { hp: 110, hpMax: 110, sp: 60, spMax: 60, atk: 7,  def: 16, int: 12, str: 11, skillPoints: 3, spentPoints: { str: 0, int: 0, atk: 0, def: 0 } },
  },
  dark: {
    spellId: 'dark_shot',
    player: { hp: 60,  hpMax: 60,  sp: 45, spMax: 45, atk: 15, def: 3,  int: 9,  str: 6,  skillPoints: 3, spentPoints: { str: 0, int: 0, atk: 0, def: 0 } },
  },
  fire: {
    spellId: 'fire_shot',
    player: { hp: 90,  hpMax: 90,  sp: 30, spMax: 30, atk: 13, def: 6,  int: 6,  str: 9,  skillPoints: 3, spentPoints: { str: 0, int: 0, atk: 0, def: 0 } },
  },
  ice: {
    spellId: 'ice_shot',
    player: { hp: 50,  hpMax: 50,  sp: 75, spMax: 75, atk: 8,  def: 8,  int: 15, str: 5,  skillPoints: 3, spentPoints: { str: 0, int: 0, atk: 0, def: 0 } },
  },
};

function recalculatePlayerStats() {
  const s = getState();
  if (!s.towerChosen || !s.tower) return;
  const starters = TOWER_STARTERS[s.tower];
  if (!starters) return;

  const g = TOWER_GROWTH[s.tower];
  const L = s.player.level;
  const levelsGained = L - 1;

  if (!s.player.spentPoints) {
    s.player.spentPoints = { str: 0, int: 0, atk: 0, def: 0 };
  }
  const spent = s.player.spentPoints;

  // Starter base + auto-growth per level + spent points
  let str = starters.player.str + levelsGained * g.str + spent.str;
  let int = starters.player.int + levelsGained * g.int + spent.int;
  let atk = starters.player.atk + levelsGained * g.atk + spent.atk;
  let def = starters.player.def + levelsGained * g.def + spent.def;

  // Milestone bonuses for every 5 levels
  const milestones = Math.floor(L / 5);
  str += milestones * 2;
  int += milestones * 2;
  atk += milestones * 2;
  def += milestones * 2;

  // Derive Max HP and Max SP from STR and INT
  let hpMax = str * 10;
  let spMax = int * 5;

  // Additional milestone direct HP/SP bonuses
  hpMax += milestones * 8;
  spMax += milestones * 4;

  s.player.str = str;
  s.player.int = int;
  s.player.atk = atk;
  s.player.def = def;
  s.player.hpMax = hpMax;
  s.player.spMax = spMax;

  // Clamp current values
  s.player.hp = Math.min(s.player.hpMax, Math.max(0, s.player.hp));
  s.player.sp = Math.min(s.player.spMax, Math.max(0, s.player.sp));

  // Pre-calculate remaining skill points
  // 3 points per level gained (starting from level 1, which starts with 3 points)
  // Plus 2 points per milestone reached
  const totalEarnedSkillPoints = L * 3 + milestones * 2;
  const totalSpentSkillPoints = spent.str + spent.int + spent.atk + spent.def;
  s.player.skillPoints = Math.max(0, totalEarnedSkillPoints - totalSpentSkillPoints);
}
window.recalculatePlayerStats = recalculatePlayerStats;

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

  s.blueprint = Array(10).fill(null);
  recalculatePlayerStats();
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
