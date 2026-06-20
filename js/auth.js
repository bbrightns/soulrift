/*============ /js/auth.js ============
  Google Identity Services — popup / token flow
  Persists the ID token in localStorage so the session survives reloads.
  Fires a 'soulrift:authchange' CustomEvent on window whenever the signed-in
  state changes so other modules (profile panel, sync) can react without
  coupling to this file.
=====================================================*/
'use strict';

/* ── Constants ───────────────────────────────────────────── */
const GOOGLE_CLIENT_ID =
  '1071376739473-a6cjtaaf852lr42osrvs6aqke757h3j7.apps.googleusercontent.com';

const AUTH_STORAGE_KEY = 'soulrift_auth_v1';

/**
 * We refresh the token when it has less than this many ms left.
 * Google ID tokens last 3600 s (1 hour); we renew at 5 min remaining.
 */
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

/* ── Internal state ──────────────────────────────────────── */
let _idToken = null;   // raw JWT string
let _expiresAt = 0;      // ms since epoch
let _user = null;   // { sub, email, name, picture }
let _client = null;   // google.accounts.id client (for prompt/renew)
let _tokenClient = null; // unused in id-token flow; kept for future OAuth scope

/* ── Helpers ─────────────────────────────────────────────── */

/** Decode the payload of a JWT without verifying the signature. */
function _decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/** Persist session to localStorage. */
function _persist(token, expiresAt, user) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, expiresAt, user }));
  } catch (e) {
    console.warn('[auth] Could not persist session', e);
  }
}

/** Remove session from localStorage. */
function _clearPersisted() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch { /* ignore */ }
}

/** Apply a verified credential response to in-memory state and persist. */
function _applyCredential(credentialResponse) {
  const payload = _decodeJwtPayload(credentialResponse.credential);
  if (!payload) {
    console.error('[auth] Failed to decode credential payload');
    return;
  }

  _idToken = credentialResponse.credential;
  _expiresAt = (payload.exp || 0) * 1000; // convert to ms
  _user = {
    sub: payload.sub,
    email: payload.email || null,
    name: payload.name || null,
    picture: payload.picture || null,
  };

  _persist(_idToken, _expiresAt, _user);
  _scheduleRefresh();
  _emit();
}

/** Dispatch soulrift:authchange so other modules can react. */
function _emit() {
  window.dispatchEvent(
    new CustomEvent('soulrift:authchange', {
      detail: { signedIn: !!_idToken, user: _user },
    })
  );
}

/* ── Token refresh ───────────────────────────────────────── */
let _refreshTimer = null;

function _scheduleRefresh() {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  const delay = _expiresAt - Date.now() - REFRESH_THRESHOLD_MS;
  if (delay > 0) {
    _refreshTimer = setTimeout(_silentRefresh, delay);
  } else {
    // Already within the threshold — try immediately
    _silentRefresh();
  }
}

/**
 * Ask GIS to silently issue a fresh ID token via the One Tap prompt.
 * This works as long as the user still has an active Google session in
 * the browser. If it fails, the user remains signed in with their
 * current (possibly expired) token until the next explicit action.
 */
function _silentRefresh() {
  if (!window.google?.accounts?.id) return;
  google.accounts.id.prompt((notification) => {
    // 'skipped' or 'dismissed' means silent refresh wasn't possible;
    // we leave the stale token in place — POST /api/save will 401 and
    // Phase C's syncToCloud() will surface the sign-in prompt.
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      console.info('[auth] Silent refresh skipped:', notification.getSkippedReason?.() ?? '');
    }
  });
}

/* ── GIS initialisation ──────────────────────────────────── */

function _initGIS() {
  if (!window.google?.accounts?.id) {
    // Script not yet loaded — retry in 500 ms
    setTimeout(_initGIS, 500);
    return;
  }

  console.log('[auth] origin:', window.location.origin);
  console.log('[auth] GIS loaded:', !!window.google?.accounts?.id);

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: _applyCredential,
    // Don't show the One Tap prompt automatically on load — the user
    // will trigger sign-in explicitly from the profile panel.
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  _restoreSession();
}

/** Try to restore a persisted session from localStorage. */
function _restoreSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;
    const { token, expiresAt, user } = JSON.parse(raw);

    if (!token || !expiresAt || !user?.sub) return;

    // Accept the stored token even if expired — Phase C will handle
    // a 401 gracefully. But schedule an immediate silent refresh.
    _idToken = token;
    _expiresAt = expiresAt;
    _user = user;

    _scheduleRefresh();
    _emit();
  } catch (e) {
    console.warn('[auth] Failed to restore session', e);
    _clearPersisted();
  }
}

/* ── Public API ──────────────────────────────────────────── */

/**
 * Open the Google One Tap / popup sign-in flow.
 * The callback passed to initialize() handles the result.
 */
function signIn() {
  if (!window.google?.accounts?.id) {
    console.warn('[auth] Google Identity Services not loaded yet');
    return;
  }
  google.accounts.id.prompt();
}

/**
 * Sign out: clear in-memory state, localStorage, and revoke the Google
 * session hint so One Tap doesn't auto-sign back in.
 */
function signOut() {
  const email = _user?.email;

  _idToken = null;
  _expiresAt = 0;
  _user = null;
  if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }

  _clearPersisted();

  if (email && window.google?.accounts?.id) {
    google.accounts.id.revoke(email, () => { });
  }

  _emit();
}

/** Returns the current raw ID token string, or null if not signed in. */
function getAuthToken() {
  return _idToken;
}

/**
 * Returns the current user object { sub, email, name, picture },
 * or null if not signed in.
 */
function getGoogleUser() {
  return _user ? { ..._user } : null;
}

/** True if there is an active (or recently-expired-pending-refresh) session. */
function isSignedIn() {
  return !!_idToken;
}

/* ── Boot ────────────────────────────────────────────────── */
// Wait for the GIS <script> to load, then initialise.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initGIS);
} else {
  _initGIS();
}

/* ── Exports (global, matching state.js style) ───────────── */
window.signIn = signIn;
window.signOut = signOut;
window.getAuthToken = getAuthToken;
window.getGoogleUser = getGoogleUser;
window.isSignedIn = isSignedIn;
