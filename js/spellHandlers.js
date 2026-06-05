/* ============================================================
   PATCH FILE: js/spellHandlers.js
   These changes wire Void Shield + Spell Reflect into every
   existing spell handler via a shared helper pattern.

   ADD this block near the top of spellHandlers.js,
   right after the existing utility functions
   (after wrapLogText / ctxGoldenName / lvl helpers):
   ============================================================ */

/* ── Dungeon ability helpers (called inside every handler) ── */

// Absorbs dmg into Void Shield first; returns remaining damage
function voidShieldAbsorb(ctx, dmg) {
  if (ctx.battleStatus.voidShieldBroken
      || !ctx.battleStatus.voidShieldRemaining) return dmg;
  const abs = Math.min(ctx.battleStatus.voidShieldRemaining, dmg);
  ctx.battleStatus.voidShieldRemaining -= abs;
  if (ctx.battleStatus.voidShieldRemaining <= 0) {
    ctx.battleStatus.voidShieldBroken = true;
  }
  return dmg - abs;
}

// Logs Void Shield break once
async function logVoidShieldBreak(ctx) {
  if (ctx.battleStatus.voidShieldBroken && !ctx.battleStatus._vsBreakLogged) {
    ctx.battleStatus._vsBreakLogged = true;
    await ctx.log('The Void Shield shatters!', 'system');
  }
}

// Reflects pct of finalDmg back to player (First Arcanist)
async function applyReflect(ctx, finalDmg) {
  if (!ctx.enemyTemplate.spellReflect || finalDmg <= 0) return;
  const ref = Math.floor(finalDmg * ctx.enemyTemplate.spellReflectPct);
  if (ref <= 0) return;
  ctx.player.hp = Math.max(0, ctx.player.hp - ref);
  ctx.updateHud();
  await ctx.log(
    (ctx.enemyAvatarHTML || '') + wrapLogText(ctx.enemyTemplate.name + ' reflects ' + ref + ' damage back!'),
    'enemy warn'
  );
}

// Apply smoke-stack damage reduction (Public Bus)
function smokeReduce(ctx, dmg) {
  if (!ctx.battleStatus.smokeStackCount || !ctx.enemyTemplate.smokeStacks) return dmg;
  const r = ctx.battleStatus.smokeStackCount * ctx.enemyTemplate.smokeAtkReduction;
  return Math.max(1, Math.floor(dmg * (1 - r)));
}

// Motorbike dodge check — returns true if spell is dodged entirely
async function checkMotorbikeDodge(ctx) {
  if (!ctx.enemyTemplate.dodgeChance) return false;
  if (Math.random() < ctx.enemyTemplate.dodgeChance) {
    await ctx.log(
      ctx.spellIconHTML
      + wrapLogText(ctxGoldenName(ctx) + ' casts ' + ctx.def.name
        + ' — the swarm weaves through it!'),
      'warn'
    );
    return true;
  }
  return false;
}

// Master helper: apply dmg to enemy with all dungeon modifiers, log, reflect
async function dealDamage(ctx, rawDmg, logLine) {
  if (await checkMotorbikeDodge(ctx)) return 0;
  let dmg = smokeReduce(ctx, rawDmg);
  dmg = voidShieldAbsorb(ctx, dmg);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - dmg);
  ctx.updateHud();
  await logVoidShieldBreak(ctx);
  await ctx.log(ctx.spellIconHTML + wrapLogText(logLine), 'player');
  await applyReflect(ctx, dmg);
  return dmg;
}


/* ============================================================
   REPLACE every spell handler that calls:
     ctx.enemy.hp = Math.max(0, ctx.enemy.hp - X);
     ctx.updateHud();
     await ctx.log(...)
   With:
     await dealDamage(ctx, X, '...log text...');

   Below are the UPDATED versions of all 28 handlers.
   You can paste this entire block to replace the existing
   SPELL_HANDLERS section in spellHandlers.js.
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   LIGHT TOWER
══════════════════════════════════════════════════════════ */

registerHandler('light_charge', async (ctx) => {
  if (!ctx.battleStatus.chargeStacks) ctx.battleStatus.chargeStacks = 0;
  if (ctx.battleStatus.chargeStacks < 5) ctx.battleStatus.chargeStacks++;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Light Charge. Stacks: '
      + ctx.battleStatus.chargeStacks + '/5.'
    ), 'player'
  );
});

