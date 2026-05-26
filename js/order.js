/* ============================================================
   SOULRIFT — order.js
   10-turn battle blueprint setup from owned spell stones.
   Blueprint slots store spellId only. Inventory is never consumed.
   ============================================================ */

'use strict';

let _selectedBlueprintSlot = 0;

function getOwnedSpellOptions() {
  const byId = new Map();
  getSpells().forEach(stone => {
    if (!stone || !stone.id || byId.has(stone.id)) return;
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    byId.set(stone.id, {
      id: stone.id,
      name: def ? def.name : stone.id,
      role: def ? def.role : 'Spell Stone',
      spCost: def ? def.spCost : 0,
      tower: def ? def.tower : 'gold',
      qty: stone.qty,
    });
  });
  return Array.from(byId.values());
}

function renderBlueprint() {
  const bp = getBlueprint();
  const grid = document.getElementById('blueprint-grid');
  if (!grid) return;

  grid.innerHTML = '';
  bp.forEach((spellId, i) => {
    const def = window.getSpellDef ? getSpellDef(spellId) : null;
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'card card--raised blueprint-slot' + (i === _selectedBlueprintSlot ? ' is-selected' : '');
    slot.onclick = () => selectBlueprintSlot(i);

    slot.innerHTML = '<span class="blueprint-slot__turn">T' + (i + 1) + '</span>'
      + '<span class="blueprint-slot__spell">' + (def ? def.name : (spellId || 'Empty - Struggle')) + '</span>'
      + '<span class="blueprint-slot__cost">' + (def ? 'SP ' + def.spCost : '-') + '</span>';

    grid.appendChild(slot);
  });

  renderBlueprintSummary();
  renderSpellPicker();
}

function selectBlueprintSlot(index) {
  _selectedBlueprintSlot = index;
  renderBlueprint();
}

function assignSpellToSelectedSlot(spellId) {
  setBlueprintSlot(_selectedBlueprintSlot, spellId || null);
  renderBlueprint();
}

function renderSpellPicker() {
  const wrap = document.getElementById('spell-picker');
  if (!wrap) return;

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
  wrap.innerHTML = '<div class="section-label" style="margin-top:var(--sp-4);">Assign Turn ' + (_selectedBlueprintSlot + 1) + '</div>'
    + '<div class="spell-picker__grid">'
    + options.map(option => {
      const active = option.id === current ? ' is-selected' : '';
      return '<button type="button" class="spell-picker__option' + active + '" onclick="assignSpellToSelectedSlot(\'' + option.id + '\')">'
        + '<span class="spell-picker__name">' + option.name + '</span>'
        + '<span class="spell-picker__meta">SP ' + option.spCost + ' · owned x' + option.qty + '</span>'
        + '</button>';
    }).join('')
    + '<button type="button" class="spell-picker__option" onclick="assignSpellToSelectedSlot(null)">'
      + '<span class="spell-picker__name">Empty - Struggle</span>'
      + '<span class="spell-picker__meta">No SP cost</span>'
    + '</button>'
    + '</div>';
}

function renderBlueprintSummary() {
  const wrap = document.getElementById('blueprint-summary');
  if (!wrap) return;

  const totalSp = getBlueprint().reduce((sum, spellId) => {
    const def = window.getSpellDef ? getSpellDef(spellId) : null;
    return sum + (def ? def.spCost : 0);
  }, 0);
  const player = getPlayer();
  const warning = totalSp > player.spMax
    ? '<span class="c-bad">SP risk: later turns may Struggle</span>'
    : '<span class="c-ok">Within max SP</span>';

  wrap.innerHTML = '<div class="card card--raised row row--between row--gap-3">'
    + '<span class="spell-card__meta">Estimated sequence cost</span>'
    + '<span class="stat-row__val stat-row__val--gold">' + totalSp + ' / ' + player.spMax + ' SP · ' + warning + '</span>'
    + '</div>';
}

function clearBlueprintAndRender() {
  clearBlueprint();
  renderBlueprint();
}

onScreen('order', renderBlueprint);
