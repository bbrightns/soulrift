/* ============================================================
   SOULRIFT — inventory.js
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

function renderLibrary() {
  const list = getSpells();
  const wrap = document.getElementById('library-list');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state">'
      + '<div class="empty-state__icon">▤</div>'
      + '<div class="empty-state__title">No Spells Yet</div>'
      + '<div class="empty-state__body">Visit the Market to acquire your first spell stones.</div>'
      + '</div>';
    return;
  }

  wrap.innerHTML = list.map(stone => {
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    return '<div class="card card--raised" style="margin-bottom:var(--sp-2);">'
      + '<div class="row row--between row--gap-3">'
        + '<div>'
          + '<div class="spell-card__name">' + (def ? def.name : stone.id) + '</div>'
          + '<div class="spell-card__meta">Lv ' + stone.lvl + ' · owned x' + stone.qty + '</div>'
        + '</div>'
        + '<span class="badge badge--gold">Stone</span>'
      + '</div>'
      + '<div class="spell-card__desc">' + (def ? def.desc : 'Unknown spell stone.') + '</div>'
      + '</div>';
  }).join('');
}

onScreen('items', renderInventory);
onScreen('library', renderLibrary);
