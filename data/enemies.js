/* ============================================================
   SOULRIFT — /data/enemies.js
   Phase 1 enemy data for automatic text battles.
   ============================================================ */

'use strict';

const ENEMIES_DATA = [
  // Booby Forest enemies
  { // Training Shadow
    id: 'training_shadow',
    dungeonId: 'booby_forest',
    weight: 5,
    name: 'Training Shadow',
    area: 'Booby Forest',
    hp: 45, atk: 7, def: 2, exp: 20, gold: 35,
    opener: 'A practice shade copies the stance of an old tower apprentice.',
    dropTable: [],
  },
  { // Goblin Frenzy
    id: 'goblin_frenzy',
    dungeonId: 'booby_forest',
    weight: 3,
    name: 'Goblin Frenzy',
    area: 'Booby Forest',
    hp: 42, atk: 9, def: 2, exp: 26, gold: 42,
    opener: 'A quick goblin darts out of the brush, shrieking for the first strike.',
    dropTable: [],
  },
  { // Booby
    id: 'booby',
    isBoss: true,
    dungeonId: 'booby_forest',
    weight: 2,
    name: 'Booby',
    area: 'Booby Forest',
    hp: 75, atk: 16, def: 6, exp: 40, gold: 80,
    opener: 'A heavy forest beast lowers its head and charges first.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.2 },
      /*      { id: 'catalyst_shard', type: 'catalyst', chance: 1 },
            { id: 'catalyst_core', type: 'catalyst', chance: 1 },
            { id: 'catalyst_crystal', type: 'catalyst', chance: 1 },
            { type: 'uncommon_spell_tiered', tier: 'strong', chance: 1 },*/
    ],
  },

  // Magi Graveyard enemies
  { // Bone Magi
    id: 'bone_magi',
    dungeonId: 'magi_graveyard',
    weight: 5,
    name: 'Bone Magi',
    area: 'Magi Graveyard',
    hp: 72, atk: 14, def: 6, exp: 30, gold: 60,
    regenPerTurn: 5,
    opener: 'A skeletal mage rises from the grave, dark energy crackling around its bones.',
    dropTable: [],
  },
  { // Cursed Arcanist
    id: 'cursed_arcanist',
    dungeonId: 'magi_graveyard',
    weight: 3,
    name: 'Cursed Arcanist',
    area: 'Magi Graveyard',
    hp: 68, atk: 16, def: 4, exp: 32, gold: 65,
    regenPerTurn: 4,
    opener: 'A fallen mage bound by an ancient curse turns its hollow eyes toward you.',
    dropTable: [],
  },
  { // Grave Lich
    id: 'grave_lich',
    isBoss: true,
    dungeonId: 'magi_graveyard',
    weight: 2,
    name: 'Grave Lich',
    area: 'Magi Graveyard',
    hp: 80, atk: 18, def: 5, exp: 35, gold: 80,
    regenPerTurn: 6,
    opener: 'A lich lord stirs from its eternal slumber, hungry for living mana.',
    dropTable: [
      { id: 'catalyst_core', type: 'catalyst', chance: 0.15 },
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.05 },
    ],
  },

  // Cursed Clocktower enemies
  { // Tick Sprite
    id: 'tick_sprite',
    dungeonId: 'cursed_clocktower',
    weight: 5,
    name: 'Tick Sprite',
    area: 'Cursed Clocktower',
    hp: 130, atk: 30, def: 10, exp: 55, gold: 115,
    opener: 'A small clockwork imp skitters across the gears, eyes ticking like a watch.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.01 },
    ],
  },
  { // Clockwork Soldier
    id: 'clockwork_soldier',
    dungeonId: 'cursed_clocktower',
    weight: 4,
    name: 'Clockwork Soldier',
    area: 'Cursed Clocktower',
    hp: 150, atk: 34, def: 14, exp: 60, gold: 125,
    opener: 'A soldier of brass and springs snaps to attention, blade raised.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.01 },
    ],
  },
  { // Time-Worn Mage
    id: 'time_worn_mage',
    dungeonId: 'cursed_clocktower',
    weight: 3,
    name: 'Time-Worn Mage',
    area: 'Cursed Clocktower',
    hp: 140, atk: 38, def: 11, exp: 65, gold: 130,
    regenPerTurn: 4,
    opener: 'A mage frozen mid-cast for centuries finally completes the spell — aimed at you.',
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'weak', chance: 0.2 },
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.01 },
    ],
  },
  { // Rusted Warden
    id: 'rusted_warden',
    dungeonId: 'cursed_clocktower',
    weight: 2,
    name: 'Rusted Warden',
    area: 'Cursed Clocktower',
    hp: 165, atk: 40, def: 16, exp: 70, gold: 140,
    regenPerTurn: 5,
    opener: 'Ancient mechanisms grind as the warden lurches forward, unstoppable.',
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'mid', chance: 0.2 },
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.01 },
    ],
  },
  { // Chronolith
    id: 'chronolith',
    isBoss: true,
    dungeonId: 'cursed_clocktower',
    weight: 1,
    name: 'Chronolith',
    area: 'Cursed Clocktower',
    hp: 200, atk: 48, def: 18, exp: 85, gold: 170,
    regenPerTurn: 8,
    opener: "The tower's core awakens. Time stutters. The Chronolith has no patience for the living.",
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'strong', chance: 0.2 },
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.01 },
    ],
  },

  // Drowned Codex enemies
  { // Ink Wraith
    id: 'ink_wraith',
    dungeonId: 'drowned_codex',
    weight: 5,
    name: 'Ink Wraith',
    area: 'Drowned Codex',
    hp: 220, atk: 52, def: 18, exp: 100, gold: 200,
    opener: 'A dissolved scholar bleeds back into form, its final thesis still clutched in translucent hands.',
    dropTable: [],
  },
  { // Vellum Specter
    id: 'vellum_specter',
    dungeonId: 'drowned_codex',
    weight: 4,
    name: 'Vellum Specter',
    area: 'Drowned Codex',
    hp: 210, atk: 58, def: 15, exp: 105, gold: 210,
    opener: 'Pages of cursed parchment orbit a hollow core, slicing anything that passes.',
    dropTable: [],
  },
  { // Archive Golem
    id: 'archive_golem',
    dungeonId: 'drowned_codex',
    weight: 3,
    name: 'Archive Golem',
    area: 'Drowned Codex',
    hp: 260, atk: 48, def: 26, exp: 110, gold: 220,
    regenPerTurn: 6,
    opener: 'Built to guard the stacks, now guarding nothing — still faithfully lethal.',
    dropTable: [],
  },
  { // Drowned Scribe
    id: 'drowned_scribe',
    dungeonId: 'drowned_codex',
    weight: 2,
    name: 'Drowned Scribe',
    area: 'Drowned Codex',
    hp: 240, atk: 62, def: 20, exp: 115, gold: 230,
    regenPerTurn: 5,
    opener: "It hasn't stopped writing. It never will. The ink it uses is yours.",
    dropTable: [],
  },
  { // Codex Sovereign
    id: 'codex_sovereign',
    dungeonId: 'drowned_codex',
    isBoss: true,
    weight: 1,
    name: 'Codex Sovereign',
    area: 'Drowned Codex',
    hp: 320, atk: 72, def: 30, exp: 140, gold: 290,
    regenPerTurn: 8,
    opener: 'The library\'s last head archivist. It indexed everything — including how you die.',
    dropTable: [
      { type: 'rare_spell_tiered', chance: 0.05 },
    ],
  },

  // Bangkok Nightmare enemies
  { // Tuk Tuk
    id: 'tuk_tuk',
    dungeonId: 'bangkok_nightmare',
    weight: 5,
    name: 'Tuk Tuk',
    area: 'Bangkok Nightmare',
    hp: 310,
    atk: 58,
    def: 12,
    exp: 130,
    gold: 0, // Base gold = 0; gold is stolen from the player instead (handled by perk)
    goldSteal: true, // flag read by battle outcome logic
    goldStealAmount: { min: 80, max: 180 }, // stolen regardless of win/loss
    opener: 'A battered Tuk Tuk revs its engine. The driver grins and holds out his hand before the fight even starts.',
    dropTable: [],
  },
  { // Street Food Vendor
    id: 'street_food_vendor',
    dungeonId: 'bangkok_nightmare',
    weight: 4,
    name: 'Street Food Vendor',
    area: 'Bangkok Nightmare',
    hp: 280,
    atk: 52,
    def: 10,
    exp: 115,
    gold: 160,
    // Sells cursed food — applies a random debuff every 3 turns
    spCurse: true, // flag: every 3rd turn, reduce player SP by 8
    spCurseAmount: 8,
    spCurseInterval: 3,
    opener: 'A suspicious skewer is thrust toward you. "You buy! Very good price!" The smell alone makes your SP waver.',
    dropTable: [],
  },
  { // Public Bus (Black Smoke)
    id: 'public_bus',
    dungeonId: 'bangkok_nightmare',
    weight: 3,
    name: 'Public Bus No. 8',
    area: 'Bangkok Nightmare',
    hp: 420,
    atk: 55,
    def: 20,
    exp: 145,
    gold: 200,
    // Emits black smoke each hit — reduces player's effective ATK scaling by 10% per stack (max 3 stacks)
    smokeStacks: true,
    smokePerHit: 1,
    maxSmokeStacks: 3,
    smokeAtkReduction: 0.10,
    regenPerTurn: 5,
    opener: 'A decrepit bus lumbers forward, belching thick black smoke. You can barely see the enemy — or your own spell circle.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.03 },
    ],
  },
  { // Motorbike Swarm
    id: 'motorbike_swarm',
    dungeonId: 'bangkok_nightmare',
    weight: 3,
    name: 'Motorbike Swarm',
    area: 'Bangkok Nightmare',
    hp: 260,
    atk: 68,
    def: 8,
    exp: 120,
    gold: 175,
    dodgeChance: 0.25,
    trafficJamDelay: { min: 1, max: 2 },
    opener: 'A dozen motorbikes appear from every direction, threading gaps that shouldn\'t exist.',
    dropTable: [],
  },
  { // Limousine (Boss)
    id: 'limousine',
    isBoss: true,
    dungeonId: 'bangkok_nightmare',
    weight: 1,
    name: 'Limousine',
    area: 'Bangkok Nightmare',
    hp: 680,
    atk: 82,
    def: 32,
    exp: 210,
    gold: 420,
    regenPerTurn: 12,
    trafficJamDelay: { min: 2, max: 3 },
    hornStun: true,
    hornInterval: 5,
    opener: 'A black limousine with tinted windows rolls to a stop, blocking the entire road. The window slides down exactly one centimeter.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.12 },
      { type: 'rare_spell_tiered', chance: 0.08 },
    ],
  },

  // Rift's End enemies
  { // The First Arcanist
    id: 'first_arcanist',
    dungeonId: 'rifts_end',
    weight: 3,
    name: 'The First Arcanist',
    area: "Rift's End",
    hp: 1200,
    atk: 195,
    def: 22,
    exp: 480,
    gold: 900,
    regenPerTurn: 15,
    // Mirror ability: reflects 25% of all spell damage back to caster
    spellReflect: true,
    spellReflectPct: 0.25,
    // Casts a "Mana Rupture" on turns 4 and 8 — drains 20 SP from player
    manaRupture: true,
    manaRuptureInterval: 4,
    manaRuptureDrain: 20,
    opener: 'The original tower mage. Every spell you know — they wrote. "I taught this to children." Their disappointment hits harder than their spells.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.50 },
      { type: 'rare_spell_tiered', chance: 0.20 },
    ],
  },
  { // The Void Sentinel
    id: 'void_sentinel',
    dungeonId: 'rifts_end',
    weight: 3,
    name: 'The Void Sentinel',
    area: "Rift's End",
    hp: 1800,
    atk: 155,
    def: 88,
    exp: 520,
    gold: 1100,
    regenPerTurn: 25,
    // Shield phase: first 400 HP of damage each battle is absorbed by a void shield (displays differently)
    voidShield: true,
    voidShieldAmount: 400,
    // Void Crush every 3 turns: deals 15% of player's MAX HP as true damage
    voidCrush: true,
    voidCrushInterval: 3,
    voidCrushPct: 0.15,
    opener: 'It has no face. It has guarded this rift for ten thousand years. It does not move — the world moves around it.',
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 0.60 },
      { type: 'rare_spell_tiered', chance: 0.25 },
    ],
  },
  { // The Rift Itself (Final Boss)
    id: 'the_rift',
    isBoss: true,
    dungeonId: 'rifts_end',
    weight: 1,
    name: 'The Rift Itself',
    area: "Rift's End",
    hp: 2800,
    atk: 240,
    def: 55,
    exp: 850,
    gold: 2500,
    regenPerTurn: 30,
    // Phase threshold: at 50% HP, ATK increases by 60% and regen doubles
    phaseShift: true,
    phaseShiftThreshold: 0.50,
    phaseShiftAtkMult: 1.60,
    phaseShiftRegenMult: 2,
    phaseShiftTriggered: false, // runtime flag, reset per battle
    // Reality Fracture: every 2 turns, reduces all damage dealt this turn by 50% ("reality resists")
    realityFracture: true,
    realityFractureInterval: 2,
    realityFractureReduction: 0.50,
    // Entropy Strike: boss attack ignores 40% of player DEF
    entropyStrike: true,
    entropyDefBypass: 0.40,
    opener: "It doesn't attack you. It simply becomes aware of you. The last thing anyone ever hears is the sound of their own memories unraveling.",
    dropTable: [
      { id: 'catalyst_crystal', type: 'catalyst', chance: 1.00 }, // guaranteed
      { type: 'rare_spell_tiered', chance: 0.50 },
    ],
  },
];

