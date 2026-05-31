/* ── GM Developer Panel ────────────────────────────────────── */
(function () {
  var _pressTimer = null;

  function _initLongPress() {
    var logo = document.getElementById('logo-title');
    if (!logo) return;

    logo.addEventListener('pointerdown', function () {
      _pressTimer = setTimeout(openGMPanel, 2000);
    });
    logo.addEventListener('pointerup', function () {
      clearTimeout(_pressTimer);
    });
    logo.addEventListener('pointerleave', function () {
      clearTimeout(_pressTimer);
    });
  }

  function _populateSpells() {
    var sel = document.getElementById('gm-spell-select');
    if (!sel || sel.options.length > 0) return;

    var towers = ['light', 'dark', 'fire', 'ice'];
    towers.forEach(function (tower) {
      var spells = getSpellsByTower(tower);
      if (!spells.length) return;
      var group = document.createElement('optgroup');
      group.label = tower.charAt(0).toUpperCase() + tower.slice(1);
      spells.forEach(function (spell) {
        var opt = document.createElement('option');
        opt.value = spell.id;
        opt.textContent = spell.name;
        group.appendChild(opt);
      });
      sel.appendChild(group);
    });
  }

  function openGMPanel() {
    _populateSpells();
    var state = getState();
    document.getElementById('gm-gold-input').value = state.gold != null ? state.gold : 0;
    document.getElementById('gm-level-input').value = (state.player && state.player.level) ? state.player.level : 1;
    document.getElementById('gm-panel').classList.add('is-open');
  }

  function closeGMPanel() {
    document.getElementById('gm-panel').classList.remove('is-open');
  }

  function gmSetGold() {
    var val = parseInt(document.getElementById('gm-gold-input').value, 10);
    if (isNaN(val) || val < 0) return;
    var state = getState();
    state.gold = val;
    saveState();
    syncHeader();
  }

  function gmAddSpellStone() {
    var spellId = document.getElementById('gm-spell-select').value;
    var level   = parseInt(document.getElementById('gm-spell-level').value, 10);
    var qty     = parseInt(document.getElementById('gm-spell-qty').value, 10) || 1;
    if (!spellId || isNaN(level)) return;
    for (var i = 0; i < qty; i++) {
      giveSpell(spellId, level);
    }
    renderInventory();
    renderItems();
  }

  function gmSetLevel() {
    var val = parseInt(document.getElementById('gm-level-input').value, 10);
    if (isNaN(val) || val < 1 || val > 99) return;
    var state = getState();
    var delta = val - state.player.level;
    state.player.level  = val;
    state.player.hpMax += delta * 6;
    state.player.spMax += delta * 3;
    state.player.atk   += delta;
    state.player.def   += delta;
    state.player.expNext = Math.floor(100 * Math.pow(1.25, val - 1));
    state.player.hp = Math.min(state.player.hp, state.player.hpMax);
    state.player.sp = Math.min(state.player.sp, state.player.spMax);
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
  }

  function gmResetAll() {
    if (window.confirm('Reset ALL game data? This cannot be undone.')) {
      localStorage.clear();
      location.reload();
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeGMPanel();
  });

  document.addEventListener('DOMContentLoaded', _initLongPress);

  window.openGMPanel      = openGMPanel;
  window.closeGMPanel     = closeGMPanel;
  window.gmSetGold        = gmSetGold;
  window.gmAddSpellStone  = gmAddSpellStone;
  window.gmSetLevel       = gmSetLevel;
  window.gmResetAll       = gmResetAll;
})();
