# SOULRIFT — Dev Prompt: Patch spell effect descriptions in spells.js

## Task
Update ONLY the `effect` field (and `condition` where blank) for all 40 spells in `spells.js`.
Do NOT change any other field. Do NOT restructure the file. Do NOT touch any other file.

Use str_replace for each spell — find the old `effect:` line and replace with the new one below.

---

## LIGHT TOWER — patch these effect + condition fields

```js
// light_shot
effect: 'Deal holy damage (basePower + INT scaling). Always hits. No conditions required.',
condition: 'None.',

// light_charge
effect: 'Deal no damage. Add 1 Charge stack (max 5). Each stack boosts the next Charge Release spell by ~20% bonus damage. Stacks persist until consumed or battle ends.',
condition: 'None.',

// holy_guard
effect: 'Increase DEF by 40% for 2 turns. Reduces all incoming physical and magical damage while active.',
condition: 'Best used on Turn 1 — monsters attack first in PvE.',

// shield_of_absorption
effect: 'Create a shield (HP = basePower + INT scaling). Damage hits shield first. 30% of absorbed damage is returned as HP recovery. Lasts until broken or 3 turns.',
condition: 'Best placed before a heavy enemy attack turn.',

// charge_release_light_shot
effect: 'Deal holy damage = basePower + (Charge stacks × 20% bonus) + INT scaling. Consumes ALL Charge stacks. Works at base power with 0 stacks.',
condition: 'Requires Light Charge stacks for bonus damage.',

// energy_blast
effect: 'Deal holy damage (basePower + INT scaling). Completely bypasses all enemy evasion and dodge buffs. Guaranteed to hit even through Fog.',
condition: 'None — always reliable regardless of enemy evasion.',

// angel_wing
effect: 'Grant an 80% chance to dodge the next direct enemy attack entirely. Buff lasts 1 turn or until 1 hit. Does NOT prevent DoT damage (Burn, Curse).',
condition: 'Best placed the turn before an expected heavy attack.',

// divine_reflection
effect: 'Place a reflection mirror. When enemy deals direct HP damage, reflect 60% of actual HP damage received back as holy damage. Expires after 1 enemy action or 1 turn.',
condition: 'Must be cast BEFORE the enemy attack. Does not reflect Burn, DoT, or passive effects.',

// chorus_of_sanctuary
effect: 'Restore HP equal to basePower + INT scaling over 3 turns (~1/3 per turn). Immediately removes ALL active negative statuses (Burn, Curse, Freeze, Fog).',
condition: 'Best used after sustained damage or when Cursed or Burning.',

// heavenfall_chronicle
effect: 'Deal holy damage = basePower + INT scaling + (Charge stacks × 25%) + (active buff count × 15%). Consumes all Charge stacks. With full setup (5 Charge + 2 buffs), reaches ~4–5× base power.',
condition: 'Requires Turn 8–10 setup: Holy Guard + Shield + 3× Light Charge minimum.',
```

---

## DARK TOWER — patch these effect + condition fields

```js
// dark_shot
effect: 'Deal dark damage (basePower + ATK scaling). Deals 20% bonus damage if enemy is Cursed. Always hits.',
condition: 'None. Each cast increases the Dark Combo counter.',

// curse_fang
effect: 'Deal minor dark damage (basePower). Apply Curse for 3 turns — all dark damage enemy receives is increased by 20%. Curse can be refreshed by casting again.',
condition: 'None. Always cast this first — every dark spell afterward benefits.',

// fog
effect: 'Apply Fog for 2 turns. Enemy direct attacks have a 35% chance to miss entirely. Bosses have 50% resistance, reducing miss chance to ~18%. Does not affect DoT.',
condition: 'None. Best Turn 1 to protect a fragile Dark mage from early damage.',

// soul_drain
effect: 'Deal dark damage (basePower + ATK scaling). Heal for 40% of actual damage dealt. If enemy is Cursed, heal increases to 55%.',
condition: 'None. Use whenever HP drops below 50%.',

// siege
effect: 'Deal dark damage (basePower + ATK scaling). Reduce enemy DEF by 30% permanently for this battle. Cannot stack. Cannot reduce DEF below 0.',
condition: 'Best used Turn 2–3 before burst turns.',

// dark_combo
effect: 'Deal dark damage. Each consecutive dark spell cast this battle adds 1 to the Dark Combo counter (max 5). At combo 3+: +40% crit rate. At combo 5: critical hits deal ×2.5 damage.',
condition: 'Requires at least 2 other dark spells cast earlier in the sequence.',

// night_raid
effect: 'Deal dark damage (basePower + ATK scaling). Between 18:00–06:00 local time, damage increases by 50%. Always hits.',
condition: 'Best used during night hours. Uses local device time in MVP.',

// dark_rift
effect: 'Deal dark damage (basePower + ATK scaling). Completely ignores enemy DEF stat — final damage is not reduced by any defense. Does NOT bypass immunity or scripted boss shields.',
condition: 'Most effective against heavily armored enemies.',

// demon_summoning
effect: 'Summon a demon familiar that deals dark damage (basePower × 0.6) at end of each turn for 3 turns. Acts independently while you cast other spells. Demon damage +20% if enemy is Cursed. Only 1 demon active at a time.',
condition: 'Best used Turn 3–5 to maximize turns of demon action.',

// oblivion_gospel
effect: 'Deal dark damage = basePower + ATK scaling × (1 + Curse bonus + Siege bonus + Combo multiplier + night bonus). If enemy HP is below 20%, also deal an execute hit for 50% of remaining HP as true damage.',
condition: 'Requires full setup: Curse Fang + Siege + 3+ Dark Combo + night timing for maximum output.',
```

---

## FIRE TOWER — patch these effect + condition fields

```js
// fire_shot
effect: 'Deal fire damage (basePower + STR scaling). Always hits. Deals 15% bonus damage if enemy is already Burning.',
condition: 'None.',

// burn
effect: 'Deal minor fire damage (basePower). Apply 1 Burn stack (max 5). Each stack deals basePower × 0.35 damage at the start of every turn. Each stack lasts 3 turns independently.',
condition: 'None. Stack 3–4 times before using Explosion Burn.',

// fire_thief
effect: 'Deal fire damage (basePower + STR scaling). Steal 8–15 Gold from enemy on hit. If enemy is Burning, steal doubles to 16–30 Gold. Must hit to steal.',
condition: 'Apply Burn first to double Gold steal per cast.',

// ember_skin
effect: 'Reduce all incoming damage by 25% for 2 turns. Applies before shields. Does not block DoT (Burn ticks still apply).',
condition: 'Best used Turn 1 to survive the monster-first opening.',

// explosion_burn
effect: 'Deal fire damage = basePower + (Burn stacks × basePower × 0.5) + STR scaling. Consumes ALL Burn stacks. At 5 stacks: roughly 3.5× base damage. Guaranteed hit.',
condition: 'Requires at least 1 Burn stack. Best with 3–5 stacks.',

// melt_armor
effect: 'Deal fire damage (basePower + STR scaling). Reduce enemy DEF by 25% permanently for this battle. Reduction applies mainly to physical and Wyvern damage. Cannot stack.',
condition: 'Best used before physical-heavy turns or Wyvern Kamikaze.',

// fire_storm
effect: 'Deal fire damage (basePower + STR scaling) spread over 2 turns. Each turn: 40% chance to disrupt enemy charge-type spells, cancelling their effect. Does not apply Burn stacks.',
condition: 'Best against Light Tower enemies who rely on Charge Release.',

// phoenix_blood
effect: 'Deal fire damage = basePower + STR scaling × (1 + missing HP%). At 50% HP: +50% damage. At 20% HP: +80% damage (~2.8× base). Guaranteed hit.',
condition: 'Most effective when below 40% HP.',

// wyvern_kamikaze
effect: 'Deal physical fire damage (basePower + STR scaling). Ignores 20% of enemy DEF. After use, Wyvern enters 2-turn cooldown. Melt Armor defense reduction applies fully.',
condition: 'Requires Wyvern companion. Locked behind progression in MVP — visible in Library only.',

// ragnarok_ignition
effect: 'Deal fire damage = basePower + STR scaling × (1 + Burn stack bonus × 0.3 + Fire Storm bonus × 0.2). Consumes all Burn stacks on cast. High SP cost is the intended trade-off for Fire\'s low SP pool.',
condition: 'Requires Burn setup and Fire Storm active for full multiplier.',
```