const DUNGEONS_DATA = [
  { // Booby Forest
    id: 'booby_forest',
    perks: [],
    name: 'Booby Forest',
    icon: 'leaf',
    tag: '◈ Cursed Woodland',
    difficulty: 'Easy',
    image: '/asset/dungeon_scene/booby_forest.png',
    levelReq: 1,
    unlocked: true,
    expRange: '+10~14',
    goldRange: '+6~22',
    description: 'A cursed woodland teeming with weak monsters. The perfect hunting ground for new mages testing their first spell sequences.',
  },
  { // Magi Graveyard
    id: 'magi_graveyard',
    perks: [],
    name: 'Magi Graveyard',
    icon: 'skull',
    tag: '◈ Ancient Burial',
    difficulty: 'Normal',
    image: '/asset/dungeon_scene/magi_graveyard.png',
    levelReq: 5,
    unlocked: true,
    expRange: '+25~35',
    goldRange: '+35~80',
    description: 'Ancient burial grounds haunted by fallen mages. Higher danger, greater rewards. Requires stable builds to survive.',
  },
  { // Cursed Clocktower
    id: 'cursed_clocktower',
    perks: [
      { type: 'time_pressure', startTurn: 3, atkBonusPerTurn: 0.15 },
    ],
    name: 'Cursed Clocktower',
    icon: 'clock',
    tag: '◈ Twisted Tower',
    difficulty: 'Hard',
    image: '/asset/dungeon_scene/cursed_clocktower.png',
    levelReq: 10,
    unlocked: true,
    expRange: '+40~60',
    goldRange: '+90~130',
    description: 'A twisted tower of gears and mechanisms, home to time-worn creatures. A true test of skill and strategy.',
  },
  { // Drowned Codex
    id: 'drowned_codex',
    name: 'Drowned Codex',
    icon: 'book',
    tag: '◈ Sunken Library',
    difficulty: 'Nightmare',
    image: '/asset/dungeon_scene/drowned_codex.png',
    levelReq: 15,
    unlocked: true,
    expRange: '+65~85',
    goldRange: '+140~180',
    description: 'A sunken arcane library frozen mid-collapse. Books float in void-water, ink bleeds into darkness. Magic itself is unreliable here.',
    perks: [
      { type: 'ink_bleed', chanceNormal: 0.15, chanceBoss: 0.20 }
    ],
  },
  { // Bangkok Nightmare
    id: 'bangkok_nightmare',
    name: 'Bangkok Nightmare',
    icon: 'car',
    tag: '◈ Urban Hellscape',
    difficulty: 'Nightmare',
    image: '/asset/dungeon_scene/bangkok_nightmare.png',
    levelReq: 20,
    unlocked: true,
    expRange: '+115~210',
    goldRange: '+0~420', // intentionally low minimum — Tuk Tuk steals
    description: 'A city that never sleeps and never moves. Time crawls like traffic on Sukhumvit at 6pm. Your spells arrive — eventually. Your gold may not.',
    perks: [
      {
        type: 'traffic_jam',
        delayChance: 1.0,
        releaseMultiplier: 1,
      },
    ],
  },
  { // Rift's End
    id: 'rifts_end',
    name: "Rift's End",
    icon: 'zap',
    tag: '◈ The Final Threshold',
    difficulty: 'Nightmare',
    image: '/asset/dungeon_scene/rifts_end.png',
    levelReq: 60,
    unlocked: true,
    expRange: '+480~850',
    goldRange: '+900~2500',
    description: 'Beyond the last seal. Three beings that predate the tower system wait here. Lv.90+ recommended. Spell stones Lv.9+ strongly advised. Those who enter underprepared become part of the scenery.',
    perks: [
      { // Ancient Pressure
        // Ancient Pressure: all player stats scale down by (90 - playerLevel) * 1.2% if below lv.90.
        // At lv.1 this is an ~107% reduction — nearly impossible. At lv.89 it's a 1.2% penalty.
        // Implementation: multiplier applied in spellPower() and enemyStrike() calls.
        type: 'ancient_pressure',
        targetLevel: 90,
        penaltyPerLevel: 0.012, // 1.2% per level below 90
      },
      { // Spell Fatigue
        // Spell Fatigue: spells below Lv.9 deal 40% reduced damage in this dungeon.
        type: 'spell_fatigue',
        minSpellLevel: 9,
        lowLevelPenalty: 0.40, // multiplied into damage if spell < minSpellLevel
      },
    ],
  },
];

function getDungeonDef(id) {
  return DUNGEONS_DATA.find(dungeon => dungeon.id === id) || null;
}

function getRandomEnemy(dungeonId) {
  const pool = dungeonId
    ? ENEMIES_DATA.filter(e => e.dungeonId === dungeonId)
    : ENEMIES_DATA;
  const list = pool.length ? pool : ENEMIES_DATA;

  const totalWeight = list.reduce((sum, e) => sum + (e.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const e of list) {
    roll -= (e.weight || 1);
    if (roll < 0) return e;
  }
  return list[list.length - 1];
}

window.DUNGEONS_DATA = DUNGEONS_DATA;
window.ENEMIES_DATA = ENEMIES_DATA;
window.getDungeonDef = getDungeonDef;
window.getRandomEnemy = getRandomEnemy;