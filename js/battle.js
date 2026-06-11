/* ============================================================
   SOULRIFT - /js/battle.js
   Dungeon entry screen + automatic 10-turn text battle.
   ============================================================ */

'use strict';

let _battleRunning = false;
let _selectedDungeonId = 'booby_forest';
let _preparedEnemyTemplate = null;
let _autoLoopEnabled = false;
let _autoLoopTimeout = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const BATTLE_SPEED = {
  slow: { min: 1800, max: 2200 },
  normal: { min: 1200, max: 1500 },
  fast: { min: 280, max: 420 },
};

function randDelay() {
  const speed = (getState().settings && getState().settings.battleSpeed) || 'normal';
  const { min, max } = BATTLE_SPEED[speed] || BATTLE_SPEED.normal;
  return min + Math.floor(Math.random() * (max - min + 1));
}

function scaleRewardByLevel(base, playerLevel, dungeonLevelReq) {
  const gap = playerLevel - dungeonLevelReq;
  if (gap <= 5) return base;
  if (gap >= 20) return Math.max(1, Math.floor(base * 0.10));
  const t = (gap - 5) / 15;
  const mult = 1 - t * 0.90;
  return Math.max(1, Math.floor(base * mult));
}

function enemyAvatarHTML(enemyTemplate) {
  return '<img src="/asset/enemy_avatars/' + enemyTemplate.id + '.png" '
    + 'class="log-spell-icon log-spell-icon--enemy" alt="">';
}

function getDungeonPerks() {
  const dungeon = window.getDungeonDef ? getDungeonDef(_selectedDungeonId) : null;
  return (dungeon && Array.isArray(dungeon.perks)) ? dungeon.perks : [];
}

function getPerk(type) {
  return getDungeonPerks().find(p => p.type === type) || null;
}

function clampPct(current, max) {
  if (!max || max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / max) * 100)));
}

function setFill(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function spellPower(def, player, spellLvl) {
  const lvl = spellLvl || 1;
  if (!def) return Math.max(4, Math.floor(player.atk * 0.45));

  const tower = getTower();
  let statBase;
  if (tower === 'light') statBase = Math.floor(player.int * 1.1 + player.def * 0.4);
  else if (tower === 'dark') statBase = Math.floor(player.atk * 1.3);
  else if (tower === 'fire') statBase = Math.floor(player.atk * 0.8 + player.str * 0.5);
  else if (tower === 'ice') statBase = Math.floor(player.int * 0.9 + player.sp * 0.15);
  else statBase = Math.floor((player.atk + player.int) * 0.75);

  const base = Math.max(5, statBase);
  const towerBonus = def.tower === tower ? 4 : 0;
  const roleBonus = def.role.toLowerCase().includes('basic') ? 0 : 3;
  const levelBonus = Math.floor((lvl - 1) * 0.18 * (base + towerBonus + roleBonus));
  return base + towerBonus + roleBonus + levelBonus;
}

function struggleDamage(player, enemy) {
  return Math.max(2, Math.floor(player.str * 0.4) - Math.floor(enemy.def * 0.5));
}

function enemyStrike(enemy, player, turn) {
  const raw = enemy.atk + Math.floor(turn * 0.8);
  return Math.max(2, raw - Math.floor(player.def * 0.45));
}

const HP_PER_STR = 10;
const SP_PER_INT = 5;
const SKILL_POINTS_PER_LEVEL = 3;

function gainExp(amount) {
  const s = getState();
  const p = s.player;
  p.exp += amount;

  let leveled = false;
  while (p.exp >= p.expNext) {
    p.exp -= p.expNext;
    p.level += 1;
    p.expNext = Math.floor(p.expNext * 1.25);
    leveled = true;
    if (typeof SFX !== 'undefined') SFX.levelUp();

    if (s.player.level % 5 === 0) {
      if (typeof toast === 'function') toast('Power Surge! Level ' + s.player.level + ' milestone reached!', 'gold');
    }
  }

  if (leveled) {
    recalculatePlayerStats();
    // Heal player to full on level up
    s.player.hp = s.player.hpMax;
    s.player.sp = s.player.spMax;
    saveState();
    syncHeader();
  } else {
    saveState();
  }
}

function battlePlayerName() {
  return getPlayerName ? getPlayerName() : 'Riftwalker';
}

function logName() {
  return '<span class="log-name">' + battlePlayerName() + '</span>';
}

function dungeonIcon(icon) {
  const icons = { leaf: '&#10087;', skull: '&#9760;' };
  return icons[icon] || '&#9670;';
}

function renderDungeonList() {
  const wrap = document.getElementById('dungeon-list');
  if (!wrap) return;

  const s = getState();
  const dungeons = window.DUNGEONS_DATA || [];
  const allEnemies = window.ENEMIES_DATA || [];

  wrap.innerHTML = dungeons.map(dungeon => {
    const unlocked = dungeon.unlocked && s.player.level >= dungeon.levelReq;
    const stateClass = unlocked ? '' : ' is-locked';
    const action = unlocked
      ? '<button class="dungeon-enter">Enter Battle</button>'
      : '<div class="dungeon-locked">Locked - Reach Level ' + dungeon.levelReq + '</div>';
    const lock = unlocked ? '' : '<div class="dungeon-lock" aria-hidden="true">&#128274;</div>';
    const onclick = unlocked ? " onclick=\"enterDungeon('" + dungeon.id + "')\"" : '';

    const enemies = allEnemies.filter(e => e.dungeonId === dungeon.id);
    let expLabel, goldLabel;
    if (enemies.length === 0) {
      expLabel = '—';
      goldLabel = '—';
    } else {
      const expMin = Math.min(...enemies.map(e => e.exp));
      const expMax = Math.max(...enemies.map(e => e.exp));
      const goldMin = Math.min(...enemies.map(e => e.gold));
      const goldMax = Math.max(...enemies.map(e => e.gold));
      expLabel = '+' + expMin + '~' + expMax;
      goldLabel = '+' + goldMin + '~' + goldMax;
    }

    return ''
      + '<article class="dungeon-card' + stateClass + '"' + onclick + '>'
      + '  <div class="dungeon-scene">'
      + '    <img src="' + dungeon.image + '" alt="' + dungeon.name + '" loading="lazy">'
      + '    <div class="firefly f1"></div>'
      + '    <div class="firefly f2"></div>'
      + '    <div class="firefly f3"></div>'
      + '    <div class="dungeon-level-badge">LV. ' + dungeon.levelReq + '</div>'
      + '    <div class="dungeon-overlay-text">'
      + '      <div class="dungeon-tag">' + (dungeon.tag || '') + '</div>'
      + '      <div class="dungeon-hero-name">' + dungeon.name + '</div>'
      + '    </div>'
      + lock
      + '  </div>'
      + '  <div class="dungeon-gold-accent"></div>'
      + '  <div class="dungeon-body">'
      + '    <div class="dungeon-desc">' + dungeon.description + '</div>'
      + '    <div class="dungeon-rewards">'
      + '      <div class="dungeon-pill"><span class="dungeon-pill-label">Experience</span><span class="dungeon-pill-val">' + expLabel + '</span></div>'
      + '      <div class="dungeon-pill"><span class="dungeon-pill-label">Gold</span><span class="dungeon-pill-val">' + goldLabel + '</span></div>'
      + '      <div class="dungeon-pill"><span class="dungeon-pill-label">Difficulty</span><span class="dungeon-pill-val diff-' + (dungeon.difficulty || '').toLowerCase() + '">' + (dungeon.difficulty || '') + '</span></div>'
      + '    </div>'
      + '  </div>'
      + '  ' + action
      + '</article>';
  }).join('');
}

function showDungeonView() {
  const dungeonView = document.getElementById('battle-dungeon-view');
  const arenaView = document.getElementById('battle-arena-view');
  if (dungeonView) dungeonView.classList.remove('is-hidden');
  if (arenaView) arenaView.classList.add('is-hidden');
  renderDungeonList();
  document.querySelector('#screen-battle .screen-sub').style.display = '';
}

function showArenaView(dungeonId) {
  const dungeonView = document.getElementById('battle-dungeon-view');
  const arenaView = document.getElementById('battle-arena-view');
  const dungeon = window.getDungeonDef ? getDungeonDef(dungeonId) : null;
  if (dungeonView) dungeonView.classList.add('is-hidden');
  if (arenaView) arenaView.classList.remove('is-hidden');
  setText('arena-dungeon-name', dungeon ? dungeon.name : 'Unknown Rift');
  document.querySelector('#screen-battle .screen-sub').style.display = 'none';
}

function _hasEmptyFillableSlot() {
  const bp = getState().blueprint;
  const spells = getSpells();
  if (!spells.length) return false;

  const hasEmpty = bp.some(slot => !slot);
  if (!hasEmpty) return false;

  const usedSP = bp.reduce((sum, slot) => {
    if (!slot) return sum;
    const def = getSpellDef(slot.split('|')[0]);
    return sum + (def ? def.spCost : 0);
  }, 0);

  const remainingSP = getState().player.spMax - usedSP;
  if (remainingSP <= 0) return false;

  const minCost = Math.min(...spells.map(s => {
    const def = getSpellDef(s.id);
    return def ? def.spCost : Infinity;
  }));

  return remainingSP >= minCost;
}

let _pendingDungeonId = null;

function _showAllEmptyConfirm() {
  const modal = document.getElementById('shop-confirm-modal');
  const body  = document.getElementById('shop-confirm-body');
  if (!modal || !body) return;

  body.innerHTML =
    '<div class="modal-icon">⚔️</div>'
    + '<div class="modal-title" id="modal-confirm-title">No Spells Assigned</div>'
    + '<div class="modal-body">Your blueprint is empty.</div>'
    + '<div class="modal-hint">All 10 turns will use Struggle (weak fallback attack). Visit Order to assign spells first.</div>';

  const confirmBtn = modal.querySelector('.btn--primary');
  const cancelBtn  = modal.querySelector('.btn--ghost');
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Enter Anyway';
    confirmBtn.onclick = _confirmEmptySlotBattle;
  }
  if (cancelBtn) cancelBtn.textContent = 'Go Back';

  modal.setAttribute('aria-labelledby', 'modal-confirm-title');
  modal.classList.remove('is-hidden');
  if (typeof _openModal === 'function') _openModal(modal);
}

