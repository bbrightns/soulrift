/* ============================================================
   SOULRIFT — /js/spellHandlers.js
   Per-spell cast logic with level scaling.
   Each handler receives a `ctx` object and returns nothing.
   battle.js calls window.getSpellHandler(id) to get the handler.
   If no handler exists → battle.js uses default damage.
   ============================================================ */

'use strict';

/* ── Utility: format player name in logs ────────────────────── */
function ctxGoldenName(ctx) {
  return '<span class="log-name">' + ctx.playerName + '</span>';
}

function wrapLogText(html) {
  return '<span class="log-line-text">' + html + '</span>';
}

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
  await ctx.log(ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Light Charge. Charge stacks: ' + ctx.battleStatus.chargeStacks + '/' + max + '.', 'player'));
});

// holy_guard — ward + small heal, scales with level
registerHandler('holy_guard', async (ctx) => {
  const heal = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + heal);
  ctx.updateHud();
  await ctx.log(ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Holy Guard (Lv ' + ctx.spellLvl + '), spending ' + ctx.def.spCost + ' SP. Ward restores ' + heal + ' HP.', 'player'));
});

// shield_of_absorption — ward, scales with level
registerHandler('shield_of_absorption', async (ctx) => {
  const shield = lvlFlat(12, 6, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + shield);
  ctx.updateHud();
  await ctx.log(ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Shield of Absorption (Lv ' + ctx.spellLvl + '). Absorbs ' + shield + ' HP.', 'player'));
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
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' releases Charge (×' + stacks + ' stacks) for ' + total + ' damage.', 'player'
  ));
});

// angel_wing — dodge buff (simulate: heal as proxy until status system exists)
registerHandler('angel_wing', async (ctx) => {
  const dodgeChance = lvlChance(0.80, 0.02, 0.95, ctx.spellLvl);
  ctx.battleStatus.angelWingActive = dodgeChance;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Angel Wing (Lv ' + ctx.spellLvl + '). ' + Math.round(dodgeChance * 100) + '% dodge next attack.', 'player'
  ));
});

// chorus_of_sanctuary — heal over time, scales with level
registerHandler('chorus_of_sanctuary', async (ctx) => {
  const totalHeal = lvlFlat(32, 8, ctx.spellLvl);
  const perTurn = Math.floor(totalHeal / 3);
  if (!ctx.battleStatus.regenStacks) ctx.battleStatus.regenStacks = [];
  ctx.battleStatus.regenStacks.push({ amount: perTurn, turnsLeft: 3 });
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Chorus of Sanctuary (Lv ' + ctx.spellLvl + '). Regenerating ' + perTurn + ' HP/turn for 3 turns.', 'player'
  ));
});

/* ══════════════════════════════════════════════════════════
   DARK TOWER
══════════════════════════════════════════════════════════ */

// dark_shot — basic damage (use default)

// curse_fang — apply curse debuff
registerHandler('curse_fang', async (ctx) => {
  const duration = lvlFlat(3, 1, ctx.spellLvl);
  ctx.battleStatus.curseActive = { turnsLeft: duration, bonus: 0.20 };
  const directDmg = Math.max(1, ctx.def.basePower - ctx.enemy.def);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - directDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Curse Fang (Lv ' + ctx.spellLvl + '). Direct ' + directDmg + ' dmg. Cursed for ' + duration + ' turns (+20% dark dmg).', 'player'
  ));
});

// fog — apply miss chance
registerHandler('fog', async (ctx) => {
  const missChance = lvlChance(0.35, 0.03, 0.60, ctx.spellLvl);
  const duration = 2;
  ctx.battleStatus.fogActive = { turnsLeft: duration, missChance };
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Fog (Lv ' + ctx.spellLvl + '). Enemy has ' + Math.round(missChance * 100) + '% miss for ' + duration + ' turns.', 'player'
  ));
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
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Soul Drain (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' damage. Heals ' + heal + ' HP.', 'player'
  ));
});

/* ══════════════════════════════════════════════════════════
   FIRE TOWER
══════════════════════════════════════════════════════════ */

// fire_shot — basic damage (use default)

