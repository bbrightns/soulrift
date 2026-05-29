/* ============================================================
   SOULRIFT — /js/tower.js
   First-run tower selection and name flow.
   ============================================================ */

'use strict';

let _pendingTower = null;

const TOWER_UI = {
  light: { lucide: 'sun',     name: 'Light Tower' },
  dark:  { lucide: 'moon',    name: 'Dark Tower'  },
  fire:  { lucide: 'flame',   name: 'Fire Tower'  },
  ice:   { lucide: 'diamond', name: 'Ice Tower'   },
};

function chooseTower(tower) {
  const info = TOWER_UI[tower];
  if (!info) return;
  _pendingTower = tower;

  const gEl = document.getElementById('intro-chosen-glyph');
  const nEl = document.getElementById('intro-chosen-name');
  if (gEl) {
    gEl.innerHTML = `<i data-lucide="${info.lucide}"></i>`;
    lucide.createIcons();
  }
  if (nEl) nEl.textContent = info.name;

  const app = document.getElementById('app');
  if (app) app.dataset.tower = tower;

  document.getElementById('intro-tower-step')?.classList.add('is-hidden');
  document.getElementById('intro-name-step')?.classList.add('is-visible');

  const inp = document.getElementById('player-name-input');
  if (inp) {
    inp.value = '';
    setTimeout(() => inp.focus(), 120);
  }
}

function confirmStart() {
  if (!_pendingTower) return;

  const inp = document.getElementById('player-name-input');
  const name = (inp && inp.value.trim()) ? inp.value.trim() : 'Arcane Wanderer';
  applyTowerStart(_pendingTower, name);

  hideIntro();
  syncHeader();
  showScreen('battle');
  toast(name + ' enters ' + TOWER_UI[_pendingTower].name + '.', 'gold', 3200);
}

function backToTowerSelect() {
  _pendingTower = null;
  document.getElementById('intro-name-step')?.classList.remove('is-visible');
  document.getElementById('intro-tower-step')?.classList.remove('is-hidden');

  const app = document.getElementById('app');
  if (app) app.removeAttribute('data-tower');
}

function initTowerFlow() {
  const inp = document.getElementById('player-name-input');
  if (inp) {
    inp.addEventListener('keydown', event => {
      if (event.key === 'Enter') confirmStart();
    });
  }
}
