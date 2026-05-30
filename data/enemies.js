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
    hp: 45, atk: 7, def: 2, exp: 20, gold: 55,
    opener: 'A practice shade copies the stance of an old tower apprentice.',
    dropTable: [],
  },
  { // Goblin Frenzy
    id: 'goblin_frenzy',
    dungeonId: 'booby_forest',
    weight: 3,
    name: 'Goblin Frenzy',
    area: 'Booby Forest',
    hp: 42, atk: 9, def: 2, exp: 26, gold: 65,
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
    hp: 48, atk: 8, def: 3, exp: 24, gold: 70,
    opener: 'A heavy forest beast lowers its head and charges first.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.2 },
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
    hp: 90, atk: 20, def: 6, exp: 40, gold: 90,
    opener: 'A small clockwork imp skitters across the gears, eyes ticking like a watch.',
    dropTable: [],
  },
  { // Clockwork Soldier
    id: 'clockwork_soldier',
    dungeonId: 'cursed_clocktower',
    weight: 4,
    name: 'Clockwork Soldier',
    area: 'Cursed Clocktower',
    hp: 100, atk: 22, def: 9, exp: 44, gold: 95,
    opener: 'A soldier of brass and springs snaps to attention, blade raised.',
    dropTable: [],
  },
  { // Time-Worn Mage
    id: 'time_worn_mage',
    dungeonId: 'cursed_clocktower',
    weight: 3,
    name: 'Time-Worn Mage',
    area: 'Cursed Clocktower',
    hp: 95, atk: 25, def: 7, exp: 48, gold: 100,
    regenPerTurn: 4,
    opener: 'A mage frozen mid-cast for centuries finally completes the spell — aimed at you.',
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'weak', chance: 0.2 },
    ],
  },
  { // Rusted Warden
    id: 'rusted_warden',
    dungeonId: 'cursed_clocktower',
    weight: 2,
    name: 'Rusted Warden',
    area: 'Cursed Clocktower',
    hp: 110, atk: 26, def: 10, exp: 52, gold: 110,
    regenPerTurn: 5,
    opener: 'Ancient mechanisms grind as the warden lurches forward, unstoppable.',
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'mid', chance: 0.2 },
    ],
  },
  { // Chronolith
    id: 'chronolith',
    isBoss: true,
    dungeonId: 'cursed_clocktower',
    weight: 1,
    name: 'Chronolith',
    area: 'Cursed Clocktower',
    hp: 130, atk: 30, def: 12, exp: 60, gold: 130,
    regenPerTurn: 8,
    opener: "The tower's core awakens. Time stutters. The Chronolith has no patience for the living.",
    dropTable: [
      { type: 'uncommon_spell_tiered', tier: 'strong', chance: 0.2 },
    ],
  },

  // Drowned Codex enemies
  { // Ink Wraith
    id: 'ink_wraith',
    dungeonId: 'drowned_codex',
    weight: 5,
    name: 'Ink Wraith',
    area: 'Drowned Codex',
    hp: 130, atk: 32, def: 10, exp: 65, gold: 140,
    opener: 'A dissolved scholar bleeds back into form, its final thesis still clutched in translucent hands.',
    dropTable: [],
  },
  { // Vellum Specter
    id: 'vellum_specter',
    dungeonId: 'drowned_codex',
    weight: 4,
    name: 'Vellum Specter',
    area: 'Drowned Codex',
    hp: 125, atk: 35, def: 8, exp: 68, gold: 145,
    opener: 'Pages of cursed parchment orbit a hollow core, slicing anything that passes.',
    dropTable: [],
  },
  { // Archive Golem
    id: 'archive_golem',
    dungeonId: 'drowned_codex',
    weight: 3,
    name: 'Archive Golem',
    area: 'Drowned Codex',
    hp: 150, atk: 30, def: 15, exp: 70, gold: 150,
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
    hp: 140, atk: 38, def: 12, exp: 72, gold: 155,
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
    hp: 180, atk: 42, def: 18, exp: 85, gold: 180,
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
    levelReq: 5,
    unlocked: true,
    expRange: '+25~35',
    goldRange: '+35~80',
    description: 'Ancient burial grounds haunted by fallen mages. Higher danger, greater rewards. Requires stable builds to survive.',
  },
  { // Cursed Clocktower
    id: 'cursed_clocktower',
    perks: [
      { type: 'time_pressure', startTurn: 6, atkBonusPerTurn: 0.15 },
    ],
    name: 'Cursed Clocktower',
    icon: 'clock',
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
