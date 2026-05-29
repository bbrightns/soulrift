/* ============================================================
   SOULRIFT — /data/enemies.js
   Phase 1 enemy data for automatic text battles.
   ============================================================ */

'use strict';

const ENEMIES_DATA = [
  // Booby Forest enemies
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

  // Magi Graveyard enemies
  {
    id: 'bone_magi',
    dungeonId: 'magi_graveyard',
    name: 'Bone Magi',
    area: 'Magi Graveyard',
    hp: 72,
    atk: 14,
    def: 6,
    exp: 30,
    gold: 60,
    regenPerTurn: 5,
    opener: 'A skeletal mage rises from the grave, dark energy crackling around its bones.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.15 },
      { id: 'catalyst_core', type: 'catalyst', chance: 0.05 },
    ],
  },
  {
    id: 'cursed_arcanist',
    dungeonId: 'magi_graveyard',
    name: 'Cursed Arcanist',
    area: 'Magi Graveyard',
    hp: 68,
    atk: 16,
    def: 4,
    exp: 32,
    gold: 65,
    regenPerTurn: 4,
    opener: 'A fallen mage bound by an ancient curse turns its hollow eyes toward you.',
    dropTable: [
      { id: 'catalyst_shard', type: 'catalyst', chance: 0.15 },
      { id: 'catalyst_core', type: 'catalyst', chance: 0.05 },
    ],
  },
  {
    id: 'grave_lich',
    dungeonId: 'magi_graveyard',
    name: 'Grave Lich',
    area: 'Magi Graveyard',
    hp: 80,
    atk: 18,
    def: 5,
    exp: 35,
    gold: 80,
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
    ? ENEMIES_DATA.filter(enemy => enemy.dungeonId === dungeonId)
    : ENEMIES_DATA;
  const list = pool.length ? pool : ENEMIES_DATA;
  return list[Math.floor(Math.random() * list.length)];
}

window.DUNGEONS_DATA = DUNGEONS_DATA;
window.ENEMIES_DATA = ENEMIES_DATA;
window.getDungeonDef = getDungeonDef;
window.getRandomEnemy = getRandomEnemy;
