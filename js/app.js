/* ============================================================
   SOULRIFT — /js/app.js
   Final boot and tiny global helpers.
   ============================================================ */

'use strict';

function resetGame() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  closeProfilePanel();
  resetState();
  location.reload();
}

function resetSpentStats() {
  if (!confirm('Reset all allocated stats and refund skill points?')) return;
  const s = getState();
  s.player.spentPoints = { str: 0, int: 0, atk: 0, def: 0 };
  recalculatePlayerStats();
  s.player.hp = s.player.hpMax;
  s.player.sp = s.player.spMax;
  saveState();
  if (typeof syncHeader === 'function') syncHeader();
  if (typeof renderProfilePanel === 'function') renderProfilePanel();
  if (window.SFX) SFX.buy();
  if (typeof toast === 'function') toast('Allocated stats reset and refunded', 'ok');
}

/* Silently fix EXP/level mismatch on load (no SFX, no overlay) */
function reconcilePlayerLevel() {
  const s = getState();
  if (!s.towerChosen) return; // no tower yet, skip
  // Always recompute from level — single source of truth (Logic B)
  s.player.expNext = expNeededForLevel(s.player.level);
  let changed = false;
  let guard = 0;
  while (s.player.exp >= s.player.expNext && guard < 200) {
    guard++;
    s.player.exp -= s.player.expNext;
    s.player.level += 1;
    s.player.expNext = expNeededForLevel(s.player.level);
    changed = true;
  }
  if (changed) {
    recalculatePlayerStats();
    saveState();
    if (typeof syncHeader === 'function') syncHeader();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTowerFlow();
  bootApp();
  reconcilePlayerLevel();
  if (typeof initSyncListeners === 'function') initSyncListeners();

  const tower = getState().tower;
  const app = document.getElementById('app');
  if (tower && app) app.dataset.tower = tower;
});
