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

function randDelay(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
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
  else if (tower === 'dark') statBase = Math.floor(player.atk * 0.9 + player.agi * 0.4);
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

const TOWER_GROWTH = {
  light: { hpMax: 8, spMax: 4, atk: 1, def: 2, str: 0, int: 2, agi: 0 },
  dark: { hpMax: 4, spMax: 3, atk: 2, def: 0, str: 0, int: 1, agi: 2 },
  fire: { hpMax: 10, spMax: 2, atk: 2, def: 1, str: 2, int: 0, agi: 1 },
  ice: { hpMax: 3, spMax: 6, atk: 1, def: 1, str: 1, int: 2, agi: 1 },
};

function gainExp(amount) {
  const s = getState();
  s.player.exp += amount;
  while (s.player.exp >= s.player.expNext) {
    s.player.exp -= s.player.expNext;
    s.player.level += 1;
    s.player.expNext = Math.floor(s.player.expNext * 1.25);

    const g = TOWER_GROWTH[s.tower] || TOWER_GROWTH.light;
    s.player.hpMax += g.hpMax;
    s.player.spMax += g.spMax;
    s.player.atk += g.atk;
    s.player.def += g.def;
    s.player.str += g.str;
    s.player.int += g.int;
    s.player.agi += g.agi;

    if (s.player.level % 5 === 0) {
      s.player.hpMax += 10;
      s.player.spMax += 5;
      s.player.atk += 2;
      s.player.def += 2;
      s.player.str += 2;
      s.player.int += 2;
      s.player.agi += 2;
      if (typeof toast === 'function') toast('Power Surge! Level ' + s.player.level + ' milestone reached!', 'gold');
    }
  }
  saveState();
}

function battlePlayerName() {
  return getPlayerName ? getPlayerName() : 'Riftwalker';
}

function logName() {
  return '<span class="log-name">' + battlePlayerName() + '</span>';
}

function dungeonIcon(icon) {
  const icons = {
    leaf: '&#10087;',
    skull: '&#9760;',
  };
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

  // restore confirm button to default shop behavior
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
  entry.className = 'battle-log-line' + (type ? ' battle-log-line--' + type : '');
  entry.innerHTML = line;
  logWrap.appendChild(entry);
  if (!_userScrolledLog) {
    logWrap.scrollTop = logWrap.scrollHeight;
  }
  await sleep(randDelay(300, 500));
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
  setText(
    'battle-result-rewards',
    won
      ? '+' + outcome.goldReward + ' Gold  +' + outcome.expReward + ' EXP'
      : 'No rewards claimed'
  );

  const dropEl = document.getElementById('battle-drops');
  if (dropEl) {
    if (outcome.drops && outcome.drops.length > 0) {
      dropEl.innerHTML = outcome.drops.map(d => {
        const iconSrc = d.type === 'catalyst' ? '/asset/catalyst_icons/' + d.catalystId + '.png' : null;
        const iconHTML = iconSrc ? '<img src="' + iconSrc + '" style="width:22px;height:22px;border-radius:4px;vertical-align:middle;margin-right:6px;" alt="">' : '✦ ';
        return '<div class="c-gold" style="font-size:15px;letter-spacing:.04em;margin-top:6px;display:flex;align-items:center;">'
          + iconHTML + 'You got <strong style="margin-left:4px;">' + d.name + '</strong>!</div>';
      }).join('');
    } else {
      dropEl.innerHTML = '';
    }
  }
}

function updateCombatHud(player, enemy, enemyTemplate) {
  setText('player-combat-name', battlePlayerName());
  setText('enemy-combat-name', enemy.name);

  // enemy avatar
  const avatarEl = document.getElementById('enemy-combat-avatar');
  if (avatarEl && enemyTemplate) {
    const id = enemy.name === '???' ? null : enemyTemplate.id;
    avatarEl.src = id ? '/asset/enemy_avatars/' + id + '.png' : '';
    avatarEl.style.display = id ? 'block' : 'none';
  }

  setFill('player-hp-fill', clampPct(player.hp, player.hpMax));
  setFill('player-sp-fill', clampPct(player.sp, player.spMax));
  setFill('enemy-hp-fill', clampPct(enemy.hp, enemyTemplate.hp));

  setText('player-hp-text', 'HP ' + player.hp + ' / ' + player.hpMax);
  setText('player-sp-text', 'SP ' + player.sp + ' / ' + player.spMax);
  setText('enemy-hp-text', 'HP ' + enemy.hp + ' / ' + enemyTemplate.hp);
}

function prepareArena(dungeonId) {
  const activeDungeonId = dungeonId || _selectedDungeonId || 'booby_forest';
  _selectedDungeonId = activeDungeonId;
  _preparedEnemyTemplate = window.getRandomEnemy
    ? getRandomEnemy(activeDungeonId)
    : { name: 'Training Shadow', area: 'Booby Forest', hp: 45, atk: 7, def: 2, exp: 20, gold: 55, opener: 'A shadow stirs.' };

  const player = { ...getState().player, hp: getState().player.hpMax, sp: getState().player.spMax };
  const enemy = { ..._preparedEnemyTemplate };
  const logWrap = document.getElementById('battle-log');

  if (logWrap) {
    logWrap.innerHTML = '<div class="battle-log-line">Prepare your 10-turn blueprint, then begin the fight.</div>';
  }
  clearBattleOutcome();
  document.getElementById('combat-hud')?.classList.remove('hud--post-battle');
  document.getElementById('combat-hud')?.classList.add('hud--hidden-enemy');
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
  const pool = getAllSpells().filter(s =>
    s.tower === tower && s.rarity === 'uncommon'
  );
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
    let roll = Math.random();
    console.log("Drop roll: " + roll + ", chance: " + entry.chance);
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
      drops.push({ type: 'spell', name: spell.name, rarity: 'uncommon' });
    } else if (entry.type === 'rare_spell_tiered') {
      const tower = getTower();
      const spellId = CODEX_SPELL_TIERS[tower];
      if (!spellId) return;

      const spell = getSpellDef(spellId);
      if (!spell) return;
      giveSpell(spellId, 1);
      drops.push({ type: 'spell', name: spell.name, rarity: 'rare' });
    }
  });

  return drops;
}

