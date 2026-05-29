/* ============================================================
   SOULRIFT — /data/enemies.js
   Phase 1 enemy data for automatic text battles.
   ============================================================ */

'use strict';

const ENEMIES_DATA = [
  // Booby Forest enemies
  {
    id: 'training_shadow',
    dungeonId: 'booby_forest',
    weight: 5,
    name: 'Training Shadow',
    area: 'Booby Forest',
    hp: 45, atk: 7, def: 2, exp: 20, gold: 55,
    opener: 'A practice shade copies the stance of an old tower apprentice.',
    dropTable: [],
  },
  {
    id: 'goblin_frenzy',
    dungeonId: 'booby_forest',
    weight: 3,
    name: 'Goblin Frenzy',
    area: 'Booby Forest',
    hp: 42, atk: 9, def: 2, exp: 26, gold: 65,
    opener: 'A quick goblin darts out of the brush, shrieking for the first strike.',
    dropTable: [],
  },
  {
    id: 'booby',
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
  {
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
  {
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
  {
    id: 'grave_lich',
    dungeonId: 'magi_graveyard',
    weight: 200,
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
  {
    id: 'tick_sprite',
    dungeonId: 'cursed_clocktower',
    weight: 5,
    name: 'Tick Sprite',
    area: 'Cursed Clocktower',
    hp: 90, atk: 20, def: 6, exp: 40, gold: 90,
    opener: 'A small clockwork imp skitters across the gears, eyes ticking like a watch.',
    dropTable: [],
  },
  {
    id: 'clockwork_soldier',
    dungeonId: 'cursed_clocktower',
    weight: 4,
    name: 'Clockwork Soldier',
    area: 'Cursed Clocktower',
    hp: 100, atk: 22, def: 9, exp: 44, gold: 95,
    opener: 'A soldier of brass and springs snaps to attention, blade raised.',
    dropTable: [],
  },
  {
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
  {
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
  {
    id: 'chronolith',
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
];

const DUNGEONS_DATA = [
  {
    id: 'booby_forest',
    name: 'Booby Forest',
    icon: 'leaf',
    levelReq: 1,
    unlocked: true,
    expRange: '+10~14',
    goldRange: '+6~22',
    description: 'A cursed woodland teeming with weak monsters. The perfect hunting ground for new mages testing their first spell sequences.',
  },
  {
    id: 'magi_graveyard',
    name: 'Magi Graveyard',
    icon: 'skull',
    levelReq: 5,
    unlocked: true,
    expRange: '+25~35',
    goldRange: '+35~80',
    description: 'Ancient burial grounds haunted by fallen mages. Higher danger, greater rewards. Requires stable builds to survive.',
  },
  {
    id: 'cursed_clocktower',
    name: 'Cursed Clocktower',
    icon: 'clock',
    levelReq: 10,
    unlocked: true,
    expRange: '+40~60',
    goldRange: '+90~130',
    description: 'A twisted tower of gears and mechanisms, home to time-worn creatures. A true test of skill and strategy.',
  }
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
