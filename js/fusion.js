/* /js/fusion.js */
'use strict';

/* ── Constants ───────────────────────────────────────── */
const FUSION_RATES = [0, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10];
const FUSION_GOLD  = [0,   50,  50,  50, 150, 150, 150, 400, 400, 800];
const CATALYST_BONUS = { catalyst_shard: 0.15, catalyst_core: 0.30, catalyst_crystal: 0.50 };
const MAX_SPELL_LEVEL = 10;

let _fusionSpellId   = null;
let _fusionSpellLvl  = null;
let _fusionCatalyst  = null;

/* ── Tower helpers ───────────────────────────────────── */
function _towerColor(tower) {
  return { light: 'var(--c-light)', dark: 'var(--c-dark)', fire: 'var(--c-fire)', ice: 'var(--c-ice)' }[tower]
    || 'var(--c-gold)';
}

/* ── Render ──────────────────────────────────────────── */
function renderFusion() {
  _fusionSpellId  = null;
  _fusionSpellLvl = null;
  _fusionCatalyst = null;
  renderFusionSpellList();
  renderFusionCatalystList();
  _updateCrucibleSlots();
  _updateCatalystDisplay();
  renderFusionPanel();
}

function renderFusionSpellList() {
  const wrap = document.getElementById('fusion-spell-list');
  if (!wrap) return;

  const tower  = getTower();
  const spells = getSpells().filter(s => {
    const def = getSpellDef(s.id);
    return def && def.tower === tower && s.qty >= 2 && s.lvl < MAX_SPELL_LEVEL;
  });

  if (!spells.length) {
    wrap.innerHTML = '<div class="fusion-no-stones">No spells ready to fuse.<br><small>Need ×2 copies at the same level.</small></div>';
    return;
  }

  wrap.innerHTML = spells.map(s => {
    const def    = getSpellDef(s.id);
    const active = _fusionSpellId === s.id && _fusionSpellLvl === s.lvl;
    const color  = _towerColor(def.tower);
    return '<div class="fusion-stone-card' + (active ? ' is-active' : '') + '" '
      + 'onclick="selectFusionSpell(\'' + s.id + '\',' + s.lvl + ')">'
      + (active ? '<div class="fusion-stone-card__sel">SEL</div>' : '')
      + '<div class="fusion-stone-card__name">' + def.name + '</div>'
      + '<div class="fusion-stone-card__lv">LV.' + s.lvl + '</div>'
      + '<div class="fusion-stone-card__qty">×' + s.qty + '</div>'
      + '</div>';
  }).join('');
}

function renderFusionCatalystList() {
  const wrap = document.getElementById('fusion-catalyst-list');
  if (!wrap) return;

  const items = (getState().items || []).filter(i => CATALYST_BONUS[i.id] && i.qty > 0);

  if (!items.length) {
    wrap.innerHTML = '<div class="fusion-no-catalyst">No catalysts owned.<br><small>Buy from Market or find in dungeons.</small></div>';
    return;
  }

  wrap.innerHTML = items.map(i => {
    const active = _fusionCatalyst === i.id;
    const bonus  = '+' + Math.round(CATALYST_BONUS[i.id] * 100) + '%';
    return '<button class="fusion-cat-btn' + (active ? ' is-active' : '') + '" '
      + 'onclick="selectFusionCatalyst(\'' + i.id + '\')">'
      + formatCatalystName(i.id)
      + ' <span class="fusion-cat-bonus">' + bonus + '</span>'
      + ' <span style="opacity:0.5">×' + i.qty + '</span>'
      + '</button>';
  }).join('');
}

function formatCatalystName(id) {
  return { catalyst_shard: '🟤 Shard', catalyst_core: '🔵 Core', catalyst_crystal: '🟡 Crystal' }[id] || id;
}