---

## ICE TOWER — patch these effect + condition fields

```js
// ice_shot
effect: 'Deal ice damage (basePower + INT scaling). Always hits. 20% chance to apply Chill (-10% ATK for 1 turn). Does NOT guarantee Freeze.',
condition: 'None. Builds Mana Combo counter.',

// freeze
effect: '70% chance to Freeze the enemy — they lose their next spell action entirely. On failure (30%), only Chill is applied (-10% ATK for 1 turn). Bosses have 60% Freeze resistance (actual chance ~28% vs bosses).',
condition: 'Best before a turn where you need to act without taking damage.',

// energy_refill
effect: 'Recover 18–22 SP (scales with stone level). Costs 0 SP — the only spell in the game that can never fail due to SP. Uses your action this turn. No damage.',
condition: 'Use when SP drops below 15 to keep your sequence running.',

// frost_ward
effect: 'Create an ice shield (HP = INT × 1.5). Damage hits shield first. Each time the shield absorbs a hit: 50% chance the attacker is Chilled (-10% ATK for 1 turn). Shield lasts until depleted.',
condition: 'Best on Turn 1 — Ice Tower has the lowest HP of all towers.',

// mana_combo
effect: 'Deal ice damage (basePower + INT scaling). Add 1 Mana Combo stack (max 5). Each stack increases Mana Burst damage by 20%. Stacks persist until Mana Burst consumes them.',
condition: 'Best used 2–3 turns before Mana Burst.',

// mana_burst
effect: 'Deal ice damage = basePower + (Mana Combo stacks × 20%) + INT scaling. Consumes ALL Mana Combo stacks on cast. At 5 stacks: roughly 2× base damage. Guaranteed hit.',
condition: 'Best after 3+ Mana Combo stacks.',

// golem_command
effect: 'Summon an ice golem that deals ice damage (basePower × 0.5) at end of each turn for 3 turns. Acts independently. Only 1 golem active at a time.',
condition: 'Best in longer fights where sustained pressure matters over burst.',

// absolute_zero
effect: 'Deal heavy ice damage (basePower + INT scaling). Apply Freeze at 90% success rate vs normal enemies, 50% vs bosses. If enemy is already Frozen, extend Freeze duration by 1 additional turn instead.',
condition: 'Best against enemies not yet Frozen, or to extend an active Freeze.',

// golem_master
effect: 'If a Golem Command golem is active: upgrade it (+60% damage, +2 turns). If no golem active: summon a war golem that deals basePower × 0.7 per turn for 4 turns.',
condition: 'Use after Golem Command for upgrade path, or standalone as Turn 5+ opening.',

// glacial_singularity
effect: 'Deal ice damage = basePower + INT scaling × (1 + Mana Combo bonus × 0.2 + Freeze active × 0.3 + remaining SP/maxSP × 0.4). 50% chance to disrupt enemy\'s next action. With full setup, reaches ~3–4× base power.',
condition: 'Requires Freeze active + 3+ Mana Combo stacks + above 50% SP for maximum output.',
```

---

## Instructions
- Use str_replace to patch each spell's `effect:` and `condition:` lines individually
- Match the existing string exactly before replacing
- Do not change id, name, tower, rarity, spCost, basePower, price, obtain, desc, combo, battleLog, or rules
- Do not restructure the file or add/remove spells
- Do not touch any other file
