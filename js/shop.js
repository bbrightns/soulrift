/* ============================================================
   SOULRIFT — /js/shop.js
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
    + '<div class="shop-card-top">'
    + '<img src="/asset/spell_icons/' + spell.id + '.png" class="shop-spell-icon" alt="">'
    + '<div class="shop-card-info">'
    + '<div class="spell-card__name">' + spell.name + '</div>'
    + '<div class="spell-card__meta">' + spell.role + ' · SP ' + spell.spCost + '</div>'
    + '<div class="spell-card__desc">' + spell.desc + '</div>'
    + '</div>'
    + '<div class="shop-card-badges">'
    + '<span class="shop-price-badge">' + spell.price + ' Gold</span>'
    + '<span class="badge badge--' + spell.tower + '">' + spell.tower + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="shop-buy-row">'
    + '<button class="shop-buy-btn" onclick="buyShopSpell(\'' + spell.id + '\',1)">Buy ×1</button>'
    + '<button class="shop-buy-btn shop-buy-btn--right" onclick="buyShopSpell(\'' + spell.id + '\',10)">Buy ×10</button>'
    + '<button class="shop-buy-btn shop-buy-btn--right" onclick="buyShopSpell(\'' + spell.id + '\',100)">Buy ×100</button>'
    + '</div>'
    + '</div>'
  )).join('');
}

let _shopPending = null;  // { spellId, qty }

function buyShopSpell(spellId, qty = 1) {
  const def = window.getSpellDef ? getSpellDef(spellId) : null;
  if (!def) return;

  const total = def.price * qty;
  const playerGold = getState().gold;
  const canAfford = playerGold >= total;

  const modal = document.getElementById('shop-confirm-modal');
  const body = document.getElementById('shop-confirm-body');
  if (!modal || !body) return;

  body.innerHTML =
    '<img src="/asset/spell_icons/' + def.id + '.png" class="shop-confirm-icon" alt="">'
    + '<div class="modal-title" id="modal-confirm-title">' + def.name + ' ×' + qty + '</div>'
    + '<div class="modal-body">Cost: <span class="modal-stat--gold">' + total + ' Gold</span></div>'
    + '<div class="' + (canAfford ? 'modal-hint' : 'modal-body modal-stat--bad') + '">'
    + 'You have: ' + playerGold + ' Gold'
    + (!canAfford ? '<br>Not enough gold.' : '')
    + '</div>';

  const confirmBtn = modal.querySelector('.btn--primary');
  if (confirmBtn) confirmBtn.disabled = !canAfford;

  _shopPending = canAfford ? { spellId, qty } : null;
  modal.setAttribute('aria-labelledby', 'modal-confirm-title');
  modal.classList.remove('is-hidden');
  if (typeof _openModal === 'function') _openModal(modal);
}

function confirmShopBuy() {
  if (!_shopPending) return;
  const { spellId, qty } = _shopPending;
  _shopPending = null;

  const def = window.getSpellDef ? getSpellDef(spellId) : null;
  if (!def) { closeShopConfirm(); return; }

  const total = def.price * qty;
  if (!spendGold(total)) {
    toast('Not enough Gold.', 'bad', 2400);
    closeShopConfirm();
    return;
  }

  for (let i = 0; i < qty; i++) giveSpell(def.id, 1);
  syncHeader();
  renderMarket();
  if (typeof renderInventory === 'function') renderInventory();
  toast(def.name + (qty > 1 ? ' ×' + qty : '') + ' acquired.', 'gold', 2400);
  closeShopConfirm();
}

function closeShopConfirm() {
  const modal = document.getElementById('shop-confirm-modal');
  if (modal) { if (typeof _closeModal === 'function') _closeModal(modal); modal.classList.add('is-hidden'); }
  _shopPending = null;
  const confirmBtn = modal ? modal.querySelector('.btn--primary') : null;
  if (confirmBtn) {
    confirmBtn.textContent = 'Confirm';
    confirmBtn.onclick = confirmShopBuy;
  }
}

window.confirmShopBuy = confirmShopBuy;
window.closeShopConfirm = closeShopConfirm;

onScreen('market', renderMarket);