function _showEmptySlotConfirm() {
  const modal = document.getElementById('shop-confirm-modal');
  const body = document.getElementById('shop-confirm-body');
  if (!modal || !body) return;

  const bp = getState().blueprint;
  const empty = bp.filter(s => !s).length;
  const filled = bp.filter(s => !!s).length;

  body.innerHTML =
    '<div class="modal-icon">⚔️</div>'
    + '<div class="modal-title" id="modal-confirm-title">Empty Slots Detected</div>'
    + '<div class="modal-body">'
    + filled + ' / 10 slots filled · <span class="modal-stat--bad">' + empty + ' empty</span>'
    + '</div>'
    + '<div class="modal-hint">Empty turns will use Struggle (weak fallback attack). Continue anyway?</div>';

  const confirmBtn = modal.querySelector('.btn--primary');
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Enter Battle';
    confirmBtn.onclick = _confirmEmptySlotBattle;
  }

  const cancelBtn = modal.querySelector('.btn--ghost');
  if (cancelBtn) cancelBtn.textContent = 'Go Back';

  modal.setAttribute('aria-labelledby', 'modal-confirm-title');
  modal.classList.remove('is-hidden');
  if (typeof _openModal === 'function') _openModal(modal);
}

function _confirmEmptySlotBattle() {
  closeShopConfirm();
  const dungeonId = _pendingDungeonId;
  _pendingDungeonId = null;

  const confirmBtn = document.querySelector('#shop-confirm-modal .btn--primary');
  if (confirmBtn) {
    confirmBtn.textContent = 'Confirm';
    confirmBtn.onclick = confirmShopBuy;
  }

  _selectedDungeonId = dungeonId;
  showArenaView(dungeonId);
  prepareArena(dungeonId);
}

async function enterDungeon(dungeonId) {
  if (_battleRunning) return;

  const dungeon = window.getDungeonDef ? getDungeonDef(dungeonId) : null;
  const level = getState().player.level;
  if (!dungeon || !dungeon.unlocked || level < dungeon.levelReq) {
    toast('This dungeon is still locked.', 'bad');
    return;
  }

  if (getState().blueprint.every(slot => !slot)) {
    _pendingDungeonId = dungeonId;
    _showAllEmptyConfirm();
    return;
  }

  if (_hasEmptyFillableSlot()) {
    _pendingDungeonId = dungeonId;
    _showEmptySlotConfirm();
    return;
  }

  _selectedDungeonId = dungeonId;
  showArenaView(dungeonId);
  prepareArena(dungeonId);
}

