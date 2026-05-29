/* ============================================================
   SOULRIFT - /battle.js
   Dungeon entry screen + automatic 10-turn text battle.
   ============================================================ */

'use strict';

let _battleRunning = false;
let _selectedDungeonId = 'booby_forest';
let _preparedEnemyTemplate = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randDelay(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
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

function spellPower(def, player) {
  if (!def) return Math.max(4, Math.floor(player.atk * 0.45));
  const base = Math.max(5, Math.floor((player.atk + player.int) * 0.75));
  const towerBonus = def.tower === getTower() ? 4 : 0;
  const roleBonus = def.role.toLowerCase().includes('basic') ? 0 : 3;
  return base + towerBonus + roleBonus;
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
}

function showArenaView(dungeonId) {
  const dungeonView = document.getElementById('battle-dungeon-view');
  const arenaView = document.getElementById('battle-arena-view');
  const dungeon = window.getDungeonDef ? getDungeonDef(dungeonId) : null;
  if (dungeonView) dungeonView.classList.add('is-hidden');
  if (arenaView) arenaView.classList.remove('is-hidden');
  setText('arena-dungeon-name', dungeon ? dungeon.name : 'Unknown Rift');
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
  showDungeonView();
}

async function appendBattleLog(line, type = '') {
  const logWrap = document.getElementById('battle-log');
  if (!logWrap) return;
  const entry = document.createElement('div');
  entry.className = 'battle-log-line' + (type ? ' battle-log-line--' + type : '');
  entry.textContent = line;
  logWrap.appendChild(entry);
  logWrap.scrollTop = logWrap.scrollHeight;
  await sleep(randDelay(300, 500));
}

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
  updateCombatHud(player, enemy, _preparedEnemyTemplate);
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

function rollDrops(enemyTemplate) {
  const drops = [];
  if (!enemyTemplate || !Array.isArray(enemyTemplate.dropTable)) return drops;

  enemyTemplate.dropTable.forEach(entry => {
    if (Math.random() >= entry.chance) return;

    if (entry.type === 'catalyst') {
      giveCatalyst(entry.id);
      drops.push({ type: 'catalyst', name: formatItemName(entry.id) });

    } else if (entry.type === 'uncommon_spell') {
      const spell = getRandomUncommonForTower();
      if (!spell) return;
      giveSpell(spell.id, 1);
      drops.push({ type: 'spell', name: spell.name, rarity: 'uncommon' });
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

  const logWrap = document.getElementById('battle-log');
  if (logWrap) logWrap.innerHTML = '';
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

  updateCombatHud(player, enemy, enemyTemplate);
  await appendBattleLog('Battle begins in ' + enemy.area + '.', 'system');
  await appendBattleLog(enemy.opener, 'enemy');

  for (let turn = 1; turn <= 10; turn++) {
    await sleep(randDelay(700, 1200));
    await appendBattleLog('Turn ' + turn + '.', 'turn');

    const hit = enemyStrike(enemy, player, turn);
    player.hp = Math.max(0, player.hp - hit);
    updateCombatHud(player, enemy, enemyTemplate);
    await appendBattleLog(enemy.name + ' strikes for ' + hit + ' damage.', 'enemy');
    if (player.hp <= 0) break;

    const spellId = blueprint[turn - 1] || null;
    const def = window.getSpellDef ? getSpellDef(spellId) : null;

    if (!def) {
      const dmg = struggleDamage(player, enemy);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(battlePlayerName() + ' has no spell prepared and performs Struggle for ' + dmg + ' damage.', 'player');
    } else if (player.sp >= def.spCost) {
      player.sp -= def.spCost;
      await castPreparedSpell(def, player, enemy, enemyTemplate);
      updateCombatHud(player, enemy, enemyTemplate);
    } else {
      const dmg = struggleDamage(player, enemy);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      updateCombatHud(player, enemy, enemyTemplate);
      await appendBattleLog(
        battlePlayerName() + ' tries to cast ' + def.name + ' but has only ' + player.sp + '/' + def.spCost + ' SP. The spell fails; Struggle deals ' + dmg + ' damage.',
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
    for (const drop of drops) {
      await appendBattleLog('✦ Drop: ' + drop.name, 'reward');
    }

    showBattleOutcome({ won: true, goldReward, expReward, drops });
    setBattleResult('<span class="c-ok">Victory recorded</span>');
  } else {
    await appendBattleLog('Defeat. The tower recalls ' + battlePlayerName() + ' before the Rift closes.', 'warn');
    showBattleOutcome({ won: false, goldReward: 0, expReward: 0 });
    setBattleResult('<span class="c-bad">Battle failed</span>');
  }

  s.player.hp = s.player.hpMax;
  s.player.sp = s.player.spMax;

  saveState();
  syncHeader();

  // Keep HUD visible but compact — collapse after short delay so player sees final state
  await sleep(600);
  document.getElementById('combat-hud')?.classList.add('hud--post-battle');
  document.getElementById('combat-hud')?.classList.remove('hud--collapsed');

  setBattleButton(false);
  _battleRunning = false;
}

async function castPreparedSpell(def, player, enemy, enemyTemplate) {
  const dmg = Math.max(1, spellPower(def, player) - enemy.def);

  if (def.id === 'fire_thief') {
    const stolen = 12 + Math.floor(Math.random() * 10);
    getState().gold += stolen;
    await appendBattleLog(battlePlayerName() + ' casts Fire Thief, spending ' + def.spCost + ' SP and stealing ' + stolen + ' Gold.', 'player');
  }

  if (def.id === 'energy_refill') {
    const refill = 16;
    player.sp = Math.min(player.spMax, player.sp + refill);
    await appendBattleLog(battlePlayerName() + ' casts Energy Refill and restores ' + refill + ' SP.', 'player');
    return;
  }

  if (def.id === 'holy_guard' || def.id === 'ember_skin' || def.id === 'frost_ward') {
    player.hp = Math.min(player.hpMax, player.hp + 8);
    await appendBattleLog(battlePlayerName() + ' casts ' + def.name + ', spending ' + def.spCost + ' SP and stabilizing behind a ward.', 'player');
    return;
  }

  enemy.hp = Math.max(0, enemy.hp - dmg);
  await appendBattleLog(
    battlePlayerName() + ' casts ' + def.name + ', spending ' + def.spCost + ' SP for ' + dmg + ' damage.',
    'player'
  );
}

function renderBattleScreen() {
  if (_battleRunning) return;
  showDungeonView();
}

onScreen('battle', renderBattleScreen);
