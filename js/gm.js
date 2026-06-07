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
    document.getElementById('gm-gold-input').value  = state.gold != null ? state.gold : 0;
    document.getElementById('gm-level-input').value = (state.player && state.player.level) ? state.player.level : 1;
    document.getElementById('gm-exp-input').value   = (state.player && state.player.exp   != null) ? state.player.exp : 0;
    var currentSpeed = (state.settings && state.settings.battleSpeed) || 'normal';
    document.querySelectorAll('.gm-speed-btn').forEach(function(b) {
      b.classList.toggle('is-active', b.dataset.speed === currentSpeed);
    });
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
    state.player.hpMax = Math.max(10, state.player.hpMax + delta * 6);
    state.player.spMax = Math.max(10, state.player.spMax + delta * 3);
    state.player.atk   = Math.max(1, state.player.atk + delta);
    state.player.def   = Math.max(0, state.player.def + delta);
    state.player.expNext = Math.floor(100 * Math.pow(1.25, val - 1));
    state.player.hp = Math.min(state.player.hpMax, Math.max(0, state.player.hp));
    state.player.sp = Math.min(state.player.spMax, Math.max(0, state.player.sp));
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
  }

  function gmSetExp() {
    var val = parseInt(document.getElementById('gm-exp-input').value, 10);
    if (isNaN(val) || val < 0) return;
    var state = getState();
    state.player.exp = val;
    /* run level-up loop in case new exp exceeds threshold */
    if (typeof gainExp === 'function') {
      state.player.exp = 0;           /* gainExp will add it fresh */
      gainExp(val);
    } else {
      saveState();
    }
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    /* refresh displayed value to reflect actual exp after level-ups */
    document.getElementById('gm-exp-input').value = getState().player.exp;
  }

  function gmSetSpeed(speed) {
    var state = getState();
    if (!state.settings) state.settings = {};
    state.settings.battleSpeed = speed;
    saveState();
    var btns = document.querySelectorAll('.gm-speed-btn');
    btns.forEach(function(b) {
      b.classList.toggle('is-active', b.dataset.speed === speed);
    });
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
  window.gmSetSpeed       = gmSetSpeed;
  window.closeGMPanel     = closeGMPanel;
  window.gmSetGold        = gmSetGold;
  window.gmAddSpellStone  = gmAddSpellStone;
  window.gmSetLevel       = gmSetLevel;
  window.gmSetExp         = gmSetExp;
  window.gmResetAll       = gmResetAll;
})();
