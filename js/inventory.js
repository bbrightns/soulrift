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

  wrap.innerHTML = sorted.map(([id, levels]) => {
    const def = getSpellDef(id);
    const tower = def ? def.tower : 'gold';
    const name  = def ? def.name  : id;
    const role  = def ? def.role  : 'Spell Stone';
    const desc  = def ? def.desc  : '';

    levels.sort((a, b) => b.lvl - a.lvl);

    const rows = levels.map(entry =>
      '<div class="inv-spell-row">'
      + '<span class="badge badge--lv inv-lv-badge">Lv ' + entry.lvl + '</span>'
      + '<span class="badge badge--' + tower + ' inv-qty-badge">×' + entry.qty + '</span>'
      + '</div>'
    ).join('');

    return '<div class="card card--raised inv-spell-group" style="margin-bottom:var(--sp-2);">'
      + '<div class="inv-spell-head">'
      + '<div class="inv-spell-identity">'
      + '<span class="inv-spell-name">' + name + '</span>'
      + '<span class="inv-spell-sub">' + role + ' · ' + desc + '</span>'
      + '</div>'
      + '<div class="inv-spell-levels">' + rows + '</div>'
      + '</div>'
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
    catalyst_shard:   '🟤 Catalyst Shard',
    catalyst_core:    '🔵 Catalyst Core',
    catalyst_crystal: '🟡 Catalyst Crystal',
  };
  const CATALYST_DESC = {
    catalyst_shard:   '+15% fusion success rate',
    catalyst_core:    '+30% fusion success rate',
    catalyst_crystal: '+50% fusion success rate',
  };

  const items = (getState().items || []).filter(i => CATALYST_NAMES[i.id] && i.qty > 0);

  if (!items.length) {
    wrap.innerHTML = '<div class="empty-state--inline">No catalysts owned.</div>';
    return;
  }

  wrap.innerHTML = items.map(i =>
    '<div class="card card--raised inv-spell-group" style="margin-bottom:var(--sp-2);">'
    + '<div class="inv-spell-head">'
    + '<div class="inv-spell-identity">'
    + '<span class="inv-spell-name">' + CATALYST_NAMES[i.id] + '</span>'
    + '<span class="inv-spell-sub">' + CATALYST_DESC[i.id] + '</span>'
    + '</div>'
    + '<div class="inv-spell-levels">'
    + '<span class="badge badge--gold inv-qty-badge">×' + i.qty + '</span>'
    + '</div>'
    + '</div>'
    + '</div>'
  ).join('');
}

onScreen('items', renderItems);