registerHandler('holy_guard', async (ctx) => {
  const heal = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + heal);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Holy Guard. Restores ' + heal + ' HP.'
    ), 'player'
  );
});

registerHandler('shield_of_absorption', async (ctx) => {
  const shield = lvlFlat(12, 6, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + shield);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Shield of Absorption. Absorbs ' + shield + ' HP.'
    ), 'player'
  );
});

registerHandler('charge_release_light_shot', async (ctx) => {
  const stacks = ctx.battleStatus.chargeStacks || 0;
  const total = ctx.baseDmg + Math.floor(stacks * 0.20 * ctx.baseDmg);
  ctx.battleStatus.chargeStacks = 0;
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' releases Charge (×' + stacks + ' stacks) for ' + total + ' damage.'
  );
});

registerHandler('angel_wing', async (ctx) => {
  const dodgeChance = lvlChance(0.80, 0.02, 0.95, ctx.spellLvl);
  ctx.battleStatus.angelWingActive = dodgeChance;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Angel Wing. '
      + Math.round(dodgeChance * 100) + '% dodge next attack.'
    ), 'player'
  );
});

registerHandler('chorus_of_sanctuary', async (ctx) => {
  const totalHeal = lvlFlat(32, 8, ctx.spellLvl);
  const perTurn = Math.floor(totalHeal / 3);
  if (!ctx.battleStatus.regenStacks) ctx.battleStatus.regenStacks = [];
  ctx.battleStatus.regenStacks.push({ amount: perTurn, turnsLeft: 3 });
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Chorus of Sanctuary. Regen ' + perTurn + ' HP/turn for 3 turns.'
    ), 'player'
  );
});

registerHandler('divine_reflection', async (ctx) => {
  const reflectPct = lvlChance(0.60, 0.04, 0.90, ctx.spellLvl);
  ctx.battleStatus.divineReflect = reflectPct;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Divine Reflection. Next enemy hit reflected at '
      + Math.round(reflectPct * 100) + '%.'
    ), 'player'
  );
});

registerHandler('energy_blast', async (ctx) => {
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' fires Energy Blast for ' + ctx.baseDmg + ' damage. Ignores evasion.'
  );
});

registerHandler('heavenfall_chronicle', async (ctx) => {
  const stacks = ctx.battleStatus.chargeStacks || 0;
  const total = ctx.baseDmg + Math.floor(stacks * 0.25 * ctx.baseDmg);
  ctx.battleStatus.chargeStacks = 0;
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' calls Heavenfall Chronicle (×' + stacks + ' charge) for ' + total + ' holy damage!'
  );
});

/* ══════════════════════════════════════════════════════════
   DARK TOWER
══════════════════════════════════════════════════════════ */

registerHandler('curse_fang', async (ctx) => {
  const duration = lvlFlat(3, 1, ctx.spellLvl);
  ctx.battleStatus.curseActive = { turnsLeft: duration, bonus: 0.20 };
  const directDmg = Math.max(1, ctx.def.basePower - ctx.enemy.def);
  await dealDamage(ctx, directDmg,
    ctxGoldenName(ctx) + ' casts Curse Fang. ' + directDmg + ' dmg. Cursed '
    + duration + ' turns (+20% dark dmg).'
  );
});

registerHandler('fog', async (ctx) => {
  const missChance = lvlChance(0.35, 0.03, 0.60, ctx.spellLvl);
  ctx.battleStatus.fogActive = { turnsLeft: 2, missChance };
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Fog. Enemy '
      + Math.round(missChance * 100) + '% miss for 2 turns.'
    ), 'player'
  );
});

registerHandler('soul_drain', async (ctx) => {
  const cursed = ctx.battleStatus.curseActive && ctx.battleStatus.curseActive.turnsLeft > 0;
  const lifestealRate = cursed ? 0.55 : 0.40;
  const dmgDealt = await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Soul Drain for ' + ctx.baseDmg + ' damage.'
  );
  const heal = Math.floor(dmgDealt * lifestealRate);
  if (heal > 0) {
    ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + heal);
    ctx.updateHud();
    await ctx.log(wrapLogText('Soul Drain heals ' + heal + ' HP.'), 'player');
  }
});

