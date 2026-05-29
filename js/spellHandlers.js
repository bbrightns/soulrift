/* ============================================================
   SOULRIFT — spellHandlers.js
   Per-spell cast logic with level scaling.
   Each handler receives a `ctx` object and returns nothing.
   battle.js calls window.getSpellHandler(id) to get the handler.
   If no handler exists → battle.js uses default damage.
   ============================================================ */

'use strict';

/* ── Level scaling helpers ───────────────────────────────── */

// Standard damage scaling: +18% per level above 1
function lvlDmgMult(lvl) {
  return 1 + (lvl - 1) * 0.18;
}

// Flat bonus that grows per level
function lvlFlat(base, perLevel, lvl) {
  return base + (lvl - 1) * perLevel;
}

// Chance that grows per level, capped at max
function lvlChance(base, perLevel, max, lvl) {
  return Math.min(max, base + (lvl - 1) * perLevel);
}

/* ── ctx shape (passed in from battle.js) ────────────────── */
/*
ctx = {
  def,            // spell definition from spells.js
  player,         // live player object (mutable)
  enemy,          // live enemy object (mutable)
  enemyTemplate,  // static enemy template
  battleStatus,   // { burnStacks: [], chargeStacks: 0, totalGoldStolen: 0 }
  spellLvl,       // integer 1–10
  playerName,     // string
  log,            // async function(text, type) — appends to battle log
  updateHud,      // function() — refreshes combat HUD
  baseDmg,        // pre-calculated: Math.max(1, spellPower(def,player,spellLvl) - enemy.def)
}
*/

/* ── Handler registry ────────────────────────────────────── */
const SPELL_HANDLERS = {};

function registerHandler(id, fn) {
  SPELL_HANDLERS[id] = fn;
}

function getSpellHandler(id) {
  return SPELL_HANDLERS[id] || null;
}

/* ══════════════════════════════════════════════════════════
   LIGHT TOWER
══════════════════════════════════════════════════════════ */

// light_shot — basic damage (use default, no handler needed)

// light_charge — store charge stack, no damage
registerHandler('light_charge', async (ctx) => {
  if (!ctx.battleStatus.chargeStacks) ctx.battleStatus.chargeStacks = 0;
  const max = 5;
  if (ctx.battleStatus.chargeStacks < max) {
    ctx.battleStatus.chargeStacks++;
  }
  await ctx.log(ctx.playerName + ' casts Light Charge. Charge stacks: ' + ctx.battleStatus.chargeStacks + '/' + max + '.', 'player');
});

// holy_guard — ward + small heal, scales with level
registerHandler('holy_guard', async (ctx) => {
  const heal = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + heal);
  ctx.updateHud();
  await ctx.log(ctx.playerName + ' casts Holy Guard (Lv ' + ctx.spellLvl + '), spending ' + ctx.def.spCost + ' SP. Ward restores ' + heal + ' HP.', 'player');
});

// shield_of_absorption — ward, scales with level
registerHandler('shield_of_absorption', async (ctx) => {
  const shield = lvlFlat(12, 6, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + shield);
  ctx.updateHud();
  await ctx.log(ctx.playerName + ' casts Shield of Absorption (Lv ' + ctx.spellLvl + '). Absorbs ' + shield + ' HP.', 'player');
});

// charge_release_light_shot — consume charge stacks, bonus damage
registerHandler('charge_release_light_shot', async (ctx) => {
  const stacks = ctx.battleStatus.chargeStacks || 0;
  const bonus = Math.floor(stacks * 0.20 * ctx.baseDmg);
  const total = ctx.baseDmg + bonus;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.battleStatus.chargeStacks = 0;
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' releases Charge (×' + stacks + ' stacks) for ' + total + ' damage.', 'player'
  );
});

// angel_wing — dodge buff (simulate: heal as proxy until status system exists)
registerHandler('angel_wing', async (ctx) => {
  const dodgeChance = lvlChance(0.80, 0.02, 0.95, ctx.spellLvl);
  ctx.battleStatus.angelWingActive = dodgeChance;
  await ctx.log(
    ctx.playerName + ' casts Angel Wing (Lv ' + ctx.spellLvl + '). ' + Math.round(dodgeChance * 100) + '% dodge next attack.', 'player'
  );
});

// chorus_of_sanctuary — heal over time, scales with level
registerHandler('chorus_of_sanctuary', async (ctx) => {
  const totalHeal = lvlFlat(32, 8, ctx.spellLvl);
  const perTurn = Math.floor(totalHeal / 3);
  if (!ctx.battleStatus.regenStacks) ctx.battleStatus.regenStacks = [];
  ctx.battleStatus.regenStacks.push({ amount: perTurn, turnsLeft: 3 });
  await ctx.log(
    ctx.playerName + ' casts Chorus of Sanctuary (Lv ' + ctx.spellLvl + '). Regenerating ' + perTurn + ' HP/turn for 3 turns.', 'player'
  );
});

/* ══════════════════════════════════════════════════════════
   DARK TOWER
══════════════════════════════════════════════════════════ */

// dark_shot — basic damage (use default)

// curse_fang — apply curse debuff
registerHandler('curse_fang', async (ctx) => {
  const duration = lvlFlat(3, 1, ctx.spellLvl);
  ctx.battleStatus.curseActive = { turnsLeft: duration, bonus: 0.20 };
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Curse Fang (Lv ' + ctx.spellLvl + '). Cursed for ' + duration + ' turns (+20% dark dmg).', 'player'
  );
});

