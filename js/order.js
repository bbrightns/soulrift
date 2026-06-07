/* ============================================================
   SOULRIFT — /js/order.js
   10-turn battle blueprint setup from owned spell stones.
   Blueprint slots store spellId only. Inventory is never consumed.
   ============================================================ */

'use strict';

let _selectedBlueprintSlot = 0;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function getOwnedSpellOptions() {
  const options = [];
  getSpells().forEach(stone => {
    if (!stone || !stone.id || stone.qty < 1) return;
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    if (!def) return;
    options.push({
      id: stone.id,
      lvl: stone.lvl || 1,
      key: stone.id + '|' + (stone.lvl || 1),
      name: def.name,
      role: def.role,
      spCost: def.spCost,
      tower: def.tower,
      qty: stone.qty,
    });
  });
  //options.sort((a, b) => b.lvl - a.lvl || b.spCost - a.spCost);
  options.sort((a, b) => a.name.localeCompare(b.name) || b.lvl - a.lvl);
  return options;
}

function renderBlueprint() {
  const bp = getBlueprint();
  const grid = document.getElementById('blueprint-grid');
  if (!grid) return;

  /* ── No spell stones at all: show CTA to Market ─────── */
  if (!getSpells().length) {
    grid.innerHTML =
      '<div class="empty-state">'
      + '<div class="empty-state__icon">◆</div>'
      + '<div class="empty-state__title">No Spell Stones</div>'
      + '<div class="empty-state__body">Buy spell stones from the Market, then return here to build your battle order.</div>'
      + '<button class="empty-state__cta" type="button" onclick="showScreen(\'market\')">Go to Market</button>'
      + '</div>';
    renderBlueprintSummary();
    return;
  }

  /* ── Has spells but blueprint completely unassigned ──── */
  const _anyFilled = bp.some(s => !!s);

  // Stale slot validation: clear slots whose spell is no longer owned
  bp.forEach((spellId, i) => {
    if (!spellId) return;
    const parts = spellId.split('|');
    const baseId = parts[0];
    const lvl = parseInt(parts[1]) || 1;
    const owned = getSpells().find(s => s.id === baseId && s.lvl === lvl && s.qty >= 1);
    if (!owned) setBlueprintSlot(i, null);
  });

  grid.innerHTML = '';
  bp.forEach((spellId, i) => {
    const parts = spellId ? spellId.split('|') : [];
    const baseId = parts[0] || null;
    const slotLvl = parseInt(parts[1]) || 1;
    const def = baseId && window.getSpellDef ? getSpellDef(baseId) : null;
    const isEmpty = !def;

    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'card card--raised blueprint-slot'
      + (i === _selectedBlueprintSlot ? ' is-selected' : '')
      + (isEmpty ? ' blueprint-slot--empty' : '');
    slot.onclick = () => selectBlueprintSlot(i);

    const lvlBadge = ' <span class="badge--lv">Lv' + slotLvl + '</span>';
    const spellSpan = isEmpty
      ? '<span class="blueprint-slot__spell blueprint-slot__spell--empty">Empty</span>'
      : '<span class="blueprint-slot__spell">' + def.name + lvlBadge + '</span>';

    const iconHTML = def
      ? '<img src="/asset/spell_icons/' + baseId + '.png" class="blueprint-slot__icon" alt="">'
      : '<div class="blueprint-slot__icon blueprint-slot__icon--empty"></div>';

    slot.innerHTML = '<span class="blueprint-slot__turn">' + ROMAN[i] + '</span>'
      + iconHTML
      + spellSpan
      + '<span class="blueprint-slot__cost">' + (def ? 'SP ' + def.spCost : '') + '</span>'
      + '<span class="blueprint-slot__clear" onclick="event.stopPropagation(); clearBlueprintSlot(' + i + ')" title="Clear slot">✕</span>';

    grid.appendChild(slot);
  });

  /* ── Hint banner when nothing is assigned yet ─────── */
  if (!_anyFilled) {
    const hint = document.createElement('div');
    hint.className = 'bp-hint';
    hint.innerHTML =
      '<span class="bp-hint__icon">◈</span>'
      + ' Tap any slot above to assign a spell stone.';
    grid.appendChild(hint);
  }

  renderBlueprintSummary();
  renderSpellPicker();
}

