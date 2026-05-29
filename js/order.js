/* ============================================================
   SOULRIFT — order.js
   10-turn battle blueprint setup from owned spell stones.
   Blueprint slots store spellId only. Inventory is never consumed.
   ============================================================ */

'use strict';

let _selectedBlueprintSlot = 0;

function getOwnedSpellOptions() {
  const options = [];
  getSpells().forEach(stone => {
    if (!stone || !stone.id || stone.qty < 1) return;
    const def = window.getSpellDef ? getSpellDef(stone.id) : null;
    if (!def) return;
    options.push({
      id: stone.id,
      lvl: stone.lvl || 1,
      key: stone.id + '_lv' + (stone.lvl || 1),
      name: def.name,
      role: def.role,
      spCost: def.spCost,
      tower: def.tower,
      qty: stone.qty,
    });
  });
  options.sort((a, b) => a.name.localeCompare(b.name) || b.lvl - a.lvl);
  return options;
}

function renderBlueprint() {
  const bp = getBlueprint();
  const grid = document.getElementById('blueprint-grid');
  if (!grid) return;

  grid.innerHTML = '';
  bp.forEach((spellId, i) => {
    const parts = spellId ? spellId.split('|') : [];
    const baseId = parts[0] || null;
    const slotLvl = parseInt(parts[1]) || 1;
    const def = baseId && window.getSpellDef ? getSpellDef(baseId) : null;
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'card card--raised blueprint-slot' + (i === _selectedBlueprintSlot ? ' is-selected' : '');
    slot.onclick = () => selectBlueprintSlot(i);

    slot.innerHTML = '<span class="blueprint-slot__turn">T' + (i + 1) + '</span>'
      + '<span class="blueprint-slot__spell">' + (def ? def.name + (slotLvl > 1 ? ' <small>Lv' + slotLvl + '</small>' : '') : (spellId || 'Empty')) + '</span>'
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

function assignSpellToSelectedSlot(spellId, lvl) {
  const val = (spellId && lvl) ? spellId + '|' + lvl : null;
  setBlueprintSlot(_selectedBlueprintSlot, val);
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
      const active = option.key === current ? ' is-selected' : '';
      const lvlBadge = ' <span class="badge badge--lv">Lv ' + option.lvl + '</span>';
      return '<button type="button" class="spell-picker__option' + active + '" onclick="assignSpellToSelectedSlot(\'' + option.id + '\',' + option.lvl + ')">'
        + '<span class="spell-picker__name">' + option.name + lvlBadge + '</span>'
        + '<span class="spell-picker__meta">SP ' + option.spCost + ' · owned ×' + option.qty + '</span>'
        + '</button>';
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
