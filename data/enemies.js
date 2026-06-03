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