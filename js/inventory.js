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

  wrap.innerHTML = list.map(stone => {
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    const tower = def ? def.tower : 'gold';
    return '<div class="card card--raised row row--between row--gap-3" style="margin-bottom:var(--sp-2);">'
      + '<div>'
        + '<div class="spell-card__name">' + (def ? def.name : stone.id) + '</div>'
        + '<div class="spell-card__meta">Lv ' + stone.lvl + ' · ' + (def ? def.role : 'Spell Stone') + '</div>'
      + '</div>'
      + '<span class="badge badge--' + tower + '">x' + stone.qty + '</span>'
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

  const items = (getState().items || []).filter(i => CATALYST_NAMES[i.id] && i.qty > 0);

  if (!items.length) {
    wrap.innerHTML = '<div style="opacity:0.4;font-size:12px;padding:var(--sp-2) 0">No catalysts owned.</div>';
    return;
  }

  wrap.innerHTML = items.map(i =>
    '<div class="card card--raised row row--between row--gap-3" style="margin-bottom:var(--sp-2);">'
    + '<div>'
      + '<div class="spell-card__name">' + CATALYST_NAMES[i.id] + '</div>'
      + '<div class="spell-card__meta">Fusion catalyst · Increases success rate</div>'
    + '</div>'
    + '<span class="badge badge--gold">×' + i.qty + '</span>'
    + '</div>'
  ).join('');
}

onScreen('items', renderItems);
