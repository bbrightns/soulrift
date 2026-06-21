/*============ /js/auth.js ============
  Server-side OAuth 2.0 Authorization Code flow.
  Redirect-based — no Google JS SDK, no iframes, no One Tap.
=====================================================*/
'use strict';

const GOOGLE_CLIENT_ID =
  '1071376739473-a6cjtaaf852lr42osrvs6aqke757h3j7.apps.googleusercontent.com';

const BACKEND_AUTH_URL = 'https://soulrift-backend.vercel.app/api/auth/google';
const REDIRECT_URI = 'https://soulrift.vercel.app/';

const AUTH_STORAGE_KEY = 'soulrift_auth_v2'; // bumped: shape changed (own JWT, not Google id_token)
const OAUTH_STATE_KEY = 'soulrift_oauth_state';

let _sessionToken = null;
let _expiresAt = 0;
let _user = null;

function _persist(token, expiresAt, user) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, expiresAt, user }));
  } catch (e) { console.warn('[auth] Could not persist session', e); }
}

function _clearPersisted() {
  try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch { /* ignore */ }
}

function _emit() {
  window.dispatchEvent(new CustomEvent('soulrift:authchange', {
    detail: { signedIn: !!_sessionToken, user: _user },
  }));
}

function _randomState() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

function _restoreSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;
    const { token, expiresAt, user } = JSON.parse(raw);
    if (!token || !user?.sub) return;
    _sessionToken = token;
    _expiresAt = expiresAt || 0;
    _user = user;
    _emit();
  } catch (e) {
    console.warn('[auth] Failed to restore session', e);
    _clearPersisted();
  }
}

/** Step 1 — kick off the redirect. Called from a real click handler. */
function signIn() {
  const state = _randomState();
  try { sessionStorage.setItem(OAUTH_STATE_KEY, state); } catch { /* ignore */ }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
}
window.signIn = signIn;

/** Step 2 — handle the redirect back from Google, if we have one. */
async function _handleOAuthRedirect() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  if (!code && !error) return;

  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.searchParams.delete('scope');
  url.searchParams.delete('error');
  history.replaceState(null, '', url.pathname + (url.search || ''));

  if (error) {
    console.warn('[auth] Google OAuth error:', error);
    if (typeof toast === 'function') toast('Sign-in was cancelled.', 'bad');
    return;
  }

  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  if (!expectedState || returnedState !== expectedState) {
    console.warn('[auth] OAuth state mismatch — discarding response.');
    if (typeof toast === 'function') toast('Sign-in failed. Please try again.', 'bad');
    return;
  }

  try {
    const res = await fetch(BACKEND_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    });
    if (!res.ok) throw new Error('Backend rejected code exchange (' + res.status + ')');

    const data = await res.json();
    if (!data?.token || !data?.user) throw new Error('Malformed auth response');

    _sessionToken = data.token;
    _expiresAt = data.expiresAt || (Date.now() + 30 * 24 * 60 * 60 * 1000);
    _user = data.user;

    _persist(_sessionToken, _expiresAt, _user);
    _emit();
  } catch (e) {
    console.error('[auth] Sign-in failed:', e);
    if (typeof toast === 'function') toast('Sign-in failed. Please try again.', 'bad');
  }
}

function signOut() {
  _sessionToken = null;
  _expiresAt = 0;
  _user = null;
  _clearPersisted();
  _emit();
}
window.signOut = signOut;

function getAuthToken() { return _sessionToken; }
function getGoogleUser() { return _user ? { ..._user } : null; }
function isSignedIn() { return !!_sessionToken; }
window.getAuthToken = getAuthToken;
window.getGoogleUser = getGoogleUser;
window.isSignedIn = isSignedIn;

async function _bootAuth() {
  _restoreSession();
  await _handleOAuthRedirect();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bootAuth);
} else {
  _bootAuth();
}