function leaveBattleArena() {
  if (_battleRunning) {
    toast('Battle is still running.', 'gold');
    return;
  }
  if (_autoLoopTimeout) {
    clearTimeout(_autoLoopTimeout);
    _autoLoopTimeout = null;
  }
  _autoLoopEnabled = false;
  showDungeonView();
}

let _userScrolledLog = false;

async function appendBattleLog(line, type = '') {
  const logWrap = document.getElementById('battle-log');
  if (!logWrap) return;
  const entry = document.createElement('div');
  const typeClasses = type
    ? type.split(' ').map(t => 'battle-log-line--' + t).join(' ')
    : '';
  entry.className = 'battle-log-line' + (typeClasses ? ' ' + typeClasses : '');
  entry.innerHTML = line;
  logWrap.appendChild(entry);
  if (!_userScrolledLog) logWrap.scrollTop = logWrap.scrollHeight;
  await sleep(randDelay());
}

document.addEventListener('DOMContentLoaded', () => {
  const logWrap = document.getElementById('battle-log');
  if (!logWrap) return;
  logWrap.addEventListener('scroll', () => {
    const atBottom = logWrap.scrollHeight - logWrap.scrollTop - logWrap.clientHeight < 10;
    _userScrolledLog = !atBottom;
  });
});

function setBattleResult(html) {
  const result = document.getElementById('battle-result');
  if (result) result.innerHTML = html;
}

function setBattleButton(disabled, readyText = 'Fight Again') {
  const btn = document.getElementById('battle-start-btn');
  if (!btn) return;
  btn.disabled = disabled;
  btn.textContent = disabled ? 'Battle Running...' : readyText;
}

function updateAutoBtn() {
  const btn = document.getElementById('auto-loop-btn');
  if (!btn) return;
  btn.textContent = _autoLoopEnabled ? 'Auto ON' : 'Auto';
  btn.classList.toggle('is-active', _autoLoopEnabled);
}

function toggleAutoLoop() {
  _autoLoopEnabled = !_autoLoopEnabled;
  if (!_autoLoopEnabled && _autoLoopTimeout) {
    clearTimeout(_autoLoopTimeout);
    _autoLoopTimeout = null;
    if (!_battleRunning) setBattleButton(false, 'Fight Again');
  }
  updateAutoBtn();
}

function clearBattleOutcome() {
  const panel = document.getElementById('battle-result-panel');
  if (!panel) return;
  panel.className = 'battle-result-panel is-hidden';
  setText('battle-result-title', '');
  setText('battle-result-subtitle', '');
  setText('battle-result-rewards', '');
  const dropEl = document.getElementById('battle-drops');
  if (dropEl) dropEl.innerHTML = '';
}

function showBattleOutcome(outcome) {
  const panel = document.getElementById('battle-result-panel');
  if (!panel) return;

  const won = !!outcome.won;
  panel.className = 'battle-result-panel ' + (won ? 'battle-result-panel--victory' : 'battle-result-panel--defeat');
  setText('battle-result-title', won ? 'VICTORY' : 'DEFEAT');
  setText('battle-result-subtitle', won ? 'The Rift yields.' : 'The tower recalls you.');
  setText('battle-result-rewards', won
    ? '+' + outcome.goldReward + ' Gold  +' + outcome.expReward + ' EXP'
    : 'No rewards claimed'
  );

  const dropEl = document.getElementById('battle-drops');
  if (dropEl) {
    if (outcome.drops && outcome.drops.length > 0) {
      dropEl.innerHTML = outcome.drops.map(d => {
        const iconSrc = d.type === 'catalyst'
          ? '/asset/catalyst_icons/' + d.catalystId + '.png'
          : '/asset/spell_icons/' + d.spellId + '.png';
        return '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;">'
          + '<img src="' + iconSrc + '" style="width:28px;height:28px;border-radius:4px;object-fit:cover;" alt="">'
          + '<span class="c-gold" style="font-size:14px;letter-spacing:.04em;">You got <strong>' + d.name + '</strong>!</span>'
          + '</div>';
      }).join('');
    } else {
      dropEl.innerHTML = '';
    }
  }
}

function updateCombatHud(player, enemy, enemyTemplate) {
  setText('player-combat-name', battlePlayerName());
  setText('enemy-combat-name', enemy.name);

  const playerAvatarEl = document.getElementById('player-combat-avatar');
  const playerPlaceholder = document.getElementById('player-avatar-placeholder');
  const playerTower = getTower();
  if (playerAvatarEl) {
    if (playerTower) {
      playerAvatarEl.src = '/asset/player_avatars/' + playerTower + '.png';
      playerAvatarEl.style.display = 'block';
      if (playerPlaceholder) playerPlaceholder.style.display = 'none';
    } else {
      playerAvatarEl.style.display = 'none';
      if (playerPlaceholder) playerPlaceholder.style.display = '';
    }
  }

  const enemyAvatarEl = document.getElementById('enemy-combat-avatar');
  const enemyPlaceholder = document.getElementById('enemy-avatar-placeholder');
  if (enemyAvatarEl && enemyTemplate) {
    const id = enemy.name === '???' ? null : enemyTemplate.id;
    if (id) {
      enemyAvatarEl.src = '/asset/enemy_avatars/' + id + '.png';
      enemyAvatarEl.style.display = 'block';
      if (enemyPlaceholder) enemyPlaceholder.style.display = 'none';
    } else {
      enemyAvatarEl.style.display = 'none';
      if (enemyPlaceholder) enemyPlaceholder.style.display = '';
    }
  }

  const playerHpPct = clampPct(player.hp, player.hpMax) / 100;
  const playerSpPct = clampPct(player.sp, player.spMax) / 100;
  const enemyHpPct = clampPct(enemy.hp, enemyTemplate.hp) / 100;

  const playerHpFill = document.getElementById('player-hp-fill');
  const playerSpFill = document.getElementById('player-sp-fill');
  const enemyHpFill = document.getElementById('enemy-hp-fill');

  if (playerHpFill) playerHpFill.style.transform = 'scaleX(' + playerHpPct + ')';
  if (playerSpFill) playerSpFill.style.transform = 'scaleX(' + playerSpPct + ')';
  if (enemyHpFill) enemyHpFill.style.transform = 'scaleX(' + enemyHpPct + ')';

  setText('player-hp-text', 'HP ' + Math.max(0, player.hp) + ' / ' + Math.max(0, player.hpMax));
  setText('player-sp-text', 'SP ' + Math.max(0, player.sp) + ' / ' + Math.max(0, player.spMax));
  setText('enemy-hp-text', 'HP ' + enemy.hp + ' / ' + enemyTemplate.hp);
}

