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

/* Silently fix EXP/level mismatch on load (no SFX, no overlay) */
function reconcilePlayerLevel() {
  const s = getState();
  if (!s.towerChosen) return; // no tower yet, skip
  if (!s.player.expNext || s.player.expNext < 1) {
    s.player.expNext = Math.floor(100 * Math.pow(1.25, Math.max(0, s.player.level - 1)));
  }
  let changed = false;
  let guard = 0;
  while (s.player.exp >= s.player.expNext && guard < 200) {
    guard++;
    s.player.exp -= s.player.expNext;
    s.player.level += 1;
    s.player.expNext = Math.max(1, Math.floor(s.player.expNext * 1.25));
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

  const tower = getState().tower;
  const app = document.getElementById('app');
  if (tower && app) app.dataset.tower = tower;
});