function _updateCrucibleSlots() {
  const leftInner  = document.getElementById('fusion-slot-left-inner');
  const rightInner = document.getElementById('fusion-slot-right-inner');
  const badge      = document.getElementById('fusion-rate-badge');
  const badgePct   = document.getElementById('fusion-rate-badge-pct');
  const leftSlot   = document.getElementById('fusion-slot-left');
  const rightSlot  = document.getElementById('fusion-slot-right');

  const emptyHTML = '<span class="fusion-slot__empty-icon">+</span>'
    + '<span class="fusion-slot__empty-text">Select</span>';

  if (!_fusionSpellId) {
    if (leftInner)  leftInner.innerHTML  = emptyHTML;
    if (rightInner) rightInner.innerHTML = emptyHTML;
    if (leftSlot)   leftSlot.classList.remove('is-filled');
    if (rightSlot)  rightSlot.classList.remove('is-filled');
    if (badge)      badge.classList.add('is-hidden');
    return;
  }

  const def      = getSpellDef(_fusionSpellId);
  const color    = _towerColor(def ? def.tower : '');
  const baseRate = FUSION_RATES[_fusionSpellLvl] || 0;
  const catBonus = _fusionCatalyst ? (CATALYST_BONUS[_fusionCatalyst] || 0) : 0;
  const pct      = Math.round(Math.min(0.95, baseRate + catBonus) * 100);

  const slotHTML = '<div class="fusion-slot__gem" style="color:' + color + '">◆</div>'
    + '<div class="fusion-slot__lv">LV.' + _fusionSpellLvl + '</div>'
    + '<div class="fusion-slot__name">' + (def ? def.name : '') + '</div>';

  if (leftInner)  leftInner.innerHTML  = slotHTML;
  if (rightInner) rightInner.innerHTML = slotHTML;
  if (leftSlot)   leftSlot.classList.add('is-filled');
  if (rightSlot)  rightSlot.classList.add('is-filled');

  if (badge) badge.classList.remove('is-hidden');
  if (badgePct) {
    badgePct.textContent = pct + '%';
    badgePct.style.color = rateColor(pct);
  }
}

function _updateCatalystDisplay() {
  const slot = document.getElementById('fusion-cat-display');
  const txt  = document.getElementById('fusion-cat-display-text');
  if (!txt) return;
  if (!_fusionCatalyst) {
    txt.textContent = 'None';
    if (slot) slot.classList.remove('is-active');
  } else {
    const bonus = '+' + Math.round(CATALYST_BONUS[_fusionCatalyst] * 100) + '%';
    txt.textContent = formatCatalystName(_fusionCatalyst) + ' ' + bonus;
    if (slot) slot.classList.add('is-active');
  }
}

function renderFusionPanel() {
  const wrap = document.getElementById('fusion-panel');
  if (!wrap) return;

  if (!_fusionSpellId) {
    wrap.innerHTML =
      '<button class="btn btn--primary btn--full fusion-invoke-btn" disabled>INVOKE FUSION</button>'
      + '<div class="fusion-cost-hint">Select a spell stone below to begin.</div>';
    return;
  }

  const fromLvl    = _fusionSpellLvl;
  const goldCost   = FUSION_GOLD[fromLvl] || 0;
  const playerGold = getState().gold;
  const canAfford  = playerGold >= goldCost;
  const catLine    = _fusionCatalyst ? ' + 1 ' + formatCatalystName(_fusionCatalyst) : '';

  wrap.innerHTML =
    '<button class="btn btn--primary btn--full fusion-invoke-btn" '
    + (canAfford ? '' : 'disabled ')
    + 'onclick="executeFusion()">INVOKE FUSION</button>'
    + '<div class="fusion-cost-hint">Requires ' + goldCost + ' Gold' + catLine + '.'
    + (!canAfford ? ' <span style="color:var(--c-bad)">Not enough gold.</span>' : '')
    + '</div>';
}

function rateColor(pct) {
  if (pct >= 70) return 'var(--c-ok, #4caf50)';
  if (pct >= 40) return 'var(--c-gold)';
  return 'var(--c-bad, #e05050)';
}

/* ── Catalyst picker toggle ──────────────────────────── */
function toggleFusionCatalystPicker() {
  const picker = document.getElementById('fusion-catalyst-list');
  if (picker) picker.classList.toggle('is-hidden');
}

/* ── Selection ───────────────────────────────────────── */
function selectFusionSpell(id, lvl) {
  _fusionSpellId  = id;
  _fusionSpellLvl = lvl;
  renderFusionSpellList();
  _updateCrucibleSlots();
  renderFusionPanel();
}

function selectFusionCatalyst(id) {
  _fusionCatalyst = (_fusionCatalyst === id) ? null : id;
  const picker = document.getElementById('fusion-catalyst-list');
  if (picker) picker.classList.add('is-hidden');
  renderFusionCatalystList();
  _updateCatalystDisplay();
  _updateCrucibleSlots();
  renderFusionPanel();
}