// burn — apply burn stack, scales with level
registerHandler('burn', async (ctx) => {
  if (!ctx.battleStatus.burnStacks) ctx.battleStatus.burnStacks = [];
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;

  const power = Math.round(ctx.def.basePower * 0.35 * lvlDmgMult(ctx.spellLvl));
  const duration = ctx.spellLvl;
  ctx.battleStatus.burnStacks.push({ turnsLeft: duration, power });
  ctx.battleStatus.burnStackCount++;

  const directDmg = Math.max(1, ctx.def.basePower - ctx.enemy.def);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - directDmg);
  ctx.updateHud();

  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Burn (Lv ' + ctx.spellLvl + ') making ' + directDmg + ' damage.'
    + ' Total ' + ctx.battleStatus.burnStackCount + ' stack' + (ctx.battleStatus.burnStackCount > 1 ? "s" : "") + '.', 'player'
  ));
});

// fire_thief — damage + gold steal, scales with level
registerHandler('fire_thief', async (ctx) => {
  // burning = any active DoT entry still ticking
  const burning = (ctx.battleStatus.burnStacks || []).some(s => s.turnsLeft > 0);
  const baseSteal = lvlFlat(12, 3, ctx.spellLvl);
  const stolen = baseSteal + Math.floor(Math.random() * 10) + (burning ? baseSteal : 0);
  getState().gold += stolen;
  saveState();
  syncHeader();
  ctx.battleStatus.totalGoldStolen += stolen;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Fire Thief (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg.'
    + ' Stole ' + stolen + ' Gold (base ' + baseSteal + '–' + (baseSteal + 9) + ')' + (burning ? ' · Burn bonus!' : '') + '.', 'player'
  ));
});

// ember_skin — damage reduction buff
registerHandler('ember_skin', async (ctx) => {
  const reduction = 0.25;
  const turns = lvlFlat(2, 1, ctx.spellLvl); // Lv1=2t, Lv2=3t, Lv3=4t...
  ctx.battleStatus.emberSkinTurns = turns;
  ctx.battleStatus.emberSkinReduction = reduction;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Ember Skin (Lv ' + ctx.spellLvl + ').'
    + ' Reduces incoming damage by 25% for ' + turns + ' turns.', 'player'
  ));
});

// explosion_burn — consume all burn stacks for burst
registerHandler('explosion_burn', async (ctx) => {
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;
  const stacks = ctx.battleStatus.burnStackCount;
  const stackBonus = Math.floor(stacks * ctx.baseDmg * 0.50);
  const total = ctx.baseDmg + stackBonus;

  // consume all stacks
  ctx.battleStatus.burnStacks = [];
  ctx.battleStatus.burnStackCount = 0;

  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' detonates Explosion Burn (Lv ' + ctx.spellLvl + ', ×' + stacks + ' stacks) for ' + total + ' damage!', 'player'
  ));
});

/* ══════════════════════════════════════════════════════════
   ICE TOWER
══════════════════════════════════════════════════════════ */

// ice_shot — basic damage (use default)

// freeze — chance to skip enemy turn
registerHandler('freeze', async (ctx) => {
  const chance = lvlChance(0.30, 0.03, 0.57, ctx.spellLvl);
  const success = Math.random() < chance;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  if (success) {
    ctx.battleStatus.enemyFrozen = true;
    await ctx.log(
      ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Freeze (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Enemy is FROZEN — skips next action!', 'player'
    ));
  } else {
    await ctx.log(
      ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Freeze (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Freeze failed (Chill applied).', 'player'
    ));
  }
});

// energy_refill — restore SP, scales with level
registerHandler('energy_refill', async (ctx) => {
  const refill = lvlFlat(16, 3, ctx.spellLvl);
  ctx.player.sp = Math.min(ctx.player.spMax, ctx.player.sp + refill);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Energy Refill (Lv ' + ctx.spellLvl + '). Restores ' + refill + ' SP.', 'player'
  ));
});

// frost_ward — small shield
registerHandler('frost_ward', async (ctx) => {
  const ward = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + ward);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Frost Ward (Lv ' + ctx.spellLvl + '). Absorbs ' + ward + ' HP.', 'player'
  ));
});

