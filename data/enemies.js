/* ============================================================
   SOULRIFT — data/enemies.js
   Phase 1 enemy data for automatic text battles.
   ============================================================ */

'use strict';

const ENEMIES_DATA = [
  {
    id: 'booby',
    dungeonId: 'booby_forest',
    name: 'Booby',
    area: 'Booby Forest',
    hp: 48,
    atk: 8,
    def: 3,
    exp: 24,
    gold: 70,
    opener: 'A heavy forest beast lowers its head and charges first.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
    ],
  },
  {
    id: 'goblin_frenzy',
    dungeonId: 'booby_forest',
    name: 'Goblin Frenzy',
    area: 'Booby Forest',
    hp: 42,
    atk: 9,
    def: 2,
    exp: 26,
    gold: 65,
    opener: 'A quick goblin darts out of the brush, shrieking for the first strike.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
    ],
  },
  {
    id: 'training_shadow',
    dungeonId: 'booby_forest',
    name: 'Training Shadow',
    area: 'Booby Forest',
    hp: 45,
    atk: 7,
    def: 2,
    exp: 20,
    gold: 55,
    opener: 'A practice shade copies the stance of an old tower apprentice.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
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
    unlocked: false,
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
    ? ENEMIES_DATA.filter(enemy => enemy.dungeonId === dungeonId)
    : ENEMIES_DATA;
  const list = pool.length ? pool : ENEMIES_DATA;
  return list[Math.floor(Math.random() * list.length)];
}

window.DUNGEONS_DATA = DUNGEONS_DATA;
window.ENEMIES_DATA = ENEMIES_DATA;
window.getDungeonDef = getDungeonDef;
window.getRandomEnemy = getRandomEnemy;