function prepareArena(dungeonId) {
  const activeDungeonId = dungeonId || _selectedDungeonId || 'booby_forest';
  _selectedDungeonId = activeDungeonId;
  _preparedEnemyTemplate = window.getRandomEnemy
    ? getRandomEnemy(activeDungeonId)
    : { name: 'Training Shadow', area: 'Booby Forest', hp: 45, atk: 7, def: 2, exp: 20, gold: 55, opener: 'A shadow stirs.' };

  const player = { ...getState().player, hp: getState().player.hpMax, sp: getState().player.spMax };
  const logWrap = document.getElementById('battle-log');

  if (logWrap) {
    logWrap.innerHTML = '<div class="battle-log-line">Prepare your 10-turn blueprint, then begin the fight.</div>';
  }
  clearBattleOutcome();

  const hudEl = document.getElementById('combat-hud');
  if (hudEl) {
    hudEl.classList.remove('hud--post-battle');
    hudEl.classList.add('hud--hidden-enemy');
    hudEl.style.display = '';
  }

  const hiddenEnemy = { ..._preparedEnemyTemplate, name: '???' };
  updateCombatHud(player, hiddenEnemy, _preparedEnemyTemplate);
  setText('enemy-hp-text', 'HP ?? / ??');
  setBattleResult('Ready for a 10-turn auto battle.');
  setBattleButton(false, 'Start Battle');
}

function formatItemName(id) {
  const names = {
    catalyst_shard: 'Catalyst Shard',
    catalyst_core: 'Catalyst Core',
    catalyst_crystal: 'Catalyst Crystal',
  };
  return names[id] || id;
}