/* ── Execute ─────────────────────────────────────────── */
function executeFusion() {
  if (!_fusionSpellId || _fusionSpellLvl === null) return;

  const s        = getState();
  const fromLvl  = _fusionSpellLvl;
  const toLvl    = fromLvl + 1;
  const goldCost = FUSION_GOLD[fromLvl] || 0;

  const owned = (s.spells || []).find(sp => sp.id === _fusionSpellId && sp.lvl === fromLvl);
  if (!owned || owned.qty < 2) { toast('Need 2 copies to fuse.', 'bad'); return; }
  if (s.gold < goldCost)       { toast('Not enough Gold.', 'bad'); return; }

  if (_fusionCatalyst) {
    const cat = (s.items || []).find(i => i.id === _fusionCatalyst && i.qty > 0);
    if (!cat) { toast('Catalyst not found.', 'bad'); _fusionCatalyst = null; renderFusionPanel(); return; }
  }

  s.gold -= goldCost;
  if (_fusionCatalyst) {
    const cat = s.items.find(i => i.id === _fusionCatalyst);
    cat.qty--;
    if (cat.qty <= 0) s.items = s.items.filter(i => i.id !== _fusionCatalyst);
  }

  removeSpell(_fusionSpellId, fromLvl, 2);

  const baseRate = FUSION_RATES[fromLvl] || 0;
  const catBonus = _fusionCatalyst ? (CATALYST_BONUS[_fusionCatalyst] || 0) : 0;
  const rate     = Math.min(0.95, baseRate + catBonus);
  const success  = Math.random() < rate;
  const def      = getSpellDef(_fusionSpellId);

  if (success) {
    giveSpell(_fusionSpellId, toLvl);
    saveState();
    showFusionResult(true, def.name, toLvl, null);
  } else {
    if (fromLvl <= 5) {
      const downgradeLvl = Math.max(1, fromLvl - 1);
      giveSpell(_fusionSpellId, downgradeLvl);
      saveState();
      showFusionResult(false, def.name, toLvl, 'downgrade', downgradeLvl);
    } else {
      saveState();
      showFusionResult(false, def.name, toLvl, 'break', null);
    }
  }

  _fusionSpellId  = null;
  _fusionSpellLvl = null;
  _fusionCatalyst = null;
}

/* ── Result Modal ────────────────────────────────────── */
function showFusionResult(success, spellName, toLvl, failType, downgradeLvl) {
  const modal = document.getElementById('fusion-result-modal');
  const body  = document.getElementById('fusion-result-body');
  if (!modal || !body) return;

  if (success) {
    body.innerHTML = ''
      + '<div style="font-size:32px;margin-bottom:var(--sp-3)">✨</div>'
      + '<div class="c-gold" style="font-size:18px;font-weight:700">Fusion Success!</div>'
      + '<div style="margin-top:var(--sp-2)">' + spellName + ' upgraded to <strong>Lv ' + toLvl + '</strong></div>';
  } else if (failType === 'downgrade') {
    body.innerHTML = ''
      + '<div style="font-size:32px;margin-bottom:var(--sp-3)">💔</div>'
      + '<div style="color:var(--c-bad,#e05050);font-size:18px;font-weight:700">Fusion Failed</div>'
      + '<div style="margin-top:var(--sp-2)">' + spellName + ' downgraded to <strong>Lv ' + downgradeLvl + '</strong>.<br><small style="opacity:0.6">1 copy returned.</small></div>';
  } else {
    body.innerHTML = ''
      + '<div style="font-size:32px;margin-bottom:var(--sp-3)">💥</div>'
      + '<div style="color:var(--c-bad,#e05050);font-size:18px;font-weight:700">Fusion Shattered</div>'
      + '<div style="margin-top:var(--sp-2)">Both copies of ' + spellName + ' were destroyed.<br><small style="opacity:0.6">The rift consumed them.</small></div>';
  }

  modal.classList.remove('is-hidden');
}

function closeFusionResult() {
  const modal = document.getElementById('fusion-result-modal');
  if (modal) modal.classList.add('is-hidden');
  renderFusion();
  syncHeader();
}

/* ── Screen hook ─────────────────────────────────────── */
onScreen('fusion', renderFusion);

window.selectFusionSpell          = selectFusionSpell;
window.selectFusionCatalyst       = selectFusionCatalyst;
window.executeFusion              = executeFusion;
window.closeFusionResult          = closeFusionResult;
window.renderFusion               = renderFusion;
window.toggleFusionCatalystPicker = toggleFusionCatalystPicker;
