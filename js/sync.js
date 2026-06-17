/*============ /js/sync.js ============
  Phase C — offline-first cloud save sync.

  PUBLIC API
  ──────────────────────────────────────
  syncToCloud()          — push local save to cloud (fire-and-forget)
  syncOnSignIn()         — called once when user signs in: compare timestamps,
                           show dialog if cloud is newer, else push silently
  initSyncListeners()    — wire up visibilitychange + beforeunload triggers
                           (called once from app.js DOMContentLoaded)

  TRIGGER POINTS (wired in Phase D into existing JS files)
  ──────────────────────────────────────
  syncToCloud() is called after:
    - Battle ended (win or lose)
    - Spell purchased (single or bulk)
    - Fusion result (success / downgrade / shatter)
    - Tower chosen (first run)
    - Player name or avatar changed
    - App backgrounded / closed (visibilitychange hidden + beforeunload)

  NOT called after:
    - Stat point allocation
    - GM panel actions
    (those ride along with the next real trigger)
=====================================================*/
'use strict';

const BACKEND_URL = 'https://soulrift-backend.vercel.app';

/* ── Internal state ───────────────────────────────────────── */
let _syncInFlight = false;
let _syncQueued   = false;   // a second push was requested while one was in flight

/* ── Helpers ──────────────────────────────────────────────── */

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
    const parsed = JSON.parse(raw);
    return parsed.savedAt || null;
  } catch {
    return null;
  }
}

