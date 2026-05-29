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
    if (roll <= 0) return e;
  }
  return list[list.length - 1];
}

window.DUNGEONS_DATA = DUNGEONS_DATA;
window.ENEMIES_DATA = ENEMIES_DATA;
window.getDungeonDef = getDungeonDef;
window.getRandomEnemy = getRandomEnemy;
