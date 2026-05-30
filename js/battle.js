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
  const base = Math.max(5, Math.floor((player.atk + player.int) * 0.75));
  const towerBonus = def.tower === getTower() ? 4 : 0;
  const roleBonus = def.role.toLowerCase().includes('basic') ? 0 : 3;
  const levelBonus = Math.floor((lvl - 1) * 0.18 * (base + towerBonus + roleBonus));
  return base + towerBonus + roleBonus + levelBonus;
}

function struggleDamage(player, enemy) {
  return Math.max(2, Math.floor(player.atk * 0.35) - enemy.def);
}

function enemyStrike(enemy, player, turn) {
  const raw = enemy.atk + Math.floor(turn * 0.8);
  return Math.max(2, raw - Math.floor(player.def * 0.45));
}

function gainExp(amount) {
  const s = getState();
  s.player.exp += amount;
  while (s.player.exp >= s.player.expNext) {
    s.player.exp -= s.player.expNext;
    s.player.level += 1;
    s.player.expNext = Math.floor(s.player.expNext * 1.25);
    s.player.hpMax += 6;
    s.player.spMax += 3;
    s.player.atk += 1;
    s.player.def += 1;
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
  wrap.innerHTML = dungeons.map(dungeon => {
    const unlocked = dungeon.unlocked && s.player.level >= dungeon.levelReq;
    const stateClass = unlocked ? '' : ' is-locked';
    const action = unlocked
      ? '<button class="dungeon-enter">Enter Battle</button>'
      : '<div class="dungeon-locked">Locked - Reach Level ' + dungeon.levelReq + '</div>';
    const lock = unlocked ? '' : '<div class="dungeon-lock" aria-hidden="true">&#128274;</div>';
    const onclick = unlocked ? " onclick=\"enterDungeon('" + dungeon.id + "')\"" : '';

    return ''
      + '<article class="dungeon-card' + stateClass + '"' + onclick + '>'
      + '  <div class="dungeon-scene dungeon-scene--' + dungeon.id + '">' + lock
      + '    <span class="forest-moon"></span>'
      + '    <span class="forest-firefly f1"></span>'
      + '    <span class="forest-firefly f2"></span>'
      + '    <span class="forest-firefly f3"></span>'
      + '    <span class="forest-hill"></span>'
      + '    <span class="forest-tree t1"></span>'
      + '    <span class="forest-tree t2"></span>'
      + '    <span class="forest-tree t3"></span>'
      + '    <span class="forest-tree t4"></span>'
      + '  </div>'
      + '  <div class="dungeon-body">'
      + '    <div class="dungeon-name">' + dungeonIcon(dungeon.icon) + ' ' + dungeon.name + '</div>'
      + '    <p class="dungeon-desc">' + dungeon.description + '</p>'
      + '    <div class="dungeon-reward">Beginner <b>EXP ' + dungeon.expRange + '</b> <b>Gold ' + dungeon.goldRange + '</b></div>'
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

async function enterDungeon(dungeonId) {
  if (_battleRunning) return;

  const dungeon = window.getDungeonDef ? getDungeonDef(dungeonId) : null;
  const level = getState().player.level;
  if (!dungeon || !dungeon.unlocked || level < dungeon.levelReq) {
    toast('This dungeon is still locked.', 'bad');
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
      dropEl.innerHTML = outcome.drops.map(d =>
        '<div class="c-gold" style="font-size:15px;letter-spacing:.04em;margin-top:6px;">✦ You got <strong>' + d.name + '</strong>!</div>'
      ).join('');
    } else {
      dropEl.innerHTML = '';
    }
  }
}

function updateCombatHud(player, enemy, enemyTemplate) {
  setText('player-combat-name', battlePlayerName());
  setText('enemy-combat-name', enemy.name);

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
  setBattleButton(false, 'Start Auto Battle');
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
      drops.push({ type: 'catalyst', name: formatItemName(entry.id) });

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
  const player = { ...s.player, hp: s.player.hpMax, sp: s.player.spMax };
  const enemyTemplate = _preparedEnemyTemplate || (window.getRandomEnemy
    ? getRandomEnemy(activeDungeonId)
    : { name: 'Training Shadow', area: 'Booby Forest', hp: 45, atk: 7, def: 2, exp: 20, gold: 55, opener: 'A shadow stirs.' });
  _preparedEnemyTemplate = null;
  const enemy = { ...enemyTemplate };
  const battleStatus = {
    burnStacks: [],
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
        'Burn deals ' + burnDmg + ' damage (' + battleStatus.burnStacks.length + ' stack).', 'player'
      );
      if (enemy.hp <= 0) break;
    }

    const timePressure = getPerk('time_pressure');
    const timePressureBonus = (timePressure && turn >= timePressure.startTurn)
      ? 1 + (turn - timePressure.startTurn + 1) * timePressure.atkBonusPerTurn
      : 1;
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
          const hit = Math.floor(enemyStrike(enemy, player, turn) * timePressureBonus);
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

    const raw = blueprint[turn - 1] || null;
    const parts = raw ? raw.split('|') : [];
    const spellId = parts[0] || null;
    const spellLvl = parseInt(parts[1]) || 1;
    const def = spellId && window.getSpellDef ? getSpellDef(spellId) : null;

    if (!def) {
      const dmg = struggleDamage(player, enemy);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(logName() + ' has no spell prepared and performs Struggle for ' + dmg + ' damage.', 'player');
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
        logName() + ' tries to cast ' + def.name + ' but has only ' + player.sp + '/' + def.spCost + ' SP. The spell fails; Struggle deals ' + dmg + ' damage.',
        'warn'
      );
    }

    if (enemy.hp <= 0) break;
  }

  const won = enemy.hp <= 0 && player.hp > 0;
  if (won) {
    const goldReward = enemy.gold + Math.floor(Math.random() * 25);
    const expReward = enemy.exp;
    s.gold += goldReward;
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

async function castPreparedSpell(def, player, enemy, enemyTemplate, battleStatus, spellLvl) {
  const baseDmg = Math.max(1, spellPower(def, player, spellLvl) - enemy.def);

  const handler = window.getSpellHandler ? getSpellHandler(def.id) : null;

  if (handler) {
    const ctx = {
      def, player, enemy, enemyTemplate, battleStatus,
      spellLvl: spellLvl || 1,
      playerName: battlePlayerName(),
      baseDmg,
      log: appendBattleLog,
      updateHud: () => updateCombatHud(player, enemy, enemyTemplate),
    };
    await handler(ctx);
    return;
  }

  // Default: deal damage
  enemy.hp = Math.max(0, enemy.hp - baseDmg);
  await appendBattleLog(
    logName() + ' casts ' + def.name + ', spending ' + def.spCost + ' SP for ' + baseDmg + ' damage.',
    'player'
  );
}

function renderBattleScreen() {
  if (_battleRunning) return;
  showDungeonView();
}

onScreen('battle', renderBattleScreen);