registerHandler('siege', async (ctx) => {
  const defReduction = Math.floor(ctx.enemy.def * 0.30);
  ctx.enemy.def = Math.max(0, ctx.enemy.def - defReduction);
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Siege for ' + ctx.baseDmg
    + ' dmg. Enemy DEF reduced by ' + defReduction + '.'
  );
});

registerHandler('dark_combo', async (ctx) => {
  if (!ctx.battleStatus.darkCombo) ctx.battleStatus.darkCombo = 0;
  if (ctx.battleStatus.darkCombo < 5) ctx.battleStatus.darkCombo++;
  const combo = ctx.battleStatus.darkCombo;
  const dmg = Math.floor(ctx.baseDmg * (1 + combo * 0.15));
  await dealDamage(ctx, dmg,
    ctxGoldenName(ctx) + ' casts Dark Combo for ' + dmg
    + ' dmg (+' + Math.round(combo * 15) + '%). Combo: ' + combo + '/5.'
  );
});

registerHandler('night_raid', async (ctx) => {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  const total = ctx.baseDmg + (isNight ? Math.floor(ctx.baseDmg * 0.50) : 0);
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' casts Night Raid for ' + total + ' dmg.'
    + (isNight ? ' Night bonus +50%!' : '')
  );
});

registerHandler('dark_rift', async (ctx) => {
  // True damage — skip enemy.def entirely, but still check Void Shield
  const trueDmg = Math.max(1, Math.floor(
    (ctx.player.atk + ctx.player.int) * 0.75 * lvlDmgMult(ctx.spellLvl)
  ));
  if (await checkMotorbikeDodge(ctx)) return;
  const afterShield = voidShieldAbsorb(ctx, trueDmg);
  ctx.enemy.hp = Math.max(0, ctx.enemy.hp - afterShield);
  ctx.updateHud();
  await logVoidShieldBreak(ctx);
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' opens Dark Rift for ' + afterShield + ' TRUE damage.'
    ), 'player'
  );
  await applyReflect(ctx, afterShield);
});

registerHandler('demon_summoning', async (ctx) => {
  const demonPower = Math.floor(ctx.baseDmg * 0.60);
  ctx.battleStatus.demonStacks = [{ turnsLeft: 3, power: demonPower }];
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' summons a demon. ' + demonPower + ' dmg/turn for 3 turns.'
    ), 'player'
  );
});

registerHandler('oblivion_gospel', async (ctx) => {
  const cursed = ctx.battleStatus.curseActive && ctx.battleStatus.curseActive.turnsLeft > 0;
  const comboMult = 1 + (ctx.battleStatus.darkCombo || 0) * 0.10;
  const curseMult = cursed ? 1.20 : 1.0;
  const total = Math.floor(ctx.baseDmg * comboMult * curseMult);
  const dmgDealt = await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' casts Oblivion Gospel for ' + total + ' dark damage!'
  );
  const hpPct = ctx.enemy.hp / ctx.enemyTemplate.hp;
  if (hpPct < 0.20 && ctx.enemy.hp > 0 && dmgDealt > 0) {
    const executeDmg = ctx.enemy.hp;
    ctx.enemy.hp = 0;
    ctx.updateHud();
    await ctx.log(
      wrapLogText('EXECUTE! ' + executeDmg + ' remaining HP obliterated.'), 'player'
    );
  }
});

/* ══════════════════════════════════════════════════════════
   FIRE TOWER
══════════════════════════════════════════════════════════ */

registerHandler('burn', async (ctx) => {
  if (!ctx.battleStatus.burnStacks) ctx.battleStatus.burnStacks = [];
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;
  const power = Math.round(ctx.def.basePower * 0.35 * lvlDmgMult(ctx.spellLvl));
  ctx.battleStatus.burnStacks.push({ turnsLeft: ctx.spellLvl, power });
  ctx.battleStatus.burnStackCount++;
  const directDmg = Math.max(1, ctx.def.basePower - ctx.enemy.def);
  await dealDamage(ctx, directDmg,
    ctxGoldenName(ctx) + ' applies Burn (' + directDmg + ' dmg). Stacks: '
    + ctx.battleStatus.burnStackCount + '.'
  );
});