// mana_combo — deal damage + add mana combo stack
registerHandler('mana_combo', async (ctx) => {
  if (!ctx.battleStatus.manaCombo) ctx.battleStatus.manaCombo = 0;
  if (ctx.battleStatus.manaCombo < 5) ctx.battleStatus.manaCombo++;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' casts Mana Combo (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Combo: ' + ctx.battleStatus.manaCombo + '/5.', 'player'
  ));
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
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' releases Mana Burst (Lv ' + ctx.spellLvl + ', ×' + stacks + ' combo) for ' + total + ' damage!', 'player'
  ));
});

/* ══════════════════════════════════════════════════════════
   LIGHT TOWER — remaining handlers
══════════════════════════════════════════════════════════ */

// divine_reflection — reflect next enemy hit back as holy damage
registerHandler('divine_reflection', async (ctx) => {
  const reflectPct = lvlChance(0.60, 0.04, 0.90, ctx.spellLvl);
  ctx.battleStatus.divineReflect = reflectPct;
  await ctx.log(
    ctx.playerName + ' casts Divine Reflection (Lv ' + ctx.spellLvl + '). Next enemy hit is reflected at ' + Math.round(reflectPct * 100) + '%.', 'player'
  );
});

// energy_blast — damage that ignores enemy evasion (no fog/angel wing miss)
// No special handler needed — default damage is sufficient
// Mark as registered so it's clear it's intentional
registerHandler('energy_blast', async (ctx) => {
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Energy Blast (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' damage. Ignores evasion.', 'player'
  );
});

// heavenfall_chronicle — consume charge stacks + buffs for massive damage
registerHandler('heavenfall_chronicle', async (ctx) => {
  const stacks = ctx.battleStatus.chargeStacks || 0;
  const chargeBonus = Math.floor(stacks * 0.25 * ctx.baseDmg);
  const total = ctx.baseDmg + chargeBonus;
  ctx.battleStatus.chargeStacks = 0;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' calls down Heavenfall Chronicle (Lv ' + ctx.spellLvl + ', ×' + stacks + ' charge) for ' + total + ' holy damage!', 'player'
  );
});

/* ══════════════════════════════════════════════════════════
   DARK TOWER — remaining handlers
══════════════════════════════════════════════════════════ */

// siege — damage + reduce enemy DEF permanently this battle
registerHandler('siege', async (ctx) => {
  const defReduction = Math.floor(ctx.enemy.def * 0.30);
  ctx.enemy.def = Math.max(0, ctx.enemy.def - defReduction);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Siege (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Enemy DEF reduced by ' + defReduction + ' permanently.', 'player'
  );
});

// dark_combo — damage + build combo counter → crit multiplier
registerHandler('dark_combo', async (ctx) => {
  if (!ctx.battleStatus.darkCombo) ctx.battleStatus.darkCombo = 0;
  if (ctx.battleStatus.darkCombo < 5) ctx.battleStatus.darkCombo++;
  const combo = ctx.battleStatus.darkCombo;
  let dmg = ctx.baseDmg;
  let critMsg = '';
  if (combo >= 3) {
    const critChance = 0.40 + (combo - 3) * 0.10;
    if (Math.random() < critChance) {
      const critMult = combo >= 5 ? 2.5 : 2.0;
      dmg = Math.floor(dmg * critMult);
      critMsg = ' CRITICAL ×' + critMult + '!';
    }
  }
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - dmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Dark Combo (Lv ' + ctx.spellLvl + ') for ' + dmg + ' dmg. Combo: ' + combo + '/5.' + critMsg, 'player'
  );
});

// night_raid — bonus damage between 18:00–06:00 local time
registerHandler('night_raid', async (ctx) => {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  const nightBonus = isNight ? Math.floor(ctx.baseDmg * 0.50) : 0;
  const total = ctx.baseDmg + nightBonus;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Night Raid (Lv ' + ctx.spellLvl + ') for ' + total + ' dmg.' + (isNight ? ' Night bonus +50%!' : ''), 'player'
  );
});

// dark_rift — true damage, bypasses enemy DEF entirely
registerHandler('dark_rift', async (ctx) => {
  // true damage: use basePower + player scaling but skip def reduction
  const trueDmg = Math.max(1, Math.floor((ctx.player.atk + ctx.player.int) * 0.75 * (1 + (ctx.spellLvl - 1) * 0.18)));
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - trueDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' opens Dark Rift (Lv ' + ctx.spellLvl + ') for ' + trueDmg + ' TRUE damage. Ignores defense.', 'player'
  );
});