function _fmtDate(ts) {
  if (!ts) return 'unknown date';
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Cloud push ───────────────────────────────────────────── */

/**
 * Push the current local save to the cloud.
 * Safe to call at any time — queues automatically if already in flight.
 * Silently no-ops if the user is not signed in.
 */
async function syncToCloud() {
  if (typeof isSignedIn === 'function' && !isSignedIn()) return;

  const headers = _authHeaders();
  if (!headers) return;

  // If a sync is already running, mark that we want another one after
  if (_syncInFlight) {
    _syncQueued = true;
    return;
  }

  _syncInFlight = true;
  _syncQueued   = false;

  try {
    const raw = localStorage.getItem('soulrift_v1');
    if (!raw) return;
    const body = JSON.parse(raw);

    const res = await fetch(BACKEND_URL + '/api/save', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      // Token expired — silent refresh will fix it; next trigger will retry
      console.info('[sync] 401 on push — token may be stale, waiting for refresh');
      return;
    }

    if (!res.ok) {
      console.warn('[sync] Push failed:', res.status);
    }
  } catch (e) {
    // Network offline — no toast, no error UI, just log
    console.info('[sync] Push skipped (offline?):', e.message);
  } finally {
    _syncInFlight = false;
    // Drain the queue: if another push was requested during flight, run it now
    if (_syncQueued) {
      _syncQueued = false;
      syncToCloud();
    }
  }
}

/* ── Cloud pull ───────────────────────────────────────────── */

async function _fetchCloudSave() {
  const headers = _authHeaders();
  if (!headers) return null;

  try {
    const res = await fetch(BACKEND_URL + '/api/save', { headers });
    if (res.status === 401) {
      console.info('[sync] 401 on fetch — token stale');
      return null;
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json.save || null;
  } catch {
    return null;
  }
}

/* ── Conflict dialog ──────────────────────────────────────── */

/**
 * Show the "Cloud save is newer" modal using the existing shop-confirm-modal.
 * Resolves with true (load cloud) or false (keep local).
 */
function _showCloudNewerDialog(cloudSavedAt, localSavedAt) {
  return new Promise(resolve => {
    const modal = document.getElementById('shop-confirm-modal');
    const body  = document.getElementById('shop-confirm-body');
    if (!modal || !body) { resolve(false); return; }

    body.innerHTML =
      '<div class="modal-icon">☁</div>'
      + '<div class="modal-title" id="modal-confirm-title">Cloud Save is Newer</div>'
      + '<div class="modal-body">Last played <strong>'
      + _fmtDate(cloudSavedAt)
      + '</strong></div>'
      + '<div class="modal-hint">Load it? This will replace your local progress'
      + (localSavedAt ? ' (saved ' + _fmtDate(localSavedAt) + ')' : '')
      + '.</div>';

    const confirmBtn = modal.querySelector('.btn--primary');
    const cancelBtn  = modal.querySelector('.btn--ghost');

    if (confirmBtn) {
      confirmBtn.textContent = 'Load Cloud';
      confirmBtn.disabled = false;
      confirmBtn.onclick = () => {
        _cleanupDialog(modal, confirmBtn, cancelBtn);
        resolve(true);
      };
    }
    if (cancelBtn) {
      cancelBtn.textContent = 'Keep Local';
      cancelBtn.onclick = () => {
        _cleanupDialog(modal, confirmBtn, cancelBtn);
        resolve(false);
      };
    }

    modal.setAttribute('aria-labelledby', 'modal-confirm-title');
    modal.classList.remove('is-hidden');
    if (typeof _openModal === 'function') _openModal(modal);
  });
}

function _cleanupDialog(modal, confirmBtn, cancelBtn) {
  modal.classList.add('is-hidden');
  if (typeof _closeModal === 'function') _closeModal(modal);
  // Restore default handlers so the modal works normally elsewhere
  if (confirmBtn) {
    confirmBtn.textContent = 'Confirm';
    confirmBtn.onclick = typeof confirmShopBuy === 'function' ? confirmShopBuy : null;
  }
  if (cancelBtn) {
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = typeof closeShopConfirm === 'function' ? closeShopConfirm : null;
  }
}

/* ── Apply cloud save ─────────────────────────────────────── */

function _applyCloudSave(cloudBlob) {
  try {
    localStorage.setItem('soulrift_v1', JSON.stringify(cloudBlob));
    // Force state.js to re-read from localStorage on next getState() call
    // _state is a module-level var in state.js; we null it via the reset path
    // without wiping the key — reload is the cleanest approach here
    location.reload();
  } catch (e) {
    console.error('[sync] Failed to apply cloud save:', e);
    if (typeof toast === 'function') toast('Failed to load cloud save.', 'bad');
  }
}

/* ── Main sign-in sync ────────────────────────────────────── */

/**
 * Called once after the user signs in (or on app load if already signed in).
 * Fetches cloud save, compares savedAt, resolves conflict if needed.
 */
async function syncOnSignIn() {
  if (typeof isSignedIn === 'function' && !isSignedIn()) return;

  const cloudBlob = await _fetchCloudSave();

  // No cloud save yet — push local silently
  if (!cloudBlob) {
    syncToCloud();
    return;
  }

  const cloudSavedAt = cloudBlob.savedAt || 0;
  const localSavedAt = _localSavedAt() || 0;

  // Local is newer or equal — push silently, no dialog
  if (localSavedAt >= cloudSavedAt) {
    syncToCloud();
    return;
  }

  // Cloud is newer — ask the player
  const loadCloud = await _showCloudNewerDialog(cloudSavedAt, localSavedAt);
  if (loadCloud) {
    _applyCloudSave(cloudBlob);
    // page will reload — nothing after this runs
  } else {
    // Player chose to keep local — push it to cloud to overwrite
    syncToCloud();
  }
}

/* ── Background / unload triggers ────────────────────────── */

function initSyncListeners() {
  // Push when tab goes to background
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      syncToCloud();
    }
  });

  // Push on page close (best-effort; fetch may be cancelled by browser)
  // We replace the existing saveState-only beforeunload in state.js
  window.addEventListener('beforeunload', () => {
    syncToCloud();
  });
}

/* ── Auth event listener ──────────────────────────────────── */

// When auth state changes, kick off the sign-in sync
window.addEventListener('soulrift:authchange', (e) => {
  if (e.detail && e.detail.signedIn) {
    syncOnSignIn();
  }
});

/* ── Exports ──────────────────────────────────────────────── */
window.syncToCloud       = syncToCloud;
window.syncOnSignIn      = syncOnSignIn;
window.initSyncListeners = initSyncListeners;