function selectBlueprintSlot(index) {
  _selectedBlueprintSlot = index;
  renderBlueprint();
  openSpellPicker();
}

function assignSpellToSelectedSlot(spellId, lvl) {
  const val = (spellId && lvl) ? spellId + '|' + lvl : null;
  setBlueprintSlot(_selectedBlueprintSlot, val);
  closeSpellPicker();
  renderBlueprint();
}

function clearBlueprintSlot(index) {
  setBlueprintSlot(index, null);
  renderBlueprint();
}

function fillBlueprintAll(spellId, lvl) {
  const panel = document.getElementById('spell-picker-panel');
  if (!panel || !panel.classList.contains('is-open')) return;
  const val = spellId + '|' + lvl;
  getBlueprint().forEach((_, i) => setBlueprintSlot(i, val));
  closeSpellPicker();
  renderBlueprint();
}

function fillBlueprintEmpty(spellId, lvl) {
  const panel = document.getElementById('spell-picker-panel');
  if (!panel || !panel.classList.contains('is-open')) return;
  const val = spellId + '|' + lvl;
  getBlueprint().forEach((slot, i) => { if (!slot) setBlueprintSlot(i, val); });
  closeSpellPicker();
  renderBlueprint();
}

function renderSpellPicker() {
  const wrap = document.getElementById('spell-picker');
  if (!wrap) return;

  const header = document.getElementById('spell-picker-panel-header');
  if (header) header.innerHTML = '<div class="section-label" style="margin:0;">Assign Turn ' + (_selectedBlueprintSlot + 1) + '</div>';

  const options = getOwnedSpellOptions();
  if (!options.length) {
    wrap.innerHTML = '<div class="empty-state">'
      + '<div class="empty-state__icon">◇</div>'
      + '<div class="empty-state__title">No Spell Stones</div>'
      + '<div class="empty-state__body">Buy a spell stone, then assign it to any number of turns.</div>'
      + '</div>';
    return;
  }

  const current = getBlueprint()[_selectedBlueprintSlot];
  wrap.innerHTML = '<div class="spell-picker__grid">'
    + options.map(option => {
      const active = (option.id + '|' + option.lvl) === current ? ' is-selected' : '';
      const lvlBadge = ' <span class="badge--lv">Lv ' + option.lvl + '</span>';
      return '<div class="spell-picker__option-row">'
        + '<button type="button" class="spell-picker__option' + active + '" onclick="assignSpellToSelectedSlot(\'' + option.id + '\',' + option.lvl + ')">'
        + '<img src="/asset/spell_icons/' + option.id + '.png" class="picker-spell-icon" alt="">'
        + '<span class="spell-picker__name"><span class="spell-picker__name-text">' + option.name + '</span>' + lvlBadge + '<span class="spell-picker__meta">SP ' + option.spCost + '</span></span>'
        + '</button>'
        + '<div class="spell-picker__fills">'
        + '<button type="button" class="spell-picker__fill-btn" onclick="fillBlueprintAll(\'' + option.id + '\',' + option.lvl + ')" title="Fill all 10 turns">Fill All</button>'
        + '<button type="button" class="spell-picker__fill-btn" onclick="fillBlueprintEmpty(\'' + option.id + '\',' + option.lvl + ')" title="Fill empty turns">Fill Empty</button>'
        + '</div>'
        + '</div>';
    }).join('')
    + '</div>';
}