// demon_summoning — summon DoT for 3 turns
registerHandler('demon_summoning', async (ctx) => {
  const demonPower = Math.floor(ctx.baseDmg * 0.60);
  if (!ctx.battleStatus.demonStacks) ctx.battleStatus.demonStacks = [];
  // clear old demon first (only 1 active)
  ctx.battleStatus.demonStacks = [];
  ctx.battleStatus.demonStacks.push({ turnsLeft: 3, power: demonPower });
  await ctx.log(
    ctx.playerName + ' summons a demon (Lv ' + ctx.spellLvl + '). Attacks for ' + demonPower + '/turn for 3 turns.', 'player'
  );
});

// oblivion_gospel — massive dark dmg, execute if enemy HP < 20%
registerHandler('oblivion_gospel', async (ctx) => {
  const cursed = ctx.battleStatus.curseActive && ctx.battleStatus.curseActive.turnsLeft > 0;
  const comboMult = 1 + (ctx.battleStatus.darkCombo || 0) * 0.10;
  const curseMult = cursed ? 1.20 : 1.0;
  const total = Math.floor(ctx.baseDmg * comboMult * curseMult);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();

  const hpPct = ctx.enemy.hp / ctx.enemyTemplate.hp;
  let msg = ctx.playerName + ' casts Oblivion Gospel (Lv ' + ctx.spellLvl + ') for ' + total + ' dark damage!';
  if (hpPct < 0.20 && ctx.enemy.hp > 0) {
    const executeDmg = ctx.enemy.hp;
    ctx.enemy.hp = 0;
    ctx.updateHud();
    msg += ' EXECUTE! (' + executeDmg + ' remaining HP obliterated)';
  }
  await ctx.log(msg, 'player');
});

/* ══════════════════════════════════════════════════════════
   FIRE TOWER — remaining handlers
══════════════════════════════════════════════════════════ */

// melt_armor — damage + reduce enemy DEF (physical focus)
registerHandler('melt_armor', async (ctx) => {
  const defReduction = Math.floor(ctx.enemy.def * 0.25);
  ctx.enemy.def = Math.max(0, ctx.enemy.def - defReduction);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Melt Armor (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Enemy DEF melted by ' + defReduction + '.', 'player'
  );
});

// fire_storm — DoT over 2 turns + 40% chance disrupt (simulated)
registerHandler('fire_storm', async (ctx) => {
  const stormPower = Math.floor(ctx.baseDmg * 0.55);
  if (!ctx.battleStatus.fireStormStacks) ctx.battleStatus.fireStormStacks = [];
  ctx.battleStatus.fireStormStacks.push({ turnsLeft: 2, power: stormPower });
  await ctx.log(
    ctx.playerName + ' unleashes Fire Storm (Lv ' + ctx.spellLvl + ').', 'player'
  );
});

// phoenix_blood — damage scales with missing HP
registerHandler('phoenix_blood', async (ctx) => {
  const missingHpPct = 1 - (ctx.player.hp / ctx.player.hpMax);
  const total = Math.floor(ctx.baseDmg * (1 + missingHpPct));
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' casts Phoenix Blood (Lv ' + ctx.spellLvl + ') for ' + total + ' dmg. (Missing HP: ' + Math.round(missingHpPct * 100) + '%)', 'player'
  );
});

// wyvern_kamikaze — heavy physical fire damage, ignores 20% DEF
registerHandler('wyvern_kamikaze', async (ctx) => {
  const defIgnore = Math.floor(ctx.enemy.def * 0.20);
  const total = Math.max(1, ctx.baseDmg + defIgnore);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' commands Wyvern Kamikaze (Lv ' + ctx.spellLvl + ') for ' + total + ' physical fire damage!', 'player'
  );
});