registerHandler('fire_thief', async (ctx) => {
  const burning = (ctx.battleStatus.burnStacks || []).some(s => s.turnsLeft > 0);
  const baseSteal = lvlFlat(12, 3, ctx.spellLvl);
  const stolen = baseSteal + Math.floor(Math.random() * 10) + (burning ? baseSteal : 0);
  getState().gold += stolen;
  saveState();
  syncHeader();
  ctx.battleStatus.totalGoldStolen += stolen;
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Fire Thief for ' + ctx.baseDmg + ' dmg. Stole '
    + stolen + ' Gold.' + (burning ? ' Burn bonus!' : '')
  );
});

registerHandler('ember_skin', async (ctx) => {
  const turns = lvlFlat(2, 1, ctx.spellLvl);
  ctx.battleStatus.emberSkinTurns = turns;
  ctx.battleStatus.emberSkinReduction = 0.25;
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Ember Skin. -25% incoming damage for ' + turns + ' turns.'
    ), 'player'
  );
});

registerHandler('explosion_burn', async (ctx) => {
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;
  const stacks = ctx.battleStatus.burnStackCount;
  const total = ctx.baseDmg + Math.floor(stacks * ctx.baseDmg * 0.50);
  ctx.battleStatus.burnStacks = [];
  ctx.battleStatus.burnStackCount = 0;
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' detonates Explosion Burn (×' + stacks + ' stacks) for ' + total + ' damage!'
  );
});

registerHandler('melt_armor', async (ctx) => {
  const defReduction = Math.floor(ctx.enemy.def * 0.25);
  ctx.enemy.def = Math.max(0, ctx.enemy.def - defReduction);
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Melt Armor for ' + ctx.baseDmg
    + ' dmg. Enemy DEF melted by ' + defReduction + '.'
  );
});

registerHandler('fire_storm', async (ctx) => {
  const stormPower = Math.floor(ctx.baseDmg * 0.55);
  if (!ctx.battleStatus.fireStormStacks) ctx.battleStatus.fireStormStacks = [];
  ctx.battleStatus.fireStormStacks.push({ turnsLeft: 2, power: stormPower });
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' unleashes Fire Storm. ' + stormPower + ' dmg/turn for 2 turns.'
    ), 'player'
  );
});

registerHandler('phoenix_blood', async (ctx) => {
  const missingHpPct = 1 - (ctx.player.hp / ctx.player.hpMax);
  const total = Math.floor(ctx.baseDmg * (1 + missingHpPct));
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' casts Phoenix Blood for ' + total
    + ' dmg. (Missing HP: ' + Math.round(missingHpPct * 100) + '%)'
  );
});

registerHandler('wyvern_kamikaze', async (ctx) => {
  const defIgnore = Math.floor(ctx.enemy.def * 0.20);
  const total = Math.max(1, ctx.baseDmg + defIgnore);
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' commands Wyvern Kamikaze for ' + total + ' physical fire damage!'
  );
});

registerHandler('ragnarok_ignition', async (ctx) => {
  if (!('burnStackCount' in ctx.battleStatus)) ctx.battleStatus.burnStackCount = 0;
  const burnStacks = ctx.battleStatus.burnStackCount;
  const stormStacks = (ctx.battleStatus.fireStormStacks || []).length;
  const total = ctx.baseDmg
    + Math.floor(burnStacks  * 0.30 * ctx.baseDmg)
    + Math.floor(stormStacks * 0.20 * ctx.baseDmg);
  ctx.battleStatus.burnStacks = [];
  ctx.battleStatus.burnStackCount = 0;
  ctx.battleStatus.fireStormStacks = [];
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' ignites Ragnarok (×' + burnStacks + ' burn, ×'
    + stormStacks + ' storm) for ' + total + ' damage!'
  );
});

/* ══════════════════════════════════════════════════════════
   ICE TOWER
══════════════════════════════════════════════════════════ */

registerHandler('freeze', async (ctx) => {
  const chance = lvlChance(0.30, 0.03, 0.57, ctx.spellLvl);
  const success = Math.random() < chance;
  if (success) ctx.battleStatus.enemyFrozen = true;
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Freeze for ' + ctx.baseDmg + ' dmg. '
    + (success ? 'Enemy FROZEN — skips next action!' : 'Freeze failed (Chill applied).')
  );
});