async function runAutoBattle(dungeonId) {
  if (_battleRunning) return;
  _battleRunning = true;

  const activeDungeonId = dungeonId || _selectedDungeonId || 'booby_forest';
  _selectedDungeonId = activeDungeonId;
  showArenaView(activeDungeonId);
  setBattleButton(true);
  document.getElementById('combat-hud')?.classList.remove('hud--post-battle');
  document.getElementById('combat-hud')?.classList.remove('hud--hidden-enemy');

  const logWrap = document.getElementById('battle-log');
  if (logWrap) logWrap.innerHTML = '';
  _userScrolledLog = false;
  clearBattleOutcome();
  setBattleResult('<span class="c-gold">Battle running...</span>');

  const s = getState();
  const blueprint = s.blueprint.slice(0, 10);
  const validatedBlueprint = blueprint.map(slot => {
    if (!slot) return null;
    const parts = slot.split('|');
    const baseId = parts[0];
    const lvl = parseInt(parts[1]) || 1;
    const owned = s.spells.find(sp => sp.id === baseId && sp.lvl === lvl && sp.qty >= 1);
    return owned ? slot : null;
  });
  const player = { ...s.player, hp: s.player.hpMax, sp: s.player.spMax };
  const enemyTemplate = _preparedEnemyTemplate || (window.getRandomEnemy
    ? getRandomEnemy(activeDungeonId)
    : { name: 'Training Shadow', area: 'Booby Forest', hp: 45, atk: 7, def: 2, exp: 20, gold: 55, opener: 'A shadow stirs.' });
  _preparedEnemyTemplate = null;
  const enemy = { ...enemyTemplate };
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
  };

  updateCombatHud(player, enemy, enemyTemplate);
  await appendBattleLog('Battle begins in ' + enemy.area + '.', 'system');
  await appendBattleLog(enemy.opener, 'enemy');

  for (let turn = 1; turn <= 10; turn++) {
    await sleep(randDelay(700, 1200));
    await appendBattleLog('Turn ' + turn + '.', 'turn');

    if (enemyTemplate.regenPerTurn && enemy.hp > 0) {
      const regen = enemyTemplate.regenPerTurn;
      enemy.hp = Math.min(enemyTemplate.hp, enemy.hp + regen);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(enemy.name + ' regenerates ' + regen + ' HP.', 'enemy');
    }

    // Demon tick
    if (battleStatus.demonStacks && battleStatus.demonStacks.length > 0) {
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
    if (battleStatus.golemStacks && battleStatus.golemStacks.length > 0) {
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
    if (battleStatus.fireStormStacks && battleStatus.fireStormStacks.length > 0) {
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
    battleStatus.burnStacks = battleStatus.burnStacks.filter(s => s.turnsLeft > 0);
    if (battleStatus.burnStacks.length > 0) {
      const burnDmg = battleStatus.burnStacks.reduce((sum, s) => sum + (s.power || Math.round(12 * 0.35)), 0);
      enemy.hp = Math.max(0, enemy.hp - burnDmg);
      battleStatus.burnStacks.forEach(s => s.turnsLeft--);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        'Burn deals ' + burnDmg + ' damage.', 'player'
      );
      if (enemy.hp <= 0) break;
    }

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

    // Regen tick (Chorus of Sanctuary)
    if (battleStatus.regenStacks && battleStatus.regenStacks.length > 0) {
      battleStatus.regenStacks = battleStatus.regenStacks.filter(r => r.turnsLeft > 0);
      const totalRegen = battleStatus.regenStacks.reduce((sum, r) => sum + r.amount, 0);
      if (totalRegen > 0) {
        player.hp = Math.min(player.hpMax, player.hp + totalRegen);
        battleStatus.regenStacks.forEach(r => r.turnsLeft--);
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog('Sanctuary restores ' + totalRegen + ' HP.', 'player');
      }
    }

    if (battleStatus.enemyFrozen) {
      battleStatus.enemyFrozen = false;
      await appendBattleLog(enemy.name + ' is frozen and cannot act this turn.', 'enemy');
    } else {
      // Fog miss check
      let missed = false;
      if (battleStatus.fogActive && battleStatus.fogActive.turnsLeft > 0) {
        if (Math.random() < battleStatus.fogActive.missChance) {
          missed = true;
          await appendBattleLog(enemy.name + ' attacks but misses through the fog!', 'enemy');
        }
        battleStatus.fogActive.turnsLeft--;
        if (battleStatus.fogActive.turnsLeft <= 0) battleStatus.fogActive = null;
      }
      if (!missed) {
        // Angel Wing dodge check
        let dodged = false;
        if (battleStatus.angelWingActive > 0) {
          if (Math.random() < battleStatus.angelWingActive) {
            dodged = true;
            await appendBattleLog(enemy.name + ' attacks but ' + logName() + ' dodges with Angel Wing!', 'player');
          }
          battleStatus.angelWingActive = 0;
        }
        if (!dodged) {
          let hit = Math.floor(enemyStrike(enemy, player, turn) * timePressureBonus);
          if (battleStatus.emberSkinTurns > 0) {
            const reduced = Math.floor(hit * battleStatus.emberSkinReduction);
            hit = Math.max(1, hit - reduced);
            battleStatus.emberSkinTurns--;
            await appendBattleLog('Ember Skin absorbs ' + reduced + ' damage. (' + battleStatus.emberSkinTurns + ' turns left)', 'player');
          }
          if (battleStatus.divineReflect && battleStatus.divineReflect > 0) {
            const reflected = Math.floor(hit * battleStatus.divineReflect);
            enemy.hp = Math.max(0, enemy.hp - reflected);
            battleStatus.divineReflect = 0;
            updateCombatHud(player, enemy, enemyTemplate);
            await appendBattleLog('Divine Reflection mirrors ' + reflected + ' damage back at ' + enemy.name + '!', 'player');
          }
          player.hp = Math.max(0, player.hp - hit);
          updateCombatHud(player, enemy, enemyTemplate);
          await appendBattleLog(enemy.name + ' strikes for ' + hit + ' damage.', 'enemy');
          if (timePressure && turn === timePressure.startTurn) {
            await appendBattleLog('The clocktower groans. "TIME OUT" — every strike hits harder.', 'system');
          }
          if (player.hp <= 0) break;
        }
      }
    }

    const raw = validatedBlueprint[turn - 1] || null;
    const parts = raw ? raw.split('|') : [];
    const spellId = parts[0] || null;
    const spellLvl = parseInt(parts[1]) || 1;
    const def = spellId && window.getSpellDef ? getSpellDef(spellId) : null;

    if (!def) {
      const dmg = struggleDamage(player, enemy);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(wrapLogText(logName() + ' has no spell prepared and performs Struggle for ' + dmg + ' damage.'), 'player');
    } else if (player.sp >= def.spCost) {
      player.sp -= def.spCost;
      const inkBleed = getPerk('ink_bleed');
      const inkChance = inkBleed
        ? (enemyTemplate.isBoss ? inkBleed.chanceBoss : inkBleed.chanceNormal)
        : 0;
      let inkBleedRoll = Math.random();
      console.log("Ink Bleed Roll:", inkBleedRoll, "Chance:", inkChance);
      if (inkBleed && inkBleedRoll < inkChance) {
        updateCombatHud(player, enemy, enemyTemplate);
        await appendBattleLog(
          'Drowned ink seeps into the spell circle — ' + def.name + ' dissolves into black water.',
          'warn'
        );
      } else {
        await castPreparedSpell(def, player, enemy, enemyTemplate, battleStatus, spellLvl);
        updateCombatHud(player, enemy, enemyTemplate);
      }
    } else {
      const dmg = struggleDamage(player, enemy);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        wrapLogText(logName() + ' tries to cast ' + def.name + ' but has only ' + player.sp + '/' + def.spCost + ' SP. The spell fails; Struggle deals ' + dmg + ' damage.'),
        'warn'
      );
    }

    if (enemy.hp <= 0) break;
  }

  const won = enemy.hp <= 0 && player.hp > 0;
  if (!s.stats) s.stats = { battles: 0, wins: 0, kills: 0, goldEarned: 0 };
  s.stats.battles++;
  if (won) {
    s.stats.wins++;
    s.stats.kills++;
    const goldReward = enemy.gold + Math.floor(Math.random() * 25);
    const expReward = enemy.exp;
    s.gold += goldReward;
    s.stats.goldEarned += goldReward;
    gainExp(expReward);

    const drops = rollDrops(enemyTemplate);
    saveState();

    await appendBattleLog('Victory. Gained ' + goldReward + ' Gold and ' + expReward + ' EXP.', 'reward');
    if (battleStatus.totalGoldStolen > 0) {
      await appendBattleLog(
        'Fire Thief total: stole ' + battleStatus.totalGoldStolen + ' Gold during battle.', 'reward'
      );
    }
    for (const drop of drops) {
      await appendBattleLog('✦ Drop: ' + drop.name, 'reward');
    }

    showBattleOutcome({ won: true, goldReward, expReward, drops });
    setBattleResult('<span class="c-ok">Victory recorded</span>');
  } else {
    await appendBattleLog('Defeat. The tower recalls ' + logName() + ' before the Rift closes.', 'warn');
    showBattleOutcome({ won: false, goldReward: 0, expReward: 0 });
    setBattleResult('<span class="c-bad">Battle failed</span>');
  }

  s.player.hp = s.player.hpMax;
  s.player.sp = s.player.spMax;

  saveState();
  syncHeader();
  document.getElementById('combat-hud')?.classList.add('hud--post-battle');
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

function spellIconHTML(id) {
  return '<img src="/asset/spell_icons/' + id + '.png" class="log-spell-icon" alt="">';
}

function wrapLogText(html) {
  return '<span class="log-line-text">' + html + '</span>';
}

async function castPreparedSpell(def, player, enemy, enemyTemplate, battleStatus, spellLvl) {
  const baseDmg = Math.max(1, spellPower(def, player, spellLvl) - enemy.def);
  const handler = window.getSpellHandler ? getSpellHandler(def.id) : null;
  if (handler) {
    const ctx = {
      def, player, enemy, enemyTemplate, battleStatus,
      spellLvl: spellLvl || 1,
      playerName: battlePlayerName(),
      baseDmg,
      spellIconHTML: spellIconHTML(def.id),
      log: appendBattleLog,
      updateHud: () => updateCombatHud(player, enemy, enemyTemplate),
    };
    await handler(ctx);
    return;
  }
  // Default: deal damage
  enemy.hp = Math.max(0, enemy.hp - baseDmg);
  await appendBattleLog(
    spellIconHTML(def.id) + wrapLogText(logName() + ' casts ' + def.name + ', spending ' + def.spCost + ' SP for ' + baseDmg + ' damage.'),
    'player'
  );
}

function renderBattleScreen() {
  if (_battleRunning) return;
  showDungeonView();
}

onScreen('battle', renderBattleScreen);
