/* ── GM Developer Panel ────────────────────────────────────── */
(function () {
  var _pressTimer = null;

  function _initLongPress() {
    var logo = document.getElementById('logo-title');
    if (!logo) return;

    logo.addEventListener('pointerdown', function () {
      _pressTimer = setTimeout(openGMPanel, 1200);
    });
    logo.addEventListener('pointerup', function () {
      clearTimeout(_pressTimer);
    });
    logo.addEventListener('pointerleave', function () {
      clearTimeout(_pressTimer);
    });
    logo.addEventListener('contextmenu', function (e) {
      e.preventDefault();
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
    if (document.getElementById('gm-sp-input')) {
      document.getElementById('gm-sp-input').value = (state.player && state.player.skillPoints != null) ? state.player.skillPoints : 0;
    }
    var currentSpeed = (state.settings && state.settings.battleSpeed) || 'normal';
    document.querySelectorAll('.gm-speed-btn').forEach(function(b) {
      b.classList.toggle('is-active', b.dataset.speed === currentSpeed);
    });
    document.getElementById('gm-panel').classList.add('is-open');
  }

  function closeGMPanel() {
    document.getElementById('gm-panel').classList.remove('is-open');
  }

  function gmQuickAddGold() {
    var state = getState();
    state.gold = (state.gold || 0) + 1000;
    saveState();
    syncHeader();
    document.getElementById('gm-gold-input').value = state.gold;
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('+1,000 Gold added', 'gold');
  }

  function gmQuickAddLevels() {
    var state = getState();
    var val = Math.min(99, (state.player.level || 1) + 10);
    state.player.level = val;
    state.player.expNext = Math.floor(100 * Math.pow(1.25, val - 1));
    if (typeof recalculatePlayerStats === 'function') recalculatePlayerStats();
    state.player.hp = state.player.hpMax;
    state.player.sp = state.player.spMax;
    saveState();
    syncHeader();
    document.getElementById('gm-level-input').value = val;
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('+10 Levels added (Level ' + val + ')', 'ok');
  }

  function gmQuickMaxStats() {
    var state = getState();
    state.player.level = 99;
    state.player.expNext = Math.floor(100 * Math.pow(1.25, 98));
    state.player.spentPoints = { str: 100, int: 100, atk: 100, def: 100 };
    if (typeof recalculatePlayerStats === 'function') recalculatePlayerStats();
    state.player.hp = state.player.hpMax;
    state.player.sp = state.player.spMax;
    saveState();
    syncHeader();
    document.getElementById('gm-level-input').value = 99;
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Stats maximized (Level 99)', 'ok');
  }

  function gmQuickFullHeal() {
    var state = getState();
    state.player.hp = state.player.hpMax;
    state.player.sp = state.player.spMax;
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('HP and SP fully restored', 'ok');
  }

  function gmQuickResetStats() {
    var state = getState();
    state.player.spentPoints = { str: 0, int: 0, atk: 0, def: 0 };
    if (typeof recalculatePlayerStats === 'function') recalculatePlayerStats();
    state.player.hp = state.player.hpMax;
    state.player.sp = state.player.spMax;
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Allocated stats reset and refunded', 'ok');
  }

  function gmSetGold() {
    var val = parseInt(document.getElementById('gm-gold-input').value, 10);
    if (isNaN(val) || val < 0) return;
    var state = getState();
    state.gold = val;
    saveState();
    syncHeader();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Gold set to ' + val.toLocaleString(), 'gold');
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
    var sel = document.getElementById('gm-spell-select');
    var spellName = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : spellId;
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Added ' + qty + 'x ' + spellName + ' (Lv.' + level + ')', 'ok');
  }

  function gmSetLevel() {
    var val = parseInt(document.getElementById('gm-level-input').value, 10);
    if (isNaN(val) || val < 1 || val > 99) return;
    var state = getState();
    state.player.level  = val;
    state.player.expNext = expNeededForLevel(val);
    if (typeof recalculatePlayerStats === 'function') recalculatePlayerStats();
    state.player.hp = state.player.hpMax;
    state.player.sp = state.player.spMax;
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Level set to ' + val, 'ok');
  }

  function gmSetSkillPoints() {
    var val = parseInt(document.getElementById('gm-sp-input').value, 10);
    if (isNaN(val) || val < 0) return;
    var state = getState();
    state.player.skillPoints = val;
    saveState();
    syncHeader();
    var profPanel = document.getElementById('profile-panel');
    if (profPanel && profPanel.classList.contains('is-open')) renderProfilePanel();
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Skill points set to ' + val, 'ok');
  }
  window.gmSetSkillPoints = gmSetSkillPoints;

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
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('EXP set to ' + val, 'ok');
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
    if (window.SFX) SFX.buy();
    if (typeof toast === 'function') toast('Battle speed set to ' + speed.toUpperCase(), 'ok');
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
  window.gmQuickAddGold   = gmQuickAddGold;
  window.gmQuickAddLevels = gmQuickAddLevels;
  window.gmQuickMaxStats  = gmQuickMaxStats;
  window.gmQuickFullHeal  = gmQuickFullHeal;
  window.gmQuickResetStats = gmQuickResetStats;
})();