registerHandler('energy_refill', async (ctx) => {
  const refill = lvlFlat(16, 3, ctx.spellLvl);
  ctx.player.sp = Math.min(ctx.player.spMax, ctx.player.sp + refill);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Energy Refill. Restores ' + refill + ' SP.'
    ), 'player'
  );
});

registerHandler('frost_ward', async (ctx) => {
  const ward = lvlFlat(8, 4, ctx.spellLvl);
  ctx.player.hp = Math.min(ctx.player.hpMax, ctx.player.hp + ward);
  ctx.updateHud();
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' casts Frost Ward. Absorbs ' + ward + ' HP.'
    ), 'player'
  );
});

registerHandler('mana_combo', async (ctx) => {
  if (!ctx.battleStatus.manaCombo) ctx.battleStatus.manaCombo = 0;
  if (ctx.battleStatus.manaCombo < 5) ctx.battleStatus.manaCombo++;
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Mana Combo for ' + ctx.baseDmg
    + ' dmg. Combo: ' + ctx.battleStatus.manaCombo + '/5.'
  );
});

registerHandler('mana_burst', async (ctx) => {
  const stacks = ctx.battleStatus.manaCombo || 0;
  const total = ctx.baseDmg + Math.floor(stacks * 0.20 * ctx.baseDmg);
  ctx.battleStatus.manaCombo = 0;
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' releases Mana Burst (×' + stacks + ' combo) for ' + total + ' damage!'
  );
});

registerHandler('absolute_zero', async (ctx) => {
  const freezeChance = lvlChance(0.90, 0.01, 0.95, ctx.spellLvl);
  const frozen = Math.random() < freezeChance;
  if (frozen) ctx.battleStatus.enemyFrozen = true;
  await dealDamage(ctx, ctx.baseDmg,
    ctxGoldenName(ctx) + ' casts Absolute Zero for ' + ctx.baseDmg + ' dmg. '
    + (frozen ? 'FROZEN (' + Math.round(freezeChance * 100) + '% chance)!' : 'Freeze failed.')
  );
});

registerHandler('golem_command', async (ctx) => {
  const golemPower = Math.floor(ctx.baseDmg * 0.50);
  ctx.battleStatus.golemStacks = [{ turnsLeft: 3, power: golemPower }];
  await ctx.log(
    ctx.spellIconHTML + wrapLogText(
      ctxGoldenName(ctx) + ' commands a Golem. ' + golemPower + ' dmg/turn for 3 turns.'
    ), 'player'
  );
});

registerHandler('golem_master', async (ctx) => {
  const existing = ctx.battleStatus.golemStacks && ctx.battleStatus.golemStacks.length > 0;
  if (existing) {
    ctx.battleStatus.golemStacks.forEach(g => {
      g.power = Math.floor(g.power * 1.60);
      g.turnsLeft = Math.min(g.turnsLeft + 2, 6);
    });
    await ctx.log(
      ctx.spellIconHTML + wrapLogText(
        ctxGoldenName(ctx) + ' upgrades the Golem. Power ×1.6, +2 turns.'
      ), 'player'
    );
  } else {
    const warPower = Math.floor(ctx.baseDmg * 0.70);
    ctx.battleStatus.golemStacks = [{ turnsLeft: 4, power: warPower }];
    await ctx.log(
      ctx.spellIconHTML + wrapLogText(
        ctxGoldenName(ctx) + ' summons a War Golem. ' + warPower + ' dmg/turn for 4 turns.'
      ), 'player'
    );
  }
});

registerHandler('glacial_singularity', async (ctx) => {
  const combo   = ctx.battleStatus.manaCombo || 0;
  const frozen  = ctx.battleStatus.enemyFrozen ? 1 : 0;
  const spPct   = ctx.player.sp / ctx.player.spMax;
  const total   = ctx.baseDmg
    + Math.floor(combo  * 0.20 * ctx.baseDmg)
    + Math.floor(frozen * 0.30 * ctx.baseDmg)
    + Math.floor(spPct  * 0.40 * ctx.baseDmg);
  ctx.battleStatus.manaCombo    = 0;
  ctx.battleStatus.enemyFrozen  = false;
  await dealDamage(ctx, total,
    ctxGoldenName(ctx) + ' collapses Glacial Singularity (×' + combo + ' combo) for ' + total + ' damage!'
  );
});

/* ── Expose ──────────────────────────────────────────────── */
window.getSpellHandler = getSpellHandler;