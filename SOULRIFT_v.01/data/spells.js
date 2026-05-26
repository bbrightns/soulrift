/* ============================================================
   SOULRIFT — data/spells.js
   MVP spell catalog, focused on common shop stones for 4 towers.
   ============================================================ */

'use strict';

const SPELLS_DATA = [
  {
    id: 'light_shot',
    name: 'Light Shot',
    tower: 'light',
    rarity: 'common',
    role: 'Basic holy damage',
    spCost: 7,
    price: 120,
    desc: 'A clean bolt of sacred light. Reliable, low damage, and charge-friendly.',
  },
  {
    id: 'light_charge',
    name: 'Light Charge',
    tower: 'light',
    rarity: 'common',
    role: 'Charge setup',
    spCost: 6,
    price: 160,
    desc: 'Stores holy energy for a later release spell.',
  },
  {
    id: 'holy_guard',
    name: 'Holy Guard',
    tower: 'light',
    rarity: 'common',
    role: 'Defense buff',
    spCost: 10,
    price: 150,
    desc: 'Raises defense so Light can survive the monster-first opening.',
  },
  {
    id: 'shield_of_absorption',
    name: 'Shield of Absorption',
    tower: 'light',
    rarity: 'common',
    role: 'Shield / conversion',
    spCost: 12,
    price: 180,
    desc: 'Absorbs damage and returns part of that force as recovery.',
  },

  {
    id: 'dark_shot',
    name: 'Dark Shot',
    tower: 'dark',
    rarity: 'common',
    role: 'Basic dark damage',
    spCost: 9,
    price: 120,
    desc: 'A strong shadow projectile that feeds curse and combo lines.',
  },
  {
    id: 'curse_fang',
    name: 'Curse Fang',
    tower: 'dark',
    rarity: 'common',
    role: 'Curse setup',
    spCost: 10,
    price: 160,
    desc: 'Marks the enemy so later dark spells bite deeper.',
  },
  {
    id: 'fog',
    name: 'Fog',
    tower: 'dark',
    rarity: 'common',
    role: 'Disruption',
    spCost: 11,
    price: 150,
    desc: 'Covers the battlefield in black mist, disrupting enemy accuracy.',
  },
  {
    id: 'soul_drain',
    name: 'Soul Drain',
    tower: 'dark',
    rarity: 'common',
    role: 'Vampiric healing',
    spCost: 12,
    price: 180,
    desc: 'Steals life from the enemy to keep a fragile dark mage alive.',
  },

  {
    id: 'fire_shot',
    name: 'Fire Shot',
    tower: 'fire',
    rarity: 'common',
    role: 'Basic fire damage',
    spCost: 8,
    price: 120,
    desc: 'A burning projectile for early fights and burn combo starts.',
  },
  {
    id: 'burn',
    name: 'Burn',
    tower: 'fire',
    rarity: 'common',
    role: 'Stacking damage over time',
    spCost: 10,
    price: 160,
    desc: 'Applies stacking fire damage that can later be detonated.',
  },
  {
    id: 'fire_thief',
    name: 'Fire Thief',
    tower: 'fire',
    rarity: 'common',
    role: 'Damage / Credit steal',
    spCost: 12,
    price: 180,
    desc: 'Deals fire damage and steals a small amount of battle Credit.',
  },
  {
    id: 'ember_skin',
    name: 'Ember Skin',
    tower: 'fire',
    rarity: 'common',
    role: 'Survival buff',
    spCost: 9,
    price: 150,
    desc: 'Wraps the caster in ember armor to survive while conserving SP.',
  },

  {
    id: 'ice_shot',
    name: 'Ice Shot',
    tower: 'ice',
    rarity: 'common',
    role: 'Basic ice damage',
    spCost: 8,
    price: 120,
    desc: 'A sharp glacial projectile for Ice Tower opener lines.',
  },
  {
    id: 'freeze',
    name: 'Freeze',
    tower: 'ice',
    rarity: 'common',
    role: 'Turn denial',
    spCost: 14,
    price: 180,
    desc: 'Attempts to freeze the enemy and deny its next action.',
  },
  {
    id: 'energy_refill',
    name: 'Energy Refill',
    tower: 'ice',
    rarity: 'common',
    role: 'SP recovery',
    spCost: 0,
    price: 160,
    desc: 'Condenses cold mana to restore SP during battle.',
  },
  {
    id: 'frost_ward',
    name: 'Frost Ward',
    tower: 'ice',
    rarity: 'common',
    role: 'Fragile defense',
    spCost: 9,
    price: 150,
    desc: 'A thin ice ward that helps the lowest-HP tower survive.',
  },
];

function getSpellDef(id) {
  return SPELLS_DATA.find(spell => spell.id === id) || null;
}

function getSpellsByTower(tower) {
  return SPELLS_DATA.filter(spell => spell.tower === tower);
}

function getCommonShopSpells(tower) {
  return SPELLS_DATA.filter(spell => spell.tower === tower && spell.rarity === 'common');
}

window.SPELLS_DATA = SPELLS_DATA;
window.getSpellDef = getSpellDef;
window.getSpellsByTower = getSpellsByTower;
window.getCommonShopSpells = getCommonShopSpells;
