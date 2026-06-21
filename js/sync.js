'use strict';

const BACKEND_URL = 'https://soulrift-backend.vercel.app';

let _syncInFlight = false;
let _syncQueued = false;
let _syncOnSignInDone = false;

/* ── Helpers ─────────────────────────────────────────────── */
function _authHeaders() {
  const token = typeof getAuthToken === 'function' ? getAuthToken() : null;
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
  };
}

function _localSavedAt() {
  try {
    const raw = localStorage.getItem('soulrift_v1');
    if (!raw) return null;
    return JSON.parse(raw).savedAt || null;
  } catch { return null; }
}

function _fmtDate(ts) {
  if (!ts) return 'unknown date';
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Cloud push ──────────────────────────────────────────── */
async function syncToCloud() {
  if (typeof isSignedIn === 'function' && !isSignedIn()) {
    _syncOnSignInDone = true;
    return;
  }

  if (!_syncOnSignInDone) {
    _syncQueued = true;
    return;
  }

  const headers = _authHeaders();
  if (!headers) return;

  if (_syncInFlight) {
    _syncQueued = true;
    return;
  }

  _syncInFlight = true;
  _syncQueued = false;

  try {
    const raw = localStorage.getItem('soulrift_v1');
    if (!raw) return;

    const res = await fetch(BACKEND_URL + '/api/save', {
      method: 'POST',
      headers,
      body: raw,
    });

    if (res.status === 401) {
      _showCloudPauseBanner();
      return;
    }

    if (!res.ok) {
      console.warn('[sync] Push failed:', res.status);
    }
  } catch (e) {
    console.info('[sync] Push skipped (offline?):', e.message);
  } finally {
    _syncInFlight = false;
    if (_syncQueued) {
      _syncQueued = false;
      syncToCloud();
    }
  }
}

/* ── Cloud pull ──────────────────────────────────────────── */
async function _fetchCloudSave() {
  const headers = _authHeaders();
  if (!headers) return null;
  try {
    const res = await fetch(BACKEND_URL + '/api/save', { headers });
    if (!res.ok) return null;
    const json = await res.json();
    return json.save || null;
  } catch { return null; }
}

/* ── Main sign-in sync ───────────────────────────────────── */
async function syncOnSignIn() {
  if (typeof isSignedIn === 'function' && !isSignedIn()) return;

  const cloudBlob = await _fetchCloudSave();

  // Scenario C — fresh google account, no cloud save
  if (!cloudBlob || !cloudBlob.towerChosen) {
    _syncOnSignInDone = true;
    syncToCloud();
    return;
  }

  const localRaw = localStorage.getItem('soulrift_v1');
  const localBlob = localRaw ? JSON.parse(localRaw) : null;

  // Local is a fresh state — load cloud silently
  if (!localBlob || !localBlob.towerChosen) {
    _applyCloudSave(cloudBlob);
    return;
  }

  // Saves are already equivalent — nothing to resolve, no overlay needed.
  // (Covers: re-login after a previous conflict choice, or two devices
  // that happen to be in sync.)
  const cloudScore = calcProgressScore(cloudBlob);
  const localScore = calcProgressScore(localBlob);
  if (cloudScore === localScore) {
    _syncOnSignInDone = true;
    return;
  }

  // Scenario D — saves genuinely differ, show conflict UI
  _syncOnSignInDone = false;
  showConflictOverlay(cloudBlob, localBlob);
}

/* ── Conflict resolution ─────────────────────────────────── */
let _conflictCloud = null;
let _conflictLocal = null;
let _conflictPending = null; // 'cloud' | 'local'

function showConflictOverlay(cloudBlob, localBlob) {
  _conflictCloud = cloudBlob;
  _conflictLocal = localBlob;

  const cloudScore = calcProgressScore(cloudBlob);
  const localScore = calcProgressScore(localBlob);
  const cloudIsMore = cloudScore >= localScore;

  _populateConflictCard('cloud', cloudBlob, cloudIsMore ? 'more' : 'less');
  _populateConflictCard('local', localBlob, cloudIsMore ? 'less' : 'more');

  const overlay = document.getElementById('conflict-overlay');
  if (overlay) {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function _populateConflictCard(side, blob, badge) {
  const p = blob.player || {};
  const tower = blob.tower || '';
  const towerNames = { light: 'Light Tower', dark: 'Dark Tower', fire: 'Fire Tower', ice: 'Ice Tower' };
  const avatarKey = blob.playerAvatar || (tower + '_1');

  const avatarEl = document.getElementById('conflict-' + side + '-avatar');
  if (avatarEl) {
    avatarEl.innerHTML = '<img src="/asset/player_avatars/' + avatarKey + '.png" alt="">';
  }

  const set = (id, val) => {
    const el = document.getElementById('conflict-' + side + '-' + id);
    if (el) el.textContent = val;
  };

  set('tower', towerNames[tower] || '—');
  set('name', blob.playerName || 'Wanderer');
  set('level', 'Level ' + (p.level || 1));

  const badgeEl = document.getElementById('conflict-' + side + '-badge');
  if (badgeEl) {
    badgeEl.textContent = badge === 'more' ? 'More Progress ↑' : 'Less Progress';
    badgeEl.className = 'conflict-card__badge conflict-card__badge--' + badge;
  }
}

function conflictChoose(side) {
  _conflictPending = side;
  const other = side === 'cloud' ? 'local' : 'cloud';
  const blob = side === 'cloud' ? _conflictCloud : _conflictLocal;
  const otherBlob = side === 'cloud' ? _conflictLocal : _conflictCloud;
  const p = otherBlob.player || {};
  const towerNames = { light: 'Light Tower', dark: 'Dark Tower', fire: 'Fire Tower', ice: 'Ice Tower' };

  const modal = document.getElementById('conflict-confirm-modal');
  const body = document.getElementById('conflict-confirm-body');
  if (!modal || !body) return;

  const lostSide = other === 'cloud' ? 'Cloud' : 'Local';
  const lostName = otherBlob.playerName || 'Wanderer';
  const lostTower = towerNames[otherBlob.tower] || '—';
  const lostLevel = p.level || 1;

  body.innerHTML =
    '<div class="modal-icon">' + (other === 'cloud' ? '☁' : '◆') + '</div>'
    + '<div class="modal-title modal-title--bad">Are you sure?</div>'
    + '<div class="modal-body">Your <strong>' + lostSide + ' save</strong> will be permanently deleted.</div>'
    + '<div class="modal-hint">'
    + lostTower + ' · ' + lostName + ' · Level ' + lostLevel
    + '<br>This cannot be undone.'
    + '</div>';

  modal.classList.remove('is-hidden');
}

function conflictConfirmOk() {
  const modal = document.getElementById('conflict-confirm-modal');
  if (modal) modal.classList.add('is-hidden');

  if (_conflictPending === 'cloud') {
    _applyCloudSave(_conflictCloud);
  } else {
    _syncOnSignInDone = true;
    _hideConflictOverlay();
    syncToCloud();
  }
  _conflictPending = null;
}

function conflictConfirmCancel() {
  const modal = document.getElementById('conflict-confirm-modal');
  if (modal) modal.classList.add('is-hidden');
  _conflictPending = null;
}

function conflictCancel() {
  // stay signed out, cloud untouched
  if (typeof signOut === 'function') signOut();
  _syncOnSignInDone = true;
  _hideConflictOverlay();
}

function _hideConflictOverlay() {
  const overlay = document.getElementById('conflict-overlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

/* ── Apply cloud save ────────────────────────────────────── */
function _applyCloudSave(cloudBlob) {
  try {
    if (typeof loadExternalState === 'function') {
      loadExternalState(cloudBlob);   // updates in-memory _state AND localStorage
    } else {
      localStorage.setItem('soulrift_v1', JSON.stringify(cloudBlob));
    }
    location.reload();
  } catch (e) {
    console.error('[sync] Failed to apply cloud save:', e);
  }
}

/* ── Cloud pause banner ──────────────────────────────────── */
function _showCloudPauseBanner() {
  const banner = document.getElementById('cloud-pause-banner');
  if (banner) banner.classList.remove('is-hidden');
}

function cloudPauseTap() {
  const banner = document.getElementById('cloud-pause-banner');
  if (banner) banner.classList.add('is-hidden');
  if (typeof signIn === 'function') signIn();
}

/* ── Background triggers ─────────────────────────────────── */
function initSyncListeners() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') syncToCloud();
  });
  window.addEventListener('beforeunload', () => {
    syncToCloud();
  });
}

/* ── Auth event ──────────────────────────────────────────── */
window.addEventListener('soulrift:authchange', (e) => {
  if (e.detail && e.detail.signedIn) {
    // During an OAuth-redirect boot, auth.js's sequential flow owns this
    // call (see _bootAuth) so the loading screen can wait on it properly.
    if (document.documentElement.classList.contains('oauth-pending')) return;
    syncOnSignIn();
  }
});

/* ── Exports ─────────────────────────────────────────────── */
window.syncToCloud = syncToCloud;
window.syncOnSignIn = syncOnSignIn;
window.initSyncListeners = initSyncListeners;
window.showConflictOverlay = showConflictOverlay;
window.conflictChoose = conflictChoose;
window.conflictConfirmOk = conflictConfirmOk;
window.conflictConfirmCancel = conflictConfirmCancel;
window.conflictCancel = conflictCancel;
window.cloudPauseTap = cloudPauseTap;