function getRandomUncommonForTower() {
  const tower = getTower();
  if (!tower || !window.getAllSpells) return null;
  const pool = getAllSpells().filter(s => s.tower === tower && s.rarity === 'uncommon');
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function giveCatalyst(id) {
  const s = getState();
  if (!Array.isArray(s.items)) s.items = [];
  const existing = s.items.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { s.items.push({ id, qty: 1 }); }
}

const CLOCKTOWER_SPELL_TIERS = {
  light: { weak: 'angel_wing', mid: 'energy_blast', strong: 'charge_release_light_shot' },
  dark: { weak: 'siege', mid: 'night_raid', strong: 'dark_combo' },
  fire: { weak: 'melt_armor', mid: 'fire_storm', strong: 'explosion_burn' },
  ice: { weak: 'golem_command', mid: 'mana_combo', strong: 'mana_burst' },
};

const CODEX_SPELL_TIERS = {
  light: 'divine_reflection',
  dark: 'demon_summoning',
  fire: 'phoenix_blood',
  ice: 'absolute_zero',
};

function rollDrops(enemyTemplate) {
  const drops = [];
  if (!enemyTemplate || !Array.isArray(enemyTemplate.dropTable)) return drops;

  enemyTemplate.dropTable.forEach(entry => {
    const roll = Math.random();
    console.log('Drop roll: ' + roll + ', chance: ' + entry.chance);
    if (roll >= entry.chance) return;

    if (entry.type === 'catalyst') {
      giveCatalyst(entry.id);
      drops.push({ type: 'catalyst', catalystId: entry.id, name: formatItemName(entry.id) });

    } else if (entry.type === 'uncommon_spell_tiered') {
      const tower = getTower();
      const tierMap = CLOCKTOWER_SPELL_TIERS[tower];
      if (!tierMap) return;
      const spellId = tierMap[entry.tier];
      if (!spellId) return;
      const spell = getSpellDef(spellId);
      if (!spell) return;
      giveSpell(spellId, 1);
      drops.push({ type: 'spell', spellId, name: spell.name, rarity: 'uncommon' });

    } else if (entry.type === 'rare_spell_tiered') {
      const tower = getTower();
      const spellId = CODEX_SPELL_TIERS[tower];
      if (!spellId) return;
      const spell = getSpellDef(spellId);
      if (!spell) return;
      giveSpell(spellId, 1);
      drops.push({ type: 'spell', spellId, name: spell.name, rarity: 'rare' });
    }
  });

  return drops;
}

/* ============================================================
   MAIN BATTLE LOOP
   ============================================================ */

async function runAutoBattle(dungeonId) {
  if (_battleRunning) return;
  _battleRunning = true;

  const activeDungeonId = dungeonId || _selectedDungeonId || 'booby_forest';
  _selectedDungeonId = activeDungeonId;
  showArenaView(activeDungeonId);
  setBattleButton(true);

  const hudStartEl = document.getElementById('combat-hud');
  if (hudStartEl) {
    hudStartEl.classList.remove('hud--post-battle');
    hudStartEl.classList.remove('hud--hidden-enemy');
    hudStartEl.style.display = '';
  }

  const logWrap = document.getElementById('battle-log');
  if (logWrap) logWrap.innerHTML = '';
  _userScrolledLog = false;
  clearBattleOutcome();
  setBattleResult('<span class="c-gold">Battle running...</span>');

  const s = getState();

  // ── Validated blueprint ──────────────────────────────────
  const blueprint = s.blueprint.slice(0, 10);
  const validatedBlueprint = blueprint.map(slot => {
    if (!slot) return null;
    const parts = slot.split('|');
    const baseId = parts[0];
    const lvl = parseInt(parts[1]) || 1;
    const owned = s.spells.find(sp => sp.id === baseId && sp.lvl === lvl && sp.qty >= 1);
    return owned ? slot : null;
  });

  // ── Enemy template ───────────────────────────────────────
  const enemyTemplate = _preparedEnemyTemplate || (window.getRandomEnemy
    ? getRandomEnemy(activeDungeonId)
    : { name: 'Training Shadow', area: 'Booby Forest', hp: 45, atk: 7, def: 2, exp: 20, gold: 55, opener: 'A shadow stirs.' });
  _preparedEnemyTemplate = null;
  const enemy = { ...enemyTemplate };

  // ── Player — apply Ancient Pressure before battle ────────
  const player = { ...s.player, hp: s.player.hpMax, sp: s.player.spMax };
  const _ancientPressure = getPerk('ancient_pressure');
  if (_ancientPressure) {
    const _gap = Math.max(0, _ancientPressure.targetLevel - s.player.level);
    const _penalty = Math.min(0.90, _gap * _ancientPressure.penaltyPerLevel);
    if (_penalty > 0) {
      player.atk = Math.max(1, Math.floor(player.atk * (1 - _penalty)));
      player.int = Math.max(1, Math.floor(player.int * (1 - _penalty)));
      player.str = Math.max(1, Math.floor(player.str * (1 - _penalty)));
      player.def = Math.max(1, Math.floor(player.def * (1 - _penalty)));
    }
  }

  // ── Battle status ────────────────────────────────────────
  const battleStatus = {
    burnStacks: [],
    burnStackCount: 0,
    chargeStacks: 0,
    manaCombo: 0,
    totalGoldStolen: 0,
    enemyFrozen: false,
    curseActive: null,
    fogActive: null,
    regenStacks: [],
    angelWingActive: 0,
    demonStacks: [],
    golemStacks: [],
    fireStormStacks: [],
    emberSkinTurns: 0,
    emberSkinReduction: 0,
    divineReflect: 0,
    darkCombo: 0,
    riftPhaseTriggered: false,
    voidShieldBroken: false,
    voidShieldRemaining: enemyTemplate.voidShield ? enemyTemplate.voidShieldAmount : 0,
    _vsBreakLogged: false,
    smokeStackCount: 0,
    playerStunned: false,
    pendingQueue: [],     // [{ def, spellLvl, turnsLeft }] — queued by traffic jam
    hornStunTurn: null,   // rolled once at battle start for Limousine
    hornStunFired: false,
    realityFractureActive: false,
  };

  // Roll Limousine stun turn once
  if (enemyTemplate.hornStun && enemyTemplate.hornTurnRange) {
    const { min, max } = enemyTemplate.hornTurnRange;
    battleStatus.hornStunTurn = min + Math.floor(Math.random() * (max - min + 1));
  }

  updateCombatHud(player, enemy, enemyTemplate);
  await appendBattleLog('Battle begins in ' + enemy.area, 'system');

  // Warn about Ancient Pressure debuff
  if (_ancientPressure) {
    const _gap = Math.max(0, _ancientPressure.targetLevel - s.player.level);
    const _penalty = Math.min(0.90, _gap * _ancientPressure.penaltyPerLevel);
    if (_penalty >= 0.10) {
      await appendBattleLog(
        '⚠ Ancient Pressure: stats reduced by ' + Math.round(_penalty * 100) + '% (Lv.' + s.player.level + ' vs recommended Lv.' + _ancientPressure.targetLevel + ').',
        'warn'
      );
    }
  }

  await appendBattleLog(enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.opener), 'enemy');

  // ── Turn loop ────────────────────────────────────────────
  for (let turn = 1; turn <= 10; turn++) {
    await appendBattleLog('Turn ' + turn, 'turn');

    // Enemy regen
    if (enemyTemplate.regenPerTurn && enemy.hp > 0 && enemy.hp < enemyTemplate.hp) {
      const regen = enemyTemplate.regenPerTurn;
      enemy.hp = Math.min(enemyTemplate.hp, enemy.hp + regen);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' regenerates ' + regen + ' HP.'), 'enemy');
    }

    // Demon tick
    if (battleStatus.demonStacks.length > 0) {
      battleStatus.demonStacks = battleStatus.demonStacks.filter(d => d.turnsLeft > 0);
      const demonDmg = battleStatus.demonStacks.reduce((sum, d) => sum + d.power, 0);
      if (demonDmg > 0) {
        enemy.hp = Math.max(0, enemy.hp - demonDmg);
        battleStatus.demonStacks.forEach(d => d.turnsLeft--);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog('The demon strikes for ' + demonDmg + ' dark damage.', 'player');
        if (enemy.hp <= 0) break;
      }
    }

    // Golem tick
    if (battleStatus.golemStacks.length > 0) {
      battleStatus.golemStacks = battleStatus.golemStacks.filter(g => g.turnsLeft > 0);
      const golemDmg = battleStatus.golemStacks.reduce((sum, g) => sum + g.power, 0);
      if (golemDmg > 0) {
        enemy.hp = Math.max(0, enemy.hp - golemDmg);
        battleStatus.golemStacks.forEach(g => g.turnsLeft--);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog('The golem strikes for ' + golemDmg + ' ice damage.', 'player');
        if (enemy.hp <= 0) break;
      }
    }

    // Fire Storm tick
    if (battleStatus.fireStormStacks.length > 0) {
      battleStatus.fireStormStacks = battleStatus.fireStormStacks.filter(f => f.turnsLeft > 0);
      const stormDmg = battleStatus.fireStormStacks.reduce((sum, f) => sum + f.power, 0);
      if (stormDmg > 0) {
        enemy.hp = Math.max(0, enemy.hp - stormDmg);
        battleStatus.fireStormStacks.forEach(f => f.turnsLeft--);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog('Fire Storm scorches for ' + stormDmg + ' damage.', 'player');
        if (enemy.hp <= 0) break;
      }
    }

    // Burn tick
    battleStatus.burnStacks = battleStatus.burnStacks.filter(b => b.turnsLeft > 0);
    if (battleStatus.burnStacks.length > 0) {
      const burnDmg = battleStatus.burnStacks.reduce((sum, b) => sum + (b.power || Math.round(12 * 0.35)), 0);
      enemy.hp = Math.max(0, enemy.hp - burnDmg);
      battleStatus.burnStacks.forEach(b => b.turnsLeft--);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog('Burn deals ' + burnDmg + ' damage.', 'player');
      if (enemy.hp <= 0) break;
    }

    // Time Pressure (Cursed Clocktower)
    const timePressure = getPerk('time_pressure');
    const timePressureBonus = (timePressure && turn >= timePressure.startTurn)
      ? 1 + (turn - timePressure.startTurn + 1) * timePressure.atkBonusPerTurn
      : 1;

    // Curse tick-down
    if (battleStatus.curseActive && battleStatus.curseActive.turnsLeft > 0) {
      battleStatus.curseActive.turnsLeft--;
      if (battleStatus.curseActive.turnsLeft <= 0) {
        battleStatus.curseActive = null;
        await appendBattleLog(enemy.name + '\'s curse fades.', 'system');
      }
    }

    // Player regen (Chorus of Sanctuary)
    if (battleStatus.regenStacks.length > 0) {
      battleStatus.regenStacks = battleStatus.regenStacks.filter(r => r.turnsLeft > 0);
      const totalRegen = battleStatus.regenStacks.reduce((sum, r) => sum + r.amount, 0);
      if (totalRegen > 0) {
        player.hp = Math.min(player.hpMax, player.hp + totalRegen);
        battleStatus.regenStacks.forEach(r => r.turnsLeft--);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog('Sanctuary restores ' + totalRegen + ' HP.', 'player');
      }
    }

    // ── Enemy special abilities ────────────────────────────

    // Mana Rupture (First Arcanist)
    if (enemyTemplate.manaRupture && turn % enemyTemplate.manaRuptureInterval === 0) {
      const drained = Math.min(player.sp, enemyTemplate.manaRuptureDrain);
      player.sp = Math.max(0, player.sp - drained);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' Mana Rupture — drained ' + drained + ' SP!'),
        'enemy warn'
      );
    }

    // Street Food Vendor SP curse
    if (enemyTemplate.spCurse && turn % enemyTemplate.spCurseInterval === 0) {
      const spLost = Math.min(player.sp, enemyTemplate.spCurseAmount);
      player.sp = Math.max(0, player.sp - spLost);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText('Cursed food takes effect — ' + spLost + ' SP drained.'),
        'enemy warn'
      );
    }

    // Phase Shift (The Rift)
    if (enemyTemplate.phaseShift
      && !battleStatus.riftPhaseTriggered
      && enemy.hp <= Math.floor(enemyTemplate.hp * enemyTemplate.phaseShiftThreshold)) {
      battleStatus.riftPhaseTriggered = true;
      enemy.atk = Math.floor(enemy.atk * enemyTemplate.phaseShiftAtkMult);
      enemyTemplate.regenPerTurn = Math.floor((enemyTemplate.regenPerTurn || 0) * enemyTemplate.phaseShiftRegenMult);
      await appendBattleLog('— THE RIFT TEARS OPEN —', 'turn');
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' enters second phase. ATK surges. Reality accelerates.'),
        'enemy warn'
      );
    }

    // Reality Fracture (The Rift — set flag; consumed in castPreparedSpell)
    if (enemyTemplate.realityFracture && turn % enemyTemplate.realityFractureInterval === 0) {
      battleStatus.realityFractureActive = true;
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText('Reality fractures — your next spell is halved.'),
        'enemy warn'
      );
    }

    // Void Crush (Void Sentinel)
    if (enemyTemplate.voidCrush && turn % enemyTemplate.voidCrushInterval === 0) {
      const voidDmg = Math.floor(player.hpMax * enemyTemplate.voidCrushPct);
      player.hp = Math.max(0, player.hp - voidDmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' VOID CRUSH — ' + voidDmg + ' true damage!'),
        'enemy warn'
      );
      if (player.hp <= 0) break;
    }

    // Horn Stun (Limousine) — fires once on the pre-rolled turn
    if (
      enemyTemplate.hornStun &&
      !battleStatus.hornStunFired &&
      battleStatus.hornStunTurn === turn
    ) {
      battleStatus.hornStunFired = true;
      battleStatus.playerStunned = true;
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' lays on the horn. Your next cast is lost.'),
        'enemy warn'
      );
    }

    // Void Shield — announce on turn 1
    if (enemyTemplate.voidShield && turn === 1 && !battleStatus.voidShieldBroken) {
      await appendBattleLog(
        enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' is shielded by the void (' + battleStatus.voidShieldRemaining + ' HP to break).'),
        'system'
      );
    }

    // ── Enemy attack ───────────────────────────────────────
    if (battleStatus.enemyFrozen) {
      battleStatus.enemyFrozen = false;
      await appendBattleLog(enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' is frozen and cannot act this turn.'), 'enemy');
    } else {
      let missed = false;
      if (battleStatus.fogActive && battleStatus.fogActive.turnsLeft > 0) {
        if (Math.random() < battleStatus.fogActive.missChance) {
          missed = true;
          await appendBattleLog(enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' attacks but misses through the fog!'), 'enemy');
        }
        battleStatus.fogActive.turnsLeft--;
        if (battleStatus.fogActive.turnsLeft <= 0) battleStatus.fogActive = null;
      }

      if (!missed) {
        let dodged = false;
        if (battleStatus.angelWingActive > 0) {
          if (Math.random() < battleStatus.angelWingActive) {
            dodged = true;
            await appendBattleLog(enemy.name + ' attacks but ' + logName() + ' dodges with Angel Wing!', 'player');
          }
          battleStatus.angelWingActive = 0;
        }

        if (!dodged) {
          // Entropy Strike bypasses 40% of player DEF
          let hit;
          if (enemyTemplate.entropyStrike) {
            const bypassedDef = Math.floor(player.def * enemyTemplate.entropyDefBypass);
            const rawAtk = enemy.atk + Math.floor(turn * 0.8);
            hit = Math.max(2, rawAtk - Math.floor((player.def - bypassedDef) * 0.45));
            hit = Math.floor(hit * timePressureBonus);
          } else {
            hit = Math.floor(enemyStrike(enemy, player, turn) * timePressureBonus);
          }

          // Public Bus Smoke Stacks — build on each hit
          if (enemyTemplate.smokeStacks) {
            if (battleStatus.smokeStackCount < enemyTemplate.maxSmokeStacks) {
              battleStatus.smokeStackCount++;
              await appendBattleLog(
                enemyAvatarHTML(enemyTemplate) + wrapLogText(
                  'Black smoke stacks: ' + battleStatus.smokeStackCount + '/' + enemyTemplate.maxSmokeStacks
                  + '. Your spells lose ' + Math.round(battleStatus.smokeStackCount * enemyTemplate.smokeAtkReduction * 100) + '% power.'
                ), 'enemy warn'
              );
            }
          }

          // Ember Skin damage reduction
          if (battleStatus.emberSkinTurns > 0) {
            const reduced = Math.floor(hit * battleStatus.emberSkinReduction);
            hit = Math.max(1, hit - reduced);
            battleStatus.emberSkinTurns--;
            await appendBattleLog('Ember Skin absorbs ' + reduced + ' damage. (' + battleStatus.emberSkinTurns + ' turns left)', 'player');
          }

          // Divine Reflection
          if (battleStatus.divineReflect && battleStatus.divineReflect > 0) {
            const reflected = Math.floor(hit * battleStatus.divineReflect);
            enemy.hp = Math.max(0, enemy.hp - reflected);
            battleStatus.divineReflect = 0;
            updateCombatHud(player, enemy, enemyTemplate);
            await appendBattleLog('Divine Reflection mirrors ' + reflected + ' damage back at ' + enemy.name + '!', 'player');
          }

          player.hp = Math.max(0, player.hp - hit);
          if (typeof SFX !== 'undefined') SFX.enemyHit();
          updateCombatHud(player, enemy, enemyTemplate);
          await appendBattleLog(enemyAvatarHTML(enemyTemplate) + wrapLogText(enemy.name + ' strikes for ' + hit + ' damage.'), 'enemy');

          if (timePressure && turn === timePressure.startTurn) {
            await appendBattleLog('The clocktower groans. "TIME OUT" — every strike hits harder.', 'system');
          }
          if (player.hp <= 0) break;
        }
      }
    }

    // ── Player turn ────────────────────────────────────────
    const raw = validatedBlueprint[turn - 1] || null;
    const parts = raw ? raw.split('|') : [];
    const spellId = parts[0] || null;
    const spellLvl = parseInt(parts[1]) || 1;
    const def = spellId && window.getSpellDef ? getSpellDef(spellId) : null;

    {
      const _trafficJam = getPerk('traffic_jam');

      // Stun only blocks the new cast this turn
      if (battleStatus.playerStunned) {
        battleStatus.playerStunned = false;
        await appendBattleLog(
          wrapLogText(logName() + ' is stunned — cannot spell this turn!'),
          'warn'
        );

      } else if (!def) {
        const dmg = struggleDamage(player, enemy);
        enemy.hp = Math.max(0, enemy.hp - dmg);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog(
          wrapLogText(logName() + ' has no spell and Struggles for ' + dmg + ' damage.'),
          'player'
        );

      } else if (player.sp < def.spCost) {
        const dmg = struggleDamage(player, enemy);
        enemy.hp = Math.max(0, enemy.hp - dmg);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog(
          wrapLogText(logName() + ' tries ' + def.name + ' but only has ' + player.sp + '/' + def.spCost + ' SP. Struggle: ' + dmg + ' dmg.'),
          'warn'
        );

      } else {
        player.sp -= def.spCost;

        // Ink Bleed (Drowned Codex)
        const inkBleed = getPerk('ink_bleed');
        const inkChance = inkBleed ? (enemyTemplate.isBoss ? inkBleed.chanceBoss : inkBleed.chanceNormal) : 0;

        if (inkBleed && Math.random() < inkChance) {
          updateCombatHud(player, enemy, enemyTemplate);
          await appendBattleLog(
            'Drowned ink seeps into the spell circle — ' + def.name + ' dissolves into black water.',
            'warn'
          );

        } else if (_trafficJam) {
          // Roll delay from enemy override or dungeon default (1 turn)
          const delayRange = enemyTemplate.trafficJamDelay || { min: 1, max: 1 };
          const { min, max } = delayRange;
          const turnsLeft = min + Math.floor(Math.random() * (max - min + 1)); 
          const turnsLeftForPush = turnsLeft + 1; //  +1 because the first turn counts down immediately
          battleStatus.pendingQueue.push({ def, spellLvl, turnsLeft: turnsLeftForPush });
          const delayLabel = delayRange.min === delayRange.max
            ? turnsLeft + ' turn'
            : turnsLeft + ' turns';
          await appendBattleLog(
            spellIconHTML(def.id) + wrapLogText(
              '<span style="color:var(--c-text-3);">'
              + logName() + ' casts ' + def.name
              + ' — <span style="color:var(--c-warn);font-style:italic;">stuck in traffic for ' + delayLabel + '</span>'
              + '</span>'
            ),
            ''
          );

        } else {
          await castPreparedSpell(def, player, enemy, enemyTemplate, battleStatus, spellLvl);
        }
      }

      // Pending releases always fire — stun does not block them
      console.log('Pending queue at end of turn ' + turn + ':', battleStatus.pendingQueue);
      if (_trafficJam && battleStatus.pendingQueue.length > 0) {
        battleStatus.pendingQueue.forEach(p => p.turnsLeft--);
        const ready = battleStatus.pendingQueue.filter(p => p.turnsLeft <= 0);
        battleStatus.pendingQueue = battleStatus.pendingQueue.filter(p => p.turnsLeft > 0);
        if (ready.length > 0) {
          await appendBattleLog(
            '🚦 ' + wrapLogText(
              ready.length > 1
                ? 'Traffic clears — ' + ready.length + ' spells burst through at once!'
                : 'Traffic clears!'
            ), 'system'
          );
          for (const pending of ready) {
            await castPreparedSpell(pending.def, player, enemy, enemyTemplate, battleStatus, pending.spellLvl, true);
            if (enemy.hp <= 0) break;
            if (player.hp <= 0) break;
          }
        }
        if (enemy.hp <= 0) break;
        if (player.hp <= 0) break;
      }

      // Final turn: flush all remaining queued spells
      if (turn === 10 && _trafficJam && battleStatus.pendingQueue.length > 0) {
        const finalCount = battleStatus.pendingQueue.length;
        await appendBattleLog(
          '🚦 ' + wrapLogText(
            finalCount > 1
              ? 'Battle ends — ' + finalCount + ' spells finally arrive through the gridlock!'
              : 'Battle ends — your spell finally crawls through.'
          ), 'system'
        );
        for (const pending of battleStatus.pendingQueue) {
          await castPreparedSpell(pending.def, player, enemy, enemyTemplate, battleStatus, pending.spellLvl, true);
          if (enemy.hp <= 0) break;
        }
        battleStatus.pendingQueue = [];
      }
    }

    if (enemy.hp <= 0) break;
  } // end turn loop

  // ── Outcome ──────────────────────────────────────────────
  const won = enemy.hp <= 0 && player.hp > 0;

  // Gold Drain — Tuk Tuk exit fee (win or lose)
  if (enemyTemplate.id === 'tuk_tuk' && enemyTemplate.goldStealAmount) {
    const { min, max } = enemyTemplate.goldStealAmount;
    const stolen = min + Math.floor(Math.random() * (max - min + 1));
    const actualStolen = Math.min(s.gold, stolen);
    s.gold -= actualStolen;
    saveState();
    syncHeader();
    await appendBattleLog(
      enemyAvatarHTML(enemyTemplate) + wrapLogText('The Tuk Tuk driver collects his fee: ' + actualStolen + ' Gold. Non-negotiable.'),
      'enemy'
    );
  }
  if (!s.stats) s.stats = { battles: 0, wins: 0, kills: 0, goldEarned: 0 };
  s.stats.battles++;
  if (won) {
    s.stats.wins++;
    s.stats.kills++;
    const dungeon = window.getDungeonDef ? getDungeonDef(_selectedDungeonId) : null;
    const dungeonReq = dungeon ? dungeon.levelReq : 1;
    const goldReward = scaleRewardByLevel(enemy.gold + Math.floor(Math.random() * 25), s.player.level, dungeonReq);
    const expReward = scaleRewardByLevel(enemy.exp, s.player.level, dungeonReq);
    s.gold += goldReward;
    s.stats.goldEarned += goldReward;
    const _levelBefore = s.player.level;
    const _levelAfter = gainExp(expReward);
    const _didLevelUp = _levelAfter > _levelBefore;

    const drops = rollDrops(enemyTemplate);
    saveState();

    await appendBattleLog('Victory. Gained ' + goldReward + ' Gold and ' + expReward + ' EXP.', 'reward');
    if (battleStatus.totalGoldStolen > 0) {
      await appendBattleLog('Fire Thief total: stole ' + battleStatus.totalGoldStolen + ' Gold during battle.', 'reward');
    }
    for (const drop of drops) {
      await appendBattleLog('✦ Drop: ' + drop.name, 'reward');
    }

    if (typeof SFX !== 'undefined') SFX.victory();
    showBattleOutcome({ won: true, goldReward, expReward, drops });
    if (_didLevelUp && typeof showLevelUpOverlay === 'function') {
      setTimeout(() => showLevelUpOverlay(_levelAfter), 800);
    }
    setBattleResult('<span class="c-ok">Victory recorded</span>');
  } else {
    if (typeof SFX !== 'undefined') SFX.defeat();
    await appendBattleLog(wrapLogText('Defeat. The tower recalls ' + logName() + ' before the Rift closes.'), 'warn');
    showBattleOutcome({ won: false, goldReward: 0, expReward: 0 });
    setBattleResult('<span class="c-bad">Battle failed</span>');
  }

  s.player.hp = s.player.hpMax;
  s.player.sp = s.player.spMax;
  saveState();
  syncHeader();

  const hudEl = document.getElementById('combat-hud');
  if (hudEl) hudEl.classList.add('hud--post-battle');
  _battleRunning = false;

  if (_autoLoopEnabled) {
    setBattleButton(true, 'Auto — next fight…');
    _autoLoopTimeout = setTimeout(() => {
      _autoLoopTimeout = null;
      if (_autoLoopEnabled) {
        runAutoBattle(_selectedDungeonId);
      } else {
        setBattleButton(false, 'Fight Again');
      }
    }, 2500);
  } else {
    setBattleButton(false, 'Fight Again');
  }
}