// ragnarok_ignition — consume burn stacks + fire storm for ultimate burst
registerHandler('ragnarok_ignition', async (ctx) => {
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;
  const burnStacks = ctx.battleStatus.burnStackCount;
  const stormStacks = (ctx.battleStatus.fireStormStacks || []).length;
  const burnBonus = Math.floor(burnStacks * 0.30 * ctx.baseDmg);
  const stormBonus = Math.floor(stormStacks * 0.20 * ctx.baseDmg);
  const total = ctx.baseDmg + burnBonus + stormBonus;

  ctx.battleStatus.burnStacks = [];
  ctx.battleStatus.burnStackCount = 0;
  ctx.battleStatus.fireStormStacks = [];

  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(ctxGoldenName(ctx) + ' ignites Ragnarok (Lv ' + ctx.spellLvl + ', ×' + burnStacks + ' burn, ×' + stormStacks + ' storm) for ' + total + ' damage!', 'player'
  ));
});

/* ══════════════════════════════════════════════════════════
   ICE TOWER — remaining handlers
══════════════════════════════════════════════════════════ */

// absolute_zero — heavy damage + high freeze chance
registerHandler('absolute_zero', async (ctx) => {
  const freezeChance = lvlChance(0.90, 0.01, 0.95, ctx.spellLvl);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - ctx.baseDmg);
  ctx.updateHud();
  if (Math.random() < freezeChance) {
    ctx.battleStatus.enemyFrozen = true;
    await ctx.log(
      ctx.playerName + ' casts Absolute Zero (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. FROZEN (' + Math.round(freezeChance * 100) + '% chance)!', 'player'
    );
  } else {
    await ctx.log(
      ctx.playerName + ' casts Absolute Zero (Lv ' + ctx.spellLvl + ') for ' + ctx.baseDmg + ' dmg. Freeze failed.', 'player'
    );
  }
});

// golem_command — summon golem DoT for 3 turns
registerHandler('golem_command', async (ctx) => {
  const golemPower = Math.floor(ctx.baseDmg * 0.50);
  ctx.battleStatus.golemStacks = [{ turnsLeft: 3, power: golemPower }];
  await ctx.log(
    ctx.playerName + ' commands a Golem (Lv ' + ctx.spellLvl + '). Attacks for ' + golemPower + '/turn for 3 turns.', 'player'
  );
});

// golem_master — upgrade existing golem or summon war golem
registerHandler('golem_master', async (ctx) => {
  const existing = ctx.battleStatus.golemStacks && ctx.battleStatus.golemStacks.length > 0;
  if (existing) {
    ctx.battleStatus.golemStacks.forEach(g => {
      g.power = Math.floor(g.power * 1.60);
      g.turnsLeft = Math.min(g.turnsLeft + 2, 6);
    });
    await ctx.log(
      ctx.playerName + ' upgrades the Golem (Lv ' + ctx.spellLvl + '). Power ×1.6, +2 turns.', 'player'
    );
  } else {
    const warGolemPower = Math.floor(ctx.baseDmg * 0.70);
    ctx.battleStatus.golemStacks = [{ turnsLeft: 4, power: warGolemPower }];
    await ctx.log(
      ctx.playerName + ' summons a War Golem (Lv ' + ctx.spellLvl + '). Attacks for ' + warGolemPower + '/turn for 4 turns.', 'player'
    );
  }
});

// glacial_singularity — consume mana combo + freeze bonus
registerHandler('glacial_singularity', async (ctx) => {
  const combo = ctx.battleStatus.manaCombo || 0;
  const frozen = ctx.battleStatus.enemyFrozen ? 1 : 0;
  const spPct = ctx.player.sp / ctx.player.spMax;
  const comboBonus = Math.floor(combo * 0.20 * ctx.baseDmg);
  const freezeBonus = Math.floor(frozen * 0.30 * ctx.baseDmg);
  const spBonus = Math.floor(spPct * 0.40 * ctx.baseDmg);
  const total = ctx.baseDmg + comboBonus + freezeBonus + spBonus;
  ctx.battleStatus.manaCombo = 0;
  ctx.battleStatus.enemyFrozen = false;
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - total);
  ctx.updateHud();
  await ctx.log(
    ctx.playerName + ' collapses Glacial Singularity (Lv ' + ctx.spellLvl + ', ×' + combo + ' combo) for ' + total + ' damage!', 'player'
  );
});

/* ── Expose ──────────────────────────────────────────────── */
window.getSpellHandler = getSpellHandler;
