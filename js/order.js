/* ============================================================
   SOULRIFT — /js/order.js
   10-turn battle blueprint setup from owned spell stones.
   Blueprint slots store spellId only. Inventory is never consumed.
   ============================================================ */

'use strict';

let _selectedBlueprintSlot = 0;
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

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

  // Stale slot validation: clear slots whose spell is no longer owned
  bp.forEach((spellId, i) => {
    if (!spellId) return;
    const baseId = spellId.split('|')[0];
    const owned = getSpells().find(s => s.id === baseId && s.qty >= 1);
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

    slot.innerHTML = '<span class="blueprint-slot__turn">' + ROMAN[i] + '</span>'
      + spellSpan
      + '<span class="blueprint-slot__cost">' + (def ? 'SP ' + def.spCost : '') + '</span>'
      + '<span class="blueprint-slot__clear" onclick="event.stopPropagation(); clearBlueprintSlot(' + i + ')" title="Clear slot">✕</span>';

    grid.appendChild(slot);
  });

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
        + '<span class="spell-picker__name">' + option.name + lvlBadge + '<span class="spell-picker__meta">SP ' + option.spCost + '</span></span>'
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

function openSpellPicker() {
  renderSpellPicker();
  const panel = document.getElementById('spell-picker-panel');
  panel.classList.add('is-open');
  document.getElementById('spell-picker').scrollTop = 0;
}

function closeSpellPicker() {
  document.getElementById('spell-picker-panel').classList.remove('is-open');
}

onScreen('order', renderBlueprint);