/* ============================================================
   SPELL CAST
   ============================================================ */

function spellIconHTML(id) {
  return '<img src="/asset/spell_icons/' + id + '.png" class="log-spell-icon" alt="">';
}

function wrapLogText(html) {
  return '<span class="log-line-text">' + html + '</span>';
}

async function castPreparedSpell(def, player, enemy, enemyTemplate, battleStatus, spellLvl, fromQueue = false) {
  // ── Base damage ──────────────────────────────────────────
  let baseDmg = spellPower(def, player, spellLvl);

  // Spell Fatigue: spells below Lv.9 deal only 40% damage in Rift's End
  const spellFatiguePerk = getPerk('spell_fatigue');
  if (spellFatiguePerk && spellLvl < spellFatiguePerk.minSpellLevel) {
    baseDmg = Math.floor(baseDmg * spellFatiguePerk.lowLevelPenalty);
  }

  // Reality Fracture: halves damage this turn
  if (battleStatus.realityFractureActive) {
    baseDmg = Math.floor(baseDmg * 0.50);
    battleStatus.realityFractureActive = false;
  }

  // ── Build ctx for handler ────────────────────────────────
  const ctx = {
    def,
    player,
    enemy,
    enemyTemplate,
    battleStatus,
    spellLvl: spellLvl || 1,
    playerName: battlePlayerName(),
    baseDmg,
    fromQueue,
    spellIconHTML: spellIconHTML(def.id),
    enemyAvatarHTML: enemyAvatarHTML(enemyTemplate),
    log: appendBattleLog,
    updateHud: () => updateCombatHud(player, enemy, enemyTemplate),
  };

  // ── Registered handler ───────────────────────────────────
  const handler = window.getSpellHandler ? getSpellHandler(def.id) : null;
  if (handler) {
    await handler(ctx);
    return;
  }

  // ── Default damage path ──────────────────────────────────
  // Smoke stack penalty
  if (battleStatus.smokeStackCount > 0 && enemyTemplate.smokeStacks) {
    baseDmg = Math.max(1, Math.floor(baseDmg * (1 - battleStatus.smokeStackCount * enemyTemplate.smokeAtkReduction)));
  }

  // Motorbike dodge
  if (enemyTemplate.dodgeChance && Math.random() < enemyTemplate.dodgeChance) {
    await appendBattleLog(
      spellIconHTML(def.id) + wrapLogText(logName() + ' casts ' + def.name + ' — the swarm weaves through it!'),
      'warn'
    );
    return;
  }

  baseDmg = Math.max(1, baseDmg - enemy.def);

  // Void Shield absorption
  if (battleStatus.voidShieldRemaining > 0 && !battleStatus.voidShieldBroken) {
    const abs = Math.min(battleStatus.voidShieldRemaining, baseDmg);
    battleStatus.voidShieldRemaining -= abs;
    baseDmg -= abs;
    if (battleStatus.voidShieldRemaining <= 0) {
      battleStatus.voidShieldBroken = true;
      await appendBattleLog('The Void Shield shatters!', 'system');
    }
  }

  enemy.hp = Math.max(0, enemy.hp - baseDmg);
  updateCombatHud(player, enemy, enemyTemplate);

  await appendBattleLog(
    spellIconHTML(def.id) + wrapLogText(logName() + ' casts ' + def.name + ', spending ' + def.spCost + ' SP for ' + baseDmg + ' damage.'),
    'player'
  );

  // Spell Reflect (First Arcanist)
  if (enemyTemplate.spellReflect && baseDmg > 0) {
    const reflected = Math.floor(baseDmg * enemyTemplate.spellReflectPct);
    if (reflected > 0) {
      player.hp = Math.max(0, player.hp - reflected);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(wrapLogText(enemyTemplate.name + ' reflects ' + reflected + ' damage back!'), 'enemy warn');
    }
  }
}

/* ============================================================
   SCREEN HOOK
   ============================================================ */

function renderBattleScreen() {
  if (_battleRunning) return;
  showDungeonView();
}

onScreen('battle', renderBattleScreen);