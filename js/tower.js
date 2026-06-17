'use strict';

let _pendingTower  = null;
let _pendingAvatar = null;

const TOWER_UI = {
  light: { lucide: 'sun',     name: 'Light Tower' },
  dark:  { lucide: 'moon',    name: 'Dark Tower'  },
  fire:  { lucide: 'flame',   name: 'Fire Tower'  },
  ice:   { lucide: 'diamond', name: 'Ice Tower'   },
};

function chooseTower(tower) {
  const info = TOWER_UI[tower];
  if (!info) return;
  _pendingTower  = tower;
  _pendingAvatar = tower + '_1';

  const gEl = document.getElementById('intro-chosen-glyph');
  const nEl = document.getElementById('intro-chosen-name');
  if (gEl) {
    gEl.innerHTML = '<img src="/asset/tower_icons/' + tower + '.png" alt="">';
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

function confirmName() {
  if (!_pendingTower) return;
  const inp = document.getElementById('player-name-input');
  const name = (inp && inp.value.trim()) ? inp.value.trim() : 'Arcane Wanderer';

  // store name temporarily
  _pendingName = name;

  // render avatar step
  _renderAvatarGrid(_pendingTower);
  document.getElementById('intro-name-step')?.classList.remove('is-visible');
  document.getElementById('intro-avatar-step')?.classList.add('is-visible');
}

let _pendingName = null;

function _renderAvatarGrid(tower) {
  const grid = document.getElementById('intro-avatar-grid');
  if (!grid) return;
  const count = TOWER_AVATARS.count;
  grid.innerHTML = Array.from({ length: count }, (_, i) => {
    const key = tower + '_' + (i + 1);
    const active = key === _pendingAvatar;
    return '<button class="avatar-pick-btn' + (active ? ' is-active' : '') + '"'
      + ' onclick="selectIntroAvatar(\'' + key + '\')">'
      + '<img src="/asset/player_avatars/' + key + '.png" alt="Avatar ' + (i + 1) + '">'
      + '</button>';
  }).join('');
}

function selectIntroAvatar(key) {
  _pendingAvatar = key;
  document.querySelectorAll('.avatar-pick-btn').forEach(btn => btn.classList.remove('is-active'));
  event.currentTarget.classList.add('is-active');
}

function confirmStart() {
  if (!_pendingTower || !_pendingName) return;
  applyTowerStart(_pendingTower, _pendingName, _pendingAvatar);
  hideIntro();
  syncHeader();
  showScreen('battle');
  toast(_pendingName + ' enters ' + TOWER_UI[_pendingTower].name + '.', 'gold', 3200);
  if (typeof syncToCloud === 'function') syncToCloud();
}

function backToNameStep() {
  document.getElementById('intro-avatar-step')?.classList.remove('is-visible');
  document.getElementById('intro-name-step')?.classList.add('is-visible');
}

function backToTowerSelect() {
  _pendingTower  = null;
  _pendingAvatar = null;
  _pendingName   = null;
  document.getElementById('intro-name-step')?.classList.remove('is-visible');
  document.getElementById('intro-avatar-step')?.classList.remove('is-visible');
  document.getElementById('intro-tower-step')?.classList.remove('is-hidden');

  const app = document.getElementById('app');
  if (app) app.removeAttribute('data-tower');
}

function initTowerFlow() {
  const inp = document.getElementById('player-name-input');
  if (inp) {
    inp.addEventListener('keydown', event => {
      if (event.key === 'Enter') confirmName();
    });
  }
}