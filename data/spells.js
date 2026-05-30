/* /data/spells.js */
'use strict';

/* ============================================================
   SOULRIFT — /data/spells.js
   Complete 40-spell catalog across Light, Dark, Fire, Ice towers.
   ============================================================ */

const SPELLS_DATA = [

  /* ── LIGHT TOWER ─────────────────────────────────────────── */
  { // Light Shot
    id: 'light_shot',
    name: 'Light Shot',
    tower: 'light',
    element: 'Light',
    rarity: 'common',
    role: 'Basic Holy Damage',
    spCost: 7,
    basePower: 24,
    price: 120,
    obtain: 'shop',
    desc: 'Deal basic holy damage to one enemy.',
    scaling: '',
    condition: 'None.',
    effect: 'Deal holy damage (basePower + INT scaling). Always hits. No conditions required.',
    combo: 'Can become the release target for Light Charge effects.',
    battleLog: {
      cast: 'The mage gathers a clean shard of holy light.',
      trigger: 'Light Shot strikes the enemy with sacred force.',
      expire: ''
    },
    rules: []
  },
  { // Light Charge
    id: 'light_charge',
    name: 'Light Charge',
    tower: 'light',
    element: 'Light',
    rarity: 'common',
    role: 'Charge Setup',
    spCost: 6,
    basePower: 0,
    price: 120,
    obtain: 'shop',
    desc: 'Store holy energy to power up the next compatible Light release.',
    scaling: '',
    condition: 'None.',
    effect: 'Deal no damage. Add 1 Charge stack (max 5). Each stack boosts the next Charge Release spell by ~20% bonus damage. Stacks persist until consumed or battle ends.',
    combo: 'Use multiple times before Charge Release or Heavenfall Chronicle.',
    battleLog: {
      cast: 'Radiant power gathers silently within the spell circle.',
      trigger: 'Light Charge stores holy energy for a later release.',
      expire: ''
    },
    rules: []
  },
  { // Holy Guard
    id: 'holy_guard',
    name: 'Holy Guard',
    tower: 'light',
    element: 'Light',
    rarity: 'common',
    role: 'Defense Buff',
    spCost: 10,
    basePower: 0,
    price: 150,
    obtain: 'shop',
    desc: 'Raise physical and magical defense for 2 turns.',
    scaling: '',
    condition: 'Best used on Turn 1 — monsters attack first in PvE.',
    effect: 'Increase DEF by 40% for 2 turns. Reduces all incoming physical and magical damage while active.',
    combo: 'Pairs with monster-first PvE rules.',
    battleLog: {
      cast: 'Holy particles form a guardian mantle around the mage.',
      trigger: 'Holy Guard reduces incoming damage.',
      expire: 'The holy guard fades.'
    },
    rules: []
  },
  { // Shield of Absorption
    id: 'shield_of_absorption',
    name: 'Shield of Absorption',
    tower: 'light',
    element: 'Light',
    rarity: 'common',
    role: 'Shield / Conversion',
    spCost: 12,
    basePower: 34,
    price: 180,
    obtain: 'shop',
    desc: 'Create a shield that absorbs damage and converts it into HP or SP recovery.',
    scaling: '',
    condition: 'Best placed before a heavy enemy attack turn.',
    effect: 'Create a shield (HP = basePower + INT scaling). Damage hits shield first. 30% of absorbed damage is returned as HP recovery. Lasts until broken or 3 turns.',
    combo: 'Strong before charge turns or against monster-first openers.',
    battleLog: {
      cast: 'A luminous barrier opens like a sacred lens.',
      trigger: 'Shield of Absorption drinks in the impact and returns power to the mage.',
      expire: 'The absorbing shield dissolves.'
    },
    rules: []
  },
  { // Charge Release - Light Shot
    id: 'charge_release_light_shot',
    name: 'Charge Release - Light Shot',
    tower: 'light',
    element: 'Light',
    rarity: 'uncommon',
    role: 'Charge Finisher',
    spCost: 16,
    basePower: 48,
    price: 0,
    obtain: 'drop',
    desc: 'Consume Light Charge stacks for heavy holy damage.',
    scaling: '',
    condition: 'Requires Light Charge stacks for bonus damage.',
    effect: 'Deal holy damage = basePower + (Charge stacks × 20% bonus) + INT scaling. Consumes ALL Charge stacks. Works at base power with 0 stacks.',
    combo: 'The more turns spent charging, the stronger the release.',
    battleLog: {
      cast: 'Stored radiance focuses into a single impossible point.',
      trigger: 'Charge Release - Light Shot consumes holy charge and erupts forward.',
      expire: ''
    },
    rules: ['Consumes all Light Charge stacks.']
  },
  { // Energy Blast
    id: 'energy_blast',
    name: 'Energy Blast',
    tower: 'light',
    element: 'Light',
    rarity: 'uncommon',
    role: 'Accuracy Pierce',
    spCost: 15,
    basePower: 50,
    price: 0,
    obtain: 'drop',
    desc: 'Concentrated holy energy blast that ignores enemy evasion.',
    scaling: '',
    condition: 'None — always reliable regardless of enemy evasion.',
    effect: 'Deal holy damage (basePower + INT scaling). Completely bypasses all enemy evasion and dodge buffs. Guaranteed to hit even through Fog.',
    combo: 'Reliable finisher when defensive play must still connect.',
    battleLog: {
      cast: 'The mage compresses holy energy into a piercing blast.',
      trigger: 'Energy Blast cuts through evasive movement.',
      expire: ''
    },
    rules: []
  },
  { // Angel Wing
    id: 'angel_wing',
    name: 'Angel Wing',
    tower: 'light',
    element: 'Light',
    rarity: 'uncommon',
    role: 'Evasion / Tempo',
    spCost: 14,
    basePower: 0,
    price: 0,
    obtain: 'drop',
    desc: 'Gain wings that completely dodge the next direct attack.',
    scaling: '',
    condition: 'Best placed the turn before an expected heavy attack.',
    effect: 'Grant an 80% chance to dodge the next direct enemy attack entirely. Buff lasts 1 turn or until 1 hit. Does NOT prevent DoT damage (Burn, Curse).',
    combo: 'Creates a safe turn to charge or heal afterward.',
    battleLog: {
      cast: 'Wings of pale light unfold behind the mage.',
      trigger: 'Angel Wing turns the enemy strike into empty air.',
      expire: 'The angelic wings scatter into feathers of light.'
    },
    rules: []
  },
  { // Divine Reflection
    id: 'divine_reflection',
    name: 'Divine Reflection',
    tower: 'light',
    element: 'Light',
    rarity: 'rare',
    role: 'Counter / Reflection',
    spCost: 24,
    basePower: 0,
    price: 0,
    obtain: 'drop',
    desc: 'Reflect a percentage of HP damage received back to the enemy.',
    scaling: '',
    condition: 'Must be cast BEFORE the enemy attack. Does not reflect Burn, DoT, or passive effects.',
    effect: 'Place a reflection mirror. When enemy deals direct HP damage, reflect 60% of actual HP damage received back as holy damage. Expires after 1 enemy action or 1 turn.',
    combo: 'Works after Shield of Absorption for survival.',
    battleLog: {
      cast: 'The mage raises a divine mirror of radiant judgment.',
      trigger: 'Divine Reflection mirrors the enemy attack back as holy damage.',
      expire: 'The divine mirror fades without reflecting an attack.'
    },
    rules: [
      'Reflects only direct damage.',
      'Does not reflect Burn, DoT, or passive damage.',
      'Expires after one enemy action.'
    ]
  },
  { // Chorus of Sanctuary
    id: 'chorus_of_sanctuary',
    name: 'Chorus of Sanctuary',
    tower: 'light',
    element: 'Light',
    rarity: 'rare',
    role: 'Regeneration / Cleanse',
    spCost: 26,
    basePower: 32,
    price: 0,
    obtain: 'drop',
    desc: 'Restore HP and cleanse negative statuses over several turns.',
    scaling: '',
    condition: 'Best used after sustained damage or when Cursed or Burning.',
    effect: 'Restore HP equal to basePower + INT scaling over 3 turns (~1/3 per turn). Immediately removes ALL active negative statuses (Burn, Curse, Freeze, Fog).',
    combo: 'Allows Light to survive long enough to build Charge Release lines.',
    battleLog: {
      cast: 'A sacred chorus rolls across the battlefield.',
      trigger: 'Chorus of Sanctuary restores HP and purges corruption.',
      expire: 'The sanctuary hymn falls silent.'
    },
    rules: []
  },
  { // Heavenfall Chronicle
    id: 'heavenfall_chronicle',
    name: 'Heavenfall Chronicle',
    tower: 'light',
    element: 'Light',
    rarity: 'ultimate',
    role: 'Ultimate Charge Finisher',
    spCost: 40,
    basePower: 145,
    price: 0,
    obtain: 'boss',
    desc: 'Massive holy damage scaling with active buffs, shields, and stored charge.',
    scaling: '',
    condition: 'Requires Turn 8–10 setup: Holy Guard + Shield + 3× Light Charge minimum.',
    effect: 'Deal holy damage = basePower + INT scaling + (Charge stacks × 25%) + (active buff count × 15%). Consumes all Charge stacks. With full setup (5 Charge + 2 buffs), reaches ~4–5× base power.',
    combo: 'Best after Holy Guard, Shield of Absorption, Light Charge, and Charge Release setup.',
    battleLog: {
      cast: 'The heavens open, and a chronicle of light descends upon the enemy.',
      trigger: 'Heavenfall Chronicle converts sacred preparation into judgment.',
      expire: ''
    },
    rules: []
  },

  /* ── DARK TOWER ──────────────────────────────────────────── */
  { // Dark Shot
    id: 'dark_shot',
    name: 'Dark Shot',
    tower: 'dark',
    element: 'Dark',
    rarity: 'common',
    role: 'Basic Dark Damage',
    spCost: 9,
    basePower: 36,
    price: 150,
    obtain: 'shop',
    desc: 'Deal basic dark damage to one enemy.',
    scaling: '',
    condition: 'None. Each cast increases the Dark Combo counter.',
    effect: 'Deal dark damage (basePower + ATK scaling). Deals 20% bonus damage if enemy is Cursed. Always hits.',
    combo: 'Feeds Dark Combo and curse-based finishers.',
    battleLog: {
      cast: 'A shard of darkness pierces the enemy.',
      trigger: 'Dark Shot wounds the target with abyssal force.',
      expire: ''
    },
    rules: []
  },
  { // Curse Fang
    id: 'curse_fang',
    name: 'Curse Fang',
    tower: 'dark',
    element: 'Dark',
    rarity: 'common',
    role: 'Curse Setup',
    spCost: 10,
    basePower: 16,
    price: 150,
    obtain: 'shop',
    desc: 'Apply Curse — cursed enemies take increased dark damage.',
    scaling: '',
    condition: 'None. Always cast this first — every dark spell afterward benefits.',
    effect: 'Deal minor dark damage (basePower). Apply Curse for 3 turns — all dark damage enemy receives is increased by 20%. Curse can be refreshed by casting again.',
    combo: 'Improves Dark Combo, Abyssal Crit, Dark Rift, and execute spells.',
    battleLog: {
      cast: 'A cursed fang bites into the enemy\'s soul.',
      trigger: 'Curse Fang weakens the enemy against dark magic.',
      expire: 'The curse fades from the enemy.'
    },
    rules: []
  },
  { // Fog
    id: 'fog',
    name: 'Fog',
    tower: 'dark',
    element: 'Dark',
    rarity: 'common',
    role: 'Disruption / Blind',
    spCost: 11,
    basePower: 0,
    price: 150,
    obtain: 'shop',
    desc: 'Cover the battlefield in fog, increasing enemy miss and fail chance.',
    scaling: '',
    condition: 'None. Best Turn 1 to protect a fragile Dark mage from early damage.',
    effect: 'Apply Fog for 2 turns. Enemy direct attacks have a 35% chance to miss entirely. Bosses have 50% resistance, reducing miss chance to ~18%. Does not affect DoT.',
    combo: 'Buys fragile Dark players time to set up curse and burst.',
    battleLog: {
      cast: 'A black fog crawls across the battlefield.',
      trigger: 'Fog disrupts the enemy\'s aim and casting.',
      expire: 'The dark fog thins.'
    },
    rules: []
  },
  { // Soul Drain
    id: 'soul_drain',
    name: 'Soul Drain',
    tower: 'dark',
    element: 'Dark',
    rarity: 'common',
    role: 'Vampiric Healing',
    spCost: 12,
    basePower: 26,
    price: 180,
    obtain: 'shop',
    desc: 'Deal dark damage and heal for part of the damage dealt.',
    scaling: '',
    condition: 'None. Use whenever HP drops below 50%.',
    effect: 'Deal dark damage (basePower + ATK scaling). Heal for 40% of actual damage dealt. If enemy is Cursed, heal increases to 55%.',
    combo: 'Healing increases if the enemy is cursed.',
    battleLog: {
      cast: 'The mage tears life from the enemy and drinks it as power.',
      trigger: 'Soul Drain restores HP from the enemy\'s soul.',
      expire: ''
    },
    rules: []
  },
  { // Siege
    id: 'siege',
    name: 'Siege',
    tower: 'dark',
    element: 'Dark',
    rarity: 'uncommon',
    role: 'Armor Break',
    spCost: 15,
    basePower: 34,
    price: 0,
    obtain: 'drop',
    desc: 'Crush enemy armor and reduce defense for the battle.',
    scaling: '',
    condition: 'Best used Turn 2–3 before burst turns.',
    effect: 'Deal dark damage (basePower + ATK scaling). Reduce enemy DEF by 30% permanently for this battle. Cannot stack. Cannot reduce DEF below 0.',
    combo: 'Sets up Dark Combo, Abyssal Crit, and Night Raid.',
    battleLog: {
      cast: 'A dark siege force hammers the enemy\'s defenses.',
      trigger: 'Siege cracks armor and weakens protection.',
      expire: ''
    },
    rules: []
  },
  { // Dark Combo
    id: 'dark_combo',
    name: 'Dark Combo',
    tower: 'dark',
    element: 'Dark',
    rarity: 'uncommon',
    role: 'Combo Amplifier / Crit Scaling',
    spCost: 15,
    basePower: 46,
    price: 0,
    obtain: 'drop',
    desc: 'Deal dark damage that scales with consecutive Dark spell chains.',
    scaling: '',
    condition: 'Requires at least 2 other dark spells cast earlier in the sequence.',
    effect: 'Deal dark damage. Each consecutive dark spell cast this battle adds 1 to the Dark Combo counter (max 5). At combo 3+: +40% crit rate. At combo 5: critical hits deal ×2.5 damage.',
    combo: 'Main Dark Tower identity spell.',
    battleLog: {
      cast: 'The darkness compounds, each strike feeding the next.',
      trigger: 'Dark Combo increases the dark chain multiplier.',
      expire: ''
    },
    rules: []
  },
  { // Night Raid
    id: 'night_raid',
    name: 'Night Raid',
    tower: 'dark',
    element: 'Dark',
    rarity: 'uncommon',
    role: 'Time-Window Burst',
    spCost: 18,
    basePower: 54,
    price: 0,
    obtain: 'drop',
    desc: 'Fast dark damage greatly amplified during night hours (18:00–06:00).',
    scaling: '',
    condition: 'Best used during night hours. Uses local device time in MVP.',
    effect: 'Deal dark damage (basePower + ATK scaling). Between 18:00–06:00 local time, damage increases by 50%. Always hits.',
    combo: 'Pairs with Curse Fang, Siege, and Dark Combo.',
    battleLog: {
      cast: 'The mage vanishes into the hour of night.',
      trigger: 'Night Raid strikes with amplified midnight force.',
      expire: ''
    },
    rules: ['In local-only MVP, simulate server time using player\'s local time.']
  },
  { // Dark Rift
    id: 'dark_rift',
    name: 'Dark Rift',
    tower: 'dark',
    element: 'Dark',
    rarity: 'rare',
    role: 'True Damage',
    spCost: 26,
    basePower: 78,
    price: 0,
    obtain: 'drop',
    desc: 'Open a dimensional rift for true damage that bypasses defense.',
    scaling: '',
    condition: 'Most effective against heavily armored enemies.',
    effect: 'Deal dark damage (basePower + ATK scaling). Completely ignores enemy DEF stat — final damage is not reduced by any defense. Does NOT bypass immunity or scripted boss shields.',
    combo: 'Very strong after Curse Fang.',
    battleLog: {
      cast: 'A rift opens where the enemy\'s shadow should be.',
      trigger: 'Dark Rift bypasses defense and wounds reality itself.',
      expire: ''
    },
    rules: ['True damage bypasses defense but not immunity.']
  },
  { // Demon Summoning
    id: 'demon_summoning',
    name: 'Demon Summoning',
    tower: 'dark',
    element: 'Dark',
    rarity: 'rare',
    role: 'Summon / Pressure',
    spCost: 28,
    basePower: 38,
    price: 0,
    obtain: 'drop',
    desc: 'Summon a demon familiar to pressure the enemy for several turns.',
    scaling: '',
    condition: 'Best used Turn 3–5 to maximize turns of demon action.',
    effect: 'Summon a demon familiar that deals dark damage (basePower × 0.6) at end of each turn for 3 turns. Acts independently while you cast other spells. Demon damage +20% if enemy is Cursed. Only 1 demon active at a time.',
    combo: 'Excellent against defensive Light builds and while Fog is active.',
    battleLog: {
      cast: 'A demon claw breaks through the summoning circle.',
      trigger: 'The summoned demon rends the enemy.',
      expire: 'The demon is pulled back into the abyss.'
    },
    rules: ['Summon attacks shown in text logs only.']
  },
  { // Oblivion Gospel
    id: 'oblivion_gospel',
    name: 'Oblivion Gospel',
    tower: 'dark',
    element: 'Dark',
    rarity: 'ultimate',
    role: 'Ultimate Curse / Combo Finisher',
    spCost: 42,
    basePower: 165,
    price: 0,
    obtain: 'boss',
    desc: 'Catastrophic dark damage — may execute a weakened cursed enemy.',
    scaling: '',
    condition: 'Requires full setup: Curse Fang + Siege + 3+ Dark Combo + night timing for maximum output.',
    effect: 'Deal dark damage = basePower + ATK scaling × (1 + Curse bonus + Siege bonus + Combo multiplier + night bonus). If enemy HP is below 20%, also deal an execute hit for 50% of remaining HP as true damage.',
    combo: 'Best after Curse Fang, Siege, Fog, Dark Combo, and Night Raid timing.',
    battleLog: {
      cast: 'The gospel of oblivion is recited, and the enemy\'s existence begins to collapse.',
      trigger: 'Oblivion Gospel consumes accumulated dark power for catastrophic damage.',
      expire: ''
    },
    rules: []
  },

  /* ── FIRE TOWER ──────────────────────────────────────────── */
  { // Fire Shot
    id: 'fire_shot',
    name: 'Fire Shot',
    tower: 'fire',
    element: 'Fire',
    rarity: 'common',
    role: 'Basic Fire Damage',
    spCost: 8,
    basePower: 30,
    price: 120,
    obtain: 'shop',
    desc: 'Deal basic fire damage to one enemy.',
    scaling: '',
    condition: 'None.',
    effect: 'Deal fire damage (basePower + STR scaling). Always hits. Deals 15% bonus damage if enemy is already Burning.',
    combo: 'Feeds Burn and Fire combo plans.',
    battleLog: {
      cast: 'The mage launches a burning projectile into the enemy.',
      trigger: 'Fire Shot scorches the target.',
      expire: ''
    },
    rules: []
  },
  { // Burn
    id: 'burn',
    name: 'Burn',
    tower: 'fire',
    element: 'Fire',
    rarity: 'common',
    role: 'Stacking Damage Over Time',
    spCost: 10,
    basePower: 12,
    price: 150,
    obtain: 'shop',
    desc: 'Apply stacking Burn that deals fire damage each turn.',
    scaling: '',
    condition: 'None. Stack 3–4 times before using Explosion Burn.',
    effect: 'Deal minor fire damage (basePower). Apply 1 Burn stack (max 5). Each stack deals basePower × 0.35 damage at the start of every turn. Each stack lasts 3 turns independently.',
    combo: 'Explosion Burn consumes Burn stacks for burst damage.',
    battleLog: {
      cast: 'A harsh flame brands the enemy.',
      trigger: 'Burn sears the enemy at the start of the turn.',
      expire: 'The flames gutter out.'
    },
    rules: ['Burn stacks but has a practical cap for balance.']
  },
  { // Fire Thief
    id: 'fire_thief',
    name: 'Fire Thief',
    tower: 'fire',
    element: 'Fire',
    rarity: 'common',
    role: 'Damage + Credit Steal',
    spCost: 12,
    basePower: 24,
    price: 180,
    obtain: 'shop',
    desc: 'Deal fire damage and steal Gold — steals more if the enemy is Burning.',
    scaling: '',
    condition: 'Apply Burn first to double Gold steal per cast.',
    effect: 'Deal fire damage (basePower + STR scaling). Steal 8–15 Gold from enemy on hit. If enemy is Burning, steal doubles to 16–30 Gold. Must hit to steal.',
    combo: 'Steals extra Gold if the enemy is Burning.',
    battleLog: {
      cast: 'Flames twist into greedy hands and rip Credit from the enemy.',
      trigger: 'Fire Thief burns and steals treasure.',
      expire: ''
    },
    rules: []
  },
  { // Ember Skin
    id: 'ember_skin',
    name: 'Ember Skin',
    tower: 'fire',
    element: 'Fire',
    rarity: 'common',
    role: 'Self Buff / Survival',
    spCost: 9,
    basePower: 0,
    price: 150,
    obtain: 'shop',
    desc: 'Gain ember armor that reduces incoming damage for 2 turns.',
    scaling: '',
    condition: 'Best used Turn 1 to survive the monster-first opening.',
    effect: 'Reduce all incoming damage by 25% for 2 turns. Applies before shields. Does not block DoT (Burn ticks still apply).',
    combo: 'Helps Fire survive while saving SP for Burn detonation.',
    battleLog: {
      cast: 'Embers wrap around the mage like living armor.',
      trigger: 'Ember Skin absorbs part of the incoming damage.',
      expire: 'The ember armor fades into ash.'
    },
    rules: []
  },
  { // Explosion Burn
    id: 'explosion_burn',
    name: 'Explosion Burn',
    tower: 'fire',
    element: 'Fire',
    rarity: 'uncommon',
    role: 'Burn Detonation',
    spCost: 18,
    basePower: 58,
    price: 0,
    obtain: 'drop',
    desc: 'Consume Burn stacks and detonate them into a heavy explosion.',
    scaling: '',
    condition: 'Requires at least 1 Burn stack. Best with 3–5 stacks.',
    effect: 'Deal fire damage = basePower + (Burn stacks × basePower × 0.5) + STR scaling. Consumes ALL Burn stacks. At 5 stacks: roughly 3.5× base damage. Guaranteed hit.',
    combo: 'Core Fire finisher after repeated Burn setup.',
    battleLog: {
      cast: 'The burn marks pulse like buried bombs.',
      trigger: 'Explosion Burn consumes every flame and detonates.',
      expire: ''
    },
    rules: ['Consumes Burn stacks. Damage scales with stack count.']
  },
  { // Melt Armor
    id: 'melt_armor',
    name: 'Melt Armor',
    tower: 'fire',
    element: 'Fire',
    rarity: 'uncommon',
    role: 'Armor Melt / Physical Vulnerability',
    spCost: 14,
    basePower: 22,
    price: 0,
    obtain: 'drop',
    desc: 'Melt enemy armor to increase physical damage taken.',
    scaling: '',
    condition: 'Best used before physical-heavy turns or Wyvern Kamikaze.',
    effect: 'Deal fire damage (basePower + STR scaling). Reduce enemy DEF by 25% permanently for this battle. Reduction applies mainly to physical and Wyvern damage. Cannot stack.',
    combo: 'Sets up Wyvern attacks or Fire\'s late pet synergy.',
    battleLog: {
      cast: 'White-hot flame crawls across the enemy\'s armor.',
      trigger: 'Melt Armor softens the target\'s defenses.',
      expire: 'The molten armor begins to harden again.'
    },
    rules: []
  },
  { // Fire Storm
    id: 'fire_storm',
    name: 'Fire Storm',
    tower: 'fire',
    element: 'Fire',
    rarity: 'uncommon',
    role: 'Area Pressure / Charge Disruption',
    spCost: 20,
    basePower: 46,
    price: 0,
    obtain: 'drop',
    desc: 'Create a violent fire storm that disrupts charge-type spells.',
    scaling: '',
    condition: 'Best against Light Tower enemies who rely on Charge Release.',
    effect: 'Deal fire damage (basePower + STR scaling) spread over 2 turns. Each turn: 40% chance to disrupt enemy charge-type spells, cancelling their effect. Does not apply Burn stacks.',
    combo: 'Counters Light Charge and similar setup turns.',
    battleLog: {
      cast: 'A fire storm tears across the battlefield.',
      trigger: 'Fire Storm burns and disrupts focused casting.',
      expire: 'The storm collapses into sparks.'
    },
    rules: []
  },
  { // Phoenix Blood
    id: 'phoenix_blood',
    name: 'Phoenix Blood',
    tower: 'fire',
    element: 'Fire',
    rarity: 'rare',
    role: 'Low HP Power Spell',
    spCost: 22,
    basePower: 70,
    price: 0,
    obtain: 'drop',
    desc: 'Deal damage based on missing HP — stronger when near death.',
    scaling: '',
    condition: 'Most effective when below 40% HP.',
    effect: 'Deal fire damage = basePower + STR scaling × (1 + missing HP%). At 50% HP: +50% damage. At 20% HP: +80% damage (~2.8× base). Guaranteed hit.',
    combo: 'Turns Fire\'s high HP pool into comeback pressure.',
    battleLog: {
      cast: 'The mage\'s blood ignites into phoenix fire.',
      trigger: 'Phoenix Blood grows stronger from missing HP.',
      expire: ''
    },
    rules: []
  },
  { // Wyvern Kamikaze
    id: 'wyvern_kamikaze',
    name: 'Wyvern Kamikaze',
    tower: 'fire',
    element: 'Fire',
    rarity: 'rare',
    role: 'Dragon / Wyvern Finisher',
    spCost: 30,
    basePower: 100,
    price: 0,
    obtain: 'drop',
    desc: 'Command a Wyvern to dive for massive physical fire damage.',
    scaling: '',
    condition: 'Requires Wyvern companion. Locked behind progression in MVP — visible in Library only.',
    effect: 'Deal physical fire damage (basePower + STR scaling). Ignores 20% of enemy DEF. After use, Wyvern enters 2-turn cooldown. Melt Armor defense reduction applies fully.',
    combo: 'Best after Melt Armor or Burn setup.',
    battleLog: {
      cast: 'The mage gives the final command to the circling Wyvern.',
      trigger: 'Wyvern Kamikaze crashes into the enemy in a storm of fire and scales.',
      expire: 'The Wyvern retreats into recovery.'
    },
    rules: ['Gate this spell behind a placeholder condition until pet systems exist.']
  },
  { // Ragnarok Ignition
    id: 'ragnarok_ignition',
    name: 'Ragnarok Ignition',
    tower: 'fire',
    element: 'Fire',
    rarity: 'ultimate',
    role: 'Ultimate Burn / Dragon Finisher',
    spCost: 40,
    basePower: 160,
    price: 0,
    obtain: 'boss',
    desc: 'Consume fire setup for catastrophic damage scaling with Burn and Fire Storm.',
    scaling: '',
    condition: 'Requires Burn setup and Fire Storm active for full multiplier.',
    effect: 'Deal fire damage = basePower + STR scaling × (1 + Burn stack bonus × 0.3 + Fire Storm bonus × 0.2). Consumes all Burn stacks on cast. High SP cost is the intended trade-off for Fire\'s low SP pool.',
    combo: 'Best as final turn after Burn, Fire Thief farming, and Melt Armor setup.',
    battleLog: {
      cast: 'The battlefield erupts as Ragnarok Ignition consumes everything.',
      trigger: 'Ragnarok Ignition detonates all accumulated fire power.',
      expire: ''
    },
    rules: []
  },

  /* ── ICE TOWER ───────────────────────────────────────────── */
  { // Ice Shot
    id: 'ice_shot',
    name: 'Ice Shot',
    tower: 'ice',
    element: 'Ice',
    rarity: 'common',
    role: 'Basic Ice Damage',
    spCost: 8,
    basePower: 26,
    price: 120,
    obtain: 'shop',
    desc: 'Deal basic ice damage to one enemy.',
    scaling: '',
    condition: 'None. Builds Mana Combo counter.',
    effect: 'Deal ice damage (basePower + INT scaling). Always hits. 20% chance to apply Chill (-10% ATK for 1 turn). Does NOT guarantee Freeze.',
    combo: 'Feeds Freeze and Mana Burst plans.',
    battleLog: {
      cast: 'The mage shapes a shard of glacial magic.',
      trigger: 'Ice Shot cuts into the enemy with cold force.',
      expire: ''
    },
    rules: []
  },
  { // Freeze
    id: 'freeze',
    name: 'Freeze',
    tower: 'ice',
    element: 'Ice',
    rarity: 'common',
    role: 'Turn Denial',
    spCost: 14,
    basePower: 12,
    price: 180,
    obtain: 'shop',
    desc: 'Attempt to freeze the target, denying its next spell action.',
    scaling: '',
    condition: 'Best before a turn where you need to act without taking damage.',
    effect: '70% chance to Freeze the enemy — they lose their next spell action entirely. On failure (30%), only Chill is applied (-10% ATK for 1 turn). Bosses have 60% Freeze resistance (actual chance ~28% vs bosses).',
    combo: 'Creates room for Energy Refill or Mana Burst setup.',
    battleLog: {
      cast: 'A killing frost wraps around the enemy\'s limbs.',
      trigger: 'Freeze locks the target out of its next action.',
      expire: 'The ice prison cracks apart.'
    },
    rules: ['Bosses may resist or reduce Freeze duration.']
  },
  { // Energy Refill
    id: 'energy_refill',
    name: 'Energy Refill',
    tower: 'ice',
    element: 'Ice',
    rarity: 'common',
    role: 'SP Recovery',
    spCost: 0,
    basePower: 0,
    price: 100,
    obtain: 'shop',
    desc: 'Recover SP during battle.',
    scaling: '',
    condition: 'Use when SP drops below 15 to keep your sequence running.',
    effect: 'Recover 18–22 SP (scales with stone level). Costs 0 SP — the only spell in the game that can never fail due to SP. Uses your action this turn. No damage.',
    combo: 'Allows Ice to run expensive control and burst lines.',
    battleLog: {
      cast: 'Cold air condenses into usable spell power.',
      trigger: 'Energy Refill restores SP.',
      expire: ''
    },
    rules: ['This spell should never fail due to SP cost.']
  },
  { // Frost Ward
    id: 'frost_ward',
    name: 'Frost Ward',
    tower: 'ice',
    element: 'Ice',
    rarity: 'common',
    role: 'Fragile Defense',
    spCost: 9,
    basePower: 0,
    price: 150,
    obtain: 'shop',
    desc: 'Small ice shield that may chill enemies that strike it.',
    scaling: '',
    condition: 'Best on Turn 1 — Ice Tower has the lowest HP of all towers.',
    effect: 'Create an ice shield (HP = INT × 1.5). Damage hits shield first. Each time the shield absorbs a hit: 50% chance the attacker is Chilled (-10% ATK for 1 turn). Shield lasts until depleted.',
    combo: 'Helps low-HP Ice survive monster-first turns.',
    battleLog: {
      cast: 'A thin ward of frost forms around the mage.',
      trigger: 'Frost Ward absorbs damage and chills the attacker.',
      expire: 'The frost ward melts away.'
    },
    rules: []
  },
  { // Mana Combo
    id: 'mana_combo',
    name: 'Mana Combo',
    tower: 'ice',
    element: 'Ice',
    rarity: 'uncommon',
    role: 'Mana Burst Setup',
    spCost: 12,
    basePower: 28,
    price: 0,
    obtain: 'drop',
    desc: 'Deal ice damage and increase the Mana Combo counter.',
    scaling: '',
    condition: 'Best used 2–3 turns before Mana Burst.',
    effect: 'Deal ice damage (basePower + INT scaling). Add 1 Mana Combo stack (max 5). Each stack increases Mana Burst damage by 20%. Stacks persist until Mana Burst consumes them.',
    combo: 'Prepares Mana Burst and rewards careful 10-turn planning.',
    battleLog: {
      cast: 'The mage threads cold mana into a precise sequence.',
      trigger: 'Mana Combo increases the stored arcane pattern.',
      expire: ''
    },
    rules: []
  },
  { // Mana Burst
    id: 'mana_burst',
    name: 'Mana Burst',
    tower: 'ice',
    element: 'Ice',
    rarity: 'uncommon',
    role: 'Mana Combo Finisher',
    spCost: 22,
    basePower: 68,
    price: 0,
    obtain: 'drop',
    desc: 'Release stored Mana Combo stacks as a sharp burst of ice damage.',
    scaling: '',
    condition: 'Best after 3+ Mana Combo stacks.',
    effect: 'Deal ice damage = basePower + (Mana Combo stacks × 20%) + INT scaling. Consumes ALL Mana Combo stacks on cast. At 5 stacks: roughly 2× base damage. Guaranteed hit.',
    combo: 'Core Ice burst route.',
    battleLog: {
      cast: 'Stored cold mana flashes beyond control.',
      trigger: 'Mana Burst releases the accumulated combo.',
      expire: ''
    },
    rules: ['Consumes Mana Combo stacks.']
  },
  { // Golem Command
    id: 'golem_command',
    name: 'Golem Command',
    tower: 'ice',
    element: 'Ice',
    rarity: 'uncommon',
    role: 'Golem Summon / Pressure',
    spCost: 18,
    basePower: 36,
    price: 0,
    obtain: 'drop',
    desc: 'Command an arcane ice golem to attack or guard for several turns.',
    scaling: '',
    condition: 'Best in longer fights where sustained pressure matters over burst.',
    effect: 'Summon an ice golem that deals ice damage (basePower × 0.5) at end of each turn for 3 turns. Acts independently. Only 1 golem active at a time.',
    combo: 'Alternative Ice route for players who prefer mechanical summon pressure over mana burst.',
    battleLog: {
      cast: 'A runed golem core wakes beneath the ice.',
      trigger: 'The golem obeys and crushes the enemy.',
      expire: 'The golem\'s core falls silent.'
    },
    rules: ['Represent golem actions in text logs only.']
  },
  { // Absolute Zero
    id: 'absolute_zero',
    name: 'Absolute Zero',
    tower: 'ice',
    element: 'Ice',
    rarity: 'rare',
    role: 'Hard Control / Freeze Amplifier',
    spCost: 28,
    basePower: 70,
    price: 0,
    obtain: 'drop',
    desc: 'Heavy ice damage that greatly improves Freeze reliability or duration.',
    scaling: '',
    condition: 'Best against enemies not yet Frozen, or to extend an active Freeze.',
    effect: 'Deal heavy ice damage (basePower + INT scaling). Apply Freeze at 90% success rate vs normal enemies, 50% vs bosses. If enemy is already Frozen, extend Freeze duration by 1 additional turn instead.',
    combo: 'Turns earlier Freeze or Frost Ward chill into a decisive control window.',
    battleLog: {
      cast: 'All heat vanishes from the battlefield.',
      trigger: 'Absolute Zero deepens the freeze into silence.',
      expire: 'Warmth slowly returns.'
    },
    rules: ['Boss control duration should be reduced for balance.']
  },
  { // Golem Master
    id: 'golem_master',
    name: 'Golem Master',
    tower: 'ice',
    element: 'Ice',
    rarity: 'rare',
    role: 'Advanced Golem Build',
    spCost: 30,
    basePower: 52,
    price: 0,
    obtain: 'drop',
    desc: 'Empower the active golem or summon a stronger war golem.',
    scaling: '',
    condition: 'Use after Golem Command for upgrade path, or standalone as Turn 5+ opening.',
    effect: 'If a Golem Command golem is active: upgrade it (+60% damage, +2 turns). If no golem active: summon a war golem that deals basePower × 0.7 per turn for 4 turns.',
    combo: 'Build-defining alternative to Mana Burst.',
    battleLog: {
      cast: 'The mage speaks the command language of ancient steel.',
      trigger: 'Golem Master awakens a heavier war machine.',
      expire: 'The empowered golem powers down.'
    },
    rules: ['Gate usage behind progression if summon systems are not implemented yet.']
  },
  { // Glacial Singularity
    id: 'glacial_singularity',
    name: 'Glacial Singularity',
    tower: 'ice',
    element: 'Ice',
    rarity: 'ultimate',
    role: 'Ultimate Control / Mana Finisher',
    spCost: 44,
    basePower: 155,
    price: 0,
    obtain: 'boss',
    desc: 'Collapse frozen mana into a singularity for catastrophic ice damage.',
    scaling: '',
    condition: 'Requires Freeze active + 3+ Mana Combo stacks + above 50% SP for maximum output.',
    effect: 'Deal ice damage = basePower + INT scaling × (1 + Mana Combo bonus × 0.2 + Freeze active × 0.3 + remaining SP/maxSP × 0.4). 50% chance to disrupt enemy\'s next action. With full setup, reaches ~3–4× base power.',
    combo: 'Best after Freeze, Energy Refill, Mana Combo, and Mana Burst setup.',
    battleLog: {
      cast: 'A star of frozen mana collapses between the combatants.',
      trigger: 'Glacial Singularity tears heat, motion, and spell power from the enemy.',
      expire: ''
    },
    rules: ['High SP cost is acceptable because Ice has the highest SP identity.']
  }

];

/* ── Utility functions ───────────────────────────────────────── */

function getAllSpells() {
  return SPELLS_DATA;
}

function getSpellDef(id) {
  return SPELLS_DATA.find(s => s.id === id) || null;
}

function getSpellsByTower(tower) {
  return SPELLS_DATA.filter(s => s.tower === tower);
}

function getCommonShopSpells(tower) {
  return SPELLS_DATA.filter(s => s.tower === tower && s.rarity === 'common');
}

function getSpellsByRarity(rarity) {
  return SPELLS_DATA.filter(s => s.rarity === rarity);
}

/* ── Window exports ──────────────────────────────────────────── */

window.SPELLS_DATA            = SPELLS_DATA;
window.getAllSpells            = getAllSpells;
window.getSpellDef            = getSpellDef;
window.getSpellsByTower       = getSpellsByTower;
window.getCommonShopSpells    = getCommonShopSpells;
window.getSpellsByRarity      = getSpellsByRarity;