// fog — apply miss chance
registerHandler('fog', async (ctx) => {
  const missChance = lvlChance(0.35, 0.03, 0.60, ctx.spellLvl);
  const duration = 2;
  ctx.battleStatus.fogActive = { turnsLeft: duration, missChance };
  await ctx.log(
    ctx.playerName + ' casts Fog (Lv ' + ctx.spellLvl + '). Enemy has ' + Math.round(missChance * 100) + '% miss for ' + duration + ' turns.', 'player'
  );
});

// soul_drain — damage + lifesteal
registerHandler('soul_drain', async (ctx) => {
  const cursed = ctx.battleStatus.curseActive && ctx.battleStatus.curseActive.turnsLeft > 0;
  const lifestealRate = cursed ? 0.55 : 0.40;
  const heal = Math.floor(ctx.baseDmg * lifestealRate);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + heal);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Soul Drain (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' damage. Heals ' + heal + ' HP.', 'player'
  );
});

/* ══════════════════════════════════════════════════════════
   FIRE TOWER
══════════════════════════════════════════════════════════ */

// fire_shot — basic damage (use default)

// burn — apply burn stack, scales with level
registerHandler('burn', async (ctx) => {
  const power = Math.round(ctx.def.basePower * 0.35 * lvlDmgMult(ctx.spellLvl));
  ctx.battleStatus.burnStacks.push({ turnsLeft: 3, power });
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Burn (Lv ' + ctx.spellLvl + '). Stack applied, ' + power + '/turn. (' + ctx.battleStatus.burnStacks.length + ' active).', 'player'
  );
});

// fire_thief — damage + gold steal, scales with level
registerHandler('fire_thief', async (ctx) => {
  const burning = ctx.battleStatus.burnStacks.length > 0;
  const baseSteal = lvlFlat(12, 3, ctx.spellLvl);
  const stolen = baseSteal + Math.floor(Math.random() * 10) + (burning ? baseSteal : 0);
  getState().gold += stolen;
  saveState();
  syncHeader();
  ctx.battleStatus.totalGoldStolen += stolen;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Fire Thief (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Stole ' + stolen + ' Gold' + (burning ? ' (Burn bonus!)' : '') + '.', 'player'
  );
});

// ember_skin — damage reduction buff
registerHandler('ember_skin', async (ctx) => {
  const reduction = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + reduction);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Ember Skin (Lv ' + ctx.spellLvl + '). Ward absorbs ' + reduction + ' HP.', 'player'
  );
});

// explosion_burn — consume all burn stacks for burst
registerHandler('explosion_burn', async (ctx) => {
  const stacks = ctx.battleStatus.burnStacks.length;
  const stackBonus = Math.floor(stacks * ctx.baseDmg * 0.50);
  const total = ctx.baseDmg + stackBonus;
  ctx.battleStatus.burnStacks = [];
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' detonates Explosion Burn (Lv ' + ctx.spellLvl + ', ×' + stacks + ' stacks) for ' + total + ' damage!', 'player'
  );
});

/* ══════════════════════════════════════════════════════════
   ICE TOWER
══════════════════════════════════════════════════════════ */

// ice_shot — basic damage (use default)

// freeze — chance to skip enemy turn
registerHandler('freeze', async (ctx) => {
  const chance = lvlChance(0.70, 0.03, 0.90, ctx.spellLvl);
  const success = Math.random() < chance;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  if (success) {
    ctx.battleStatus.enemyFrozen = true;
    await ctx.log(
      ctx.playerName + ' casts Freeze (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Enemy is FROZEN — skips next action!', 'player'
    );
  } else {
    await ctx.log(
      ctx.playerName + ' casts Freeze (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Freeze failed (Chill applied).', 'player'
    );
  }
});

// energy_refill — restore SP, scales with level
registerHandler('energy_refill', async (ctx) => {
  const refill = lvlFlat(16, 3, ctx.spellLvl);
  ctx.player.sp = Math.min(ctx.player.spMax, ctx.player.sp + refill);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Energy Refill (Lv ' + ctx.spellLvl + '). Restores ' + refill + ' SP.', 'player'
  );
});

// frost_ward — small shield
registerHandler('frost_ward', async (ctx) => {
  const ward = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + ward);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Frost Ward (Lv ' + ctx.spellLvl + '). Absorbs ' + ward + ' HP.', 'player'
  );
});

// mana_combo — deal damage + add mana combo stack
registerHandler('mana_combo', async (ctx) => {
  if (!ctx.battleStatus.manaCombo) ctx.battleStatus.manaCombo = 0;
  if (ctx.battleStatus.manaCombo < 5) ctx.battleStatus.manaCombo++;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Mana Combo (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Combo: ' + ctx.battleStatus.manaCombo + '/5.', 'player'
  );
});

// mana_burst — consume mana combo stacks for burst
registerHandler('mana_burst', async (ctx) => {
  const stacks = ctx.battleStatus.manaCombo || 0;
  const bonus = Math.floor(stacks * 0.20 * ctx.baseDmg);
  const total = ctx.baseDmg + bonus;
  ctx.battleStatus.manaCombo = 0;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' releases Mana Burst (Lv ' + ctx.spellLvl + ', ×' + stacks + ' combo) for ' + total + ' damage!', 'player'
  );
});

/* ── Expose ──────────────────────────────────────────────── */
window.getSpellHandler = getSpellHandler;
