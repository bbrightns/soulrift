/* ============================================================
   SOULRIFT — /js/app.js
   Final boot and tiny global helpers.
   ============================================================ */

'use strict';

function battlePlayerName() {
  return getPlayerName();
}

function resetGame() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  closeProfilePanel();
  resetState();
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  initTowerFlow();
  bootApp();

  const tower = getState().tower;
  const app = document.getElementById('app');
  if (tower && app) app.dataset.tower = tower;
});
