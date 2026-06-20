/*============================================================
  PHASE B — Profile Panel auth UI snippet
  
  Drop this into your existing renderProfilePanel() function,
  or call renderAuthSection() from within it.

  Assumes:
  - A container element with id="profile-auth-section" exists in
    your profile panel HTML (see the HTML snippet below).
  - auth.js is loaded before this runs.
  - Your existing CSS variables (--c-inset, --c-gold-text, etc.)
    are available for styling.
============================================================*/
'use strict';

/* ── HTML to add inside your profile panel ───────────────────
   Place this wherever you want the sign-in block to appear,
   e.g. near the bottom of the panel body:

   <div id="profile-auth-section"></div>
──────────────────────────────────────────────────────────── */

function _renderGsiButton() {
  const target = document.getElementById('auth-gsi-button');
  if (!target) return;

  if (!window.google?.accounts?.id) {
    // GIS not loaded yet — retry shortly
    setTimeout(_renderGsiButton, 300);
    return;
  }

  google.accounts.id.renderButton(target, {
    type: 'standard',
    shape: 'rectangular',
    theme: 'filled_black',
    text: 'signin_with',
    size: 'large',
    width: target.parentElement?.clientWidth || 300,
  });
}

function renderAuthSection() {
  const container = document.getElementById('profile-auth-section');
  if (!container) return;

  if (!isSignedIn()) {
    container.innerHTML = `
      <div class="auth-section">
        <p class="auth-label">Cloud Save</p>
        <p class="auth-hint">Sign in with Google to back up your progress and play across devices.</p>
        <div id="auth-gsi-button" style="margin-top:var(--sp-2);"></div>
      </div>`;
    _renderGsiButton();
  } else {
    const user = getGoogleUser();
    const name = user?.name || user?.email || 'Google User';
    const picture = user?.picture;

    container.innerHTML = `
      <div class="auth-section">
        <p class="auth-label">Cloud Save</p>
        <div class="auth-user-row">
          ${picture
            ? `<img src="${_escHtml(picture)}" alt="" class="auth-avatar">`
            : `<div class="auth-avatar auth-avatar--placeholder"></div>`}
          <span class="auth-user-name">${_escHtml(name)}</span>
        </div>
        <button class="btn btn--ghost btn--full auth-signout-btn" onclick="confirmSignOutNewPlayer()">
          Sign out
        </button>
      </div>`;
  }
}

/** Minimal HTML escape to avoid XSS when rendering user-supplied strings. */
function _escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Re-render whenever auth state changes ───────────────── */
window.addEventListener('soulrift:authchange', () => {
  renderAuthSection();
  // If renderProfilePanel exists and the panel is currently open,
  // re-render it to pick up any auth-dependent UI changes.
  if (typeof renderProfilePanel === 'function') {
    const panel = document.getElementById('profile-panel');
    if (panel && !panel.classList.contains('is-hidden')) {
      renderProfilePanel();
    }
  }
});

/* ── Call once on load in case panel renders before authchange fires ─── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAuthSection);
} else {
  renderAuthSection();
}

window.renderAuthSection = renderAuthSection;

function confirmSignOutNewPlayer() {
  if (!confirm('Sign out and start over as a new player? Local progress on this device will be cleared.')) return;
  if (typeof signOut === 'function') signOut();
  if (typeof closeProfilePanel === 'function') closeProfilePanel();
  resetState();
  location.reload();
}
window.confirmSignOutNewPlayer = confirmSignOutNewPlayer;