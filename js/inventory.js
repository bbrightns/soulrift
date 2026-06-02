/* ============================================================
   SOULRIFT — /js/inventory.js
   Spell inventory and library renderers.
   ============================================================ */

'use strict';

function renderInventory() {
  const wrap = document.getElementById('inventory-list');
  if (!wrap) return;

  const list = getSpells();
  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state">'
      + '<div class="empty-state__icon">◆</div>'
      + '<div class="empty-state__title">Inventory Empty</div>'
      + '<div class="empty-state__body">Buy or earn spell stones to fill your satchel.</div>'
      + '</div>';
    return;
  }

  const grouped = {};
  list.forEach(stone => {
    if (!grouped[stone.id]) grouped[stone.id] = [];
    grouped[stone.id].push({ lvl: stone.lvl, qty: stone.qty });
  });

  const sorted = Object.entries(grouped).sort(([aId], [bId]) => {
    const aName = (getSpellDef(aId) || {}).name || aId;
    const bName = (getSpellDef(bId) || {}).name || bId;
    return aName.localeCompare(bName);
  });

  const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

  wrap.innerHTML = sorted.map(([id, levels]) => {
    const def = getSpellDef(id);
    const tower = def ? def.tower : 'gold';
    const name = def ? def.name : id;
    const desc = def ? def.desc : '';
    const rarity = def ? def.rarity : 'common';

    levels.sort((a, b) => b.lvl - a.lvl);

    const rows = levels.map(entry =>
      '<div class="inv-spell-row">'
      + '<span class="badge badge--lv inv-lv-badge">Lv ' + entry.lvl + '</span>'
      + '<span class="badge badge--' + tower + ' inv-qty-badge">'
      + '<span class="inv-qty-x">×</span>'
      + '<span class="inv-qty-num">' + entry.qty + '</span>'
      + '</span>'
      + '</div>'
    ).join('');

    return '<div class="card card--raised inv-spell-group" style="margin-bottom:var(--sp-2);">'
      + '<img src="/asset/spell_icons/' + id + '.png" class="inv-spell-icon" alt="">'
      + '<div class="inv-spell-left">'
      + '<span class="inv-spell-name">' + name + '</span>'
      + '<span class="inv-spell-desc">' + desc + '</span>'
      + '<span class="badge badge--' + rarity + ' inv-rarity-badge">' + cap(rarity) + '</span>'
      + '</div>'
      + '<div class="inv-spell-right">' + rows + '</div>'
      + '</div>';
  }).join('');
}

function renderItems() {
  renderInventory();
  renderCatalystItems();
}

function renderCatalystItems() {
  const wrap = document.getElementById('catalyst-list');
  if (!wrap) return;

  const CATALYST_NAMES = {
    catalyst_shard:   'Catalyst Shard',
    catalyst_core:    'Catalyst Core',
    catalyst_crystal: 'Catalyst Crystal',
  };
  const CATALYST_FLAVOUR = {
    catalyst_shard:   'A rough shard of fusion ore',
    catalyst_core:    'A refined core of arcane fusion',
    catalyst_crystal: 'A perfect crystal of pure resonance',
  };
  const CATALYST_BONUS_LABEL = {
    catalyst_shard:   '+15% fusion success rate',
    catalyst_core:    '+30% fusion success rate',
    catalyst_crystal: '+50% fusion success rate',
  };

  const items = (getState().items || []).filter(i => CATALYST_NAMES[i.id] && i.qty > 0);

  if (!items.length) {
    wrap.innerHTML =
      '<div class="empty-state empty-state--sm">'
      + '<div class="empty-state__icon">◈</div>'
      + '<div class="empty-state__title">No Catalysts</div>'
      + '<div class="empty-state__body">Catalysts boost fusion success rate. Defeat dungeon enemies to find them.</div>'
      + '</div>';
    return;
  }

  wrap.innerHTML = items.map(i =>
    '<div class="card card--raised inv-spell-group" style="margin-bottom:var(--sp-2);">'
    + '<img src="/asset/catalyst_icons/' + i.id + '.png" class="inv-spell-icon" alt="">'
    + '<div class="inv-spell-left" style="justify-content:center;">'
    +   '<span class="inv-spell-name">' + CATALYST_NAMES[i.id] + '</span>'
    +   '<span class="inv-spell-desc">' + CATALYST_FLAVOUR[i.id] + '</span>'
    +   '<span class="inv-cat-bonus">' + CATALYST_BONUS_LABEL[i.id] + '</span>'
    + '</div>'
    + '<div class="inv-spell-right" style="justify-content:center;">'
    +   '<div class="inv-spell-row">'
    +     '<span class="badge badge--gold inv-qty-badge">'
    +       '<span class="inv-qty-x">×</span>'
    +       '<span class="inv-qty-num">' + i.qty + '</span>'
    +     '</span>'
    +   '</div>'
    + '</div>'
    + '</div>'
  ).join('');
}

onScreen('items', renderItems);