function renderBlueprintSummary() {
  const wrap = document.getElementById('blueprint-summary');
  if (!wrap) return;

  const totalSp = getBlueprint().reduce((sum, spellId) => {
    const baseId = spellId ? spellId.split('|')[0] : null;
    const def = baseId && window.getSpellDef ? getSpellDef(baseId) : null;
    return sum + (def ? def.spCost : 0);
  }, 0);
  const player = getPlayer();
  const pct = Math.min(100, Math.round((totalSp / player.spMax) * 100));
  const over = totalSp > player.spMax;

  wrap.innerHTML = '<div class="bp-sp-gauge">'
    + '<div class="bp-sp-gauge__track">'
    + '<div class="bp-sp-gauge__fill' + (over ? ' bp-sp-gauge__fill--over' : '') + '" style="width:' + pct + '%"></div>'
    + '<span class="bp-sp-gauge__label">SP ' + totalSp + ' / ' + player.spMax + '</span>'
    + '</div>'
    + '</div>';
}

function clearBlueprintAndRender() {
  clearBlueprint();
  renderBlueprint();
}

function autoFillBlueprint() {
  const stones = getSpells();
  if (!stones.length) { toast('No spell stones owned.', 'gold'); return; }

  /* score each owned spell — use spellPower if battle.js is loaded */
  const player = getPlayer();
  const scored = stones.map(stone => {
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    if (!def) return null;
    const power = (typeof spellPower === 'function')
      ? spellPower(def, player, stone.lvl || 1)
      : (stone.lvl || 1) * 10 + def.spCost;
    return { id: stone.id, lvl: stone.lvl || 1, power };
  }).filter(Boolean).sort((a, b) => b.power - a.power);

  if (!scored.length) { toast('No valid spells found.', 'bad'); return; }

  const best = scored[0];
  const val = best.id + '|' + best.lvl;
  getBlueprint().forEach((_, i) => setBlueprintSlot(i, val));
  renderBlueprint();
  toast('Blueprint filled with ' + (getSpellDef(best.id) || {}).name + '.', 'ok');
}

function showClearConfirm() {
  const bp = getState().blueprint;
  const filled = bp.filter(s => !!s).length;
  if (filled === 0) {
    toast('Blueprint is already empty.', 'gold');
    return;
  }

  const modal = document.getElementById('shop-confirm-modal');
  const body  = document.getElementById('shop-confirm-body');
  if (!modal || !body) return;

  body.innerHTML =
    '<div class="modal-icon">◌</div>'
    + '<div class="modal-title" id="modal-confirm-title">Clear Blueprint?</div>'
    + '<div class="modal-body">'
    + filled + ' spell' + (filled !== 1 ? 's' : '') + ' will be unassigned. This cannot be undone.'
    + '</div>';

  const confirmBtn = modal.querySelector('.btn--primary');
  const cancelBtn  = modal.querySelector('.btn--ghost');
  if (confirmBtn) {
    confirmBtn.textContent = 'Clear All';
    confirmBtn.onclick = _executeClearBlueprint;
  }
  if (cancelBtn) {
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = closeShopConfirm;
  }
  modal.setAttribute('aria-labelledby', 'modal-confirm-title');
  modal.classList.remove('is-hidden');
  if (typeof _openModal === 'function') _openModal(modal);
}

function _executeClearBlueprint() {
  closeShopConfirm();
  const confirmBtn = document.querySelector('#shop-confirm-modal .btn--primary');
  if (confirmBtn) { confirmBtn.textContent = 'Confirm'; confirmBtn.onclick = confirmShopBuy; }
  clearBlueprint();
  renderBlueprint();
  toast('Blueprint cleared.', 'ok');
}

function openSpellPicker() {
  renderSpellPicker();
  const panel = document.getElementById('spell-picker-panel');
  panel.classList.add('is-open');
  document.getElementById('spell-picker').scrollTop = 0;
  if (typeof _openModal === 'function') _openModal(panel);
}

function closeSpellPicker() {
  const panel = document.getElementById('spell-picker-panel');
  if (typeof _closeModal === 'function') _closeModal(panel);
  panel.classList.remove('is-open');
}

onScreen('order', renderBlueprint);