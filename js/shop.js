/* ============================================================
   SOULRIFT — shop.js
   Tower-filtered common spell shop.
   ============================================================ */

'use strict';

function renderMarket() {
  const tower = getTower();
  const wrap = document.getElementById('market-list');
  if (!wrap) return;

  const spells = window.getCommonShopSpells ? getCommonShopSpells(tower) : [];
  if (!spells.length) {
    wrap.innerHTML = '<div class="empty-state">'
      + '<div class="empty-state__icon">&#9671;</div>'
      + '<div class="empty-state__title">No Tower Wares</div>'
      + '<div class="empty-state__body">Choose a tower to reveal its common spell stones.</div>'
      + '</div>';
    return;
  }

  wrap.innerHTML = spells.map(spell => (
    '<div class="card card--raised spell-shop-card" style="margin-bottom:var(--sp-2);">'
      + '<div class="row row--between row--gap-3">'
        + '<div>'
          + '<div class="spell-card__name">' + spell.name + '</div>'
          + '<div class="spell-card__meta">' + spell.role + ' · SP ' + spell.spCost + '</div>'
        + '</div>'
        + '<span class="badge badge--' + spell.tower + '">' + spell.tower + '</span>'
      + '</div>'
      + '<div class="spell-card__desc">' + spell.desc + '</div>'
      + '<button class="btn btn--ghost btn--full" style="margin-top:var(--sp-3);" onclick="buyShopSpell(\'' + spell.id + '\')">'
        + 'Buy Stone · ' + spell.price + ' Gold'
      + '</button>'
    + '</div>'
  )).join('');
}

function buyShopSpell(spellId) {
  const def = window.getSpellDef ? getSpellDef(spellId) : null;
  if (!def) return;
  if (!spendGold(def.price)) {
    toast('Not enough Gold for ' + def.name + '.', 'bad', 2400);
    return;
  }

  giveSpell(def.id, 1);
  syncHeader();
  renderMarket();
  if (typeof renderInventory === 'function') renderInventory();
  toast(def.name + ' stone acquired.', 'gold', 2400);
}

onScreen('market', renderMarket);
