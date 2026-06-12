/* ============================================================
   SOULRIFT — /js/sfx.js
   Procedural SFX via Web Audio API. No audio files required.
   All sounds generated from oscillators + envelopes.
   ============================================================ */

'use strict';

const SFX = (() => {
  let _ctx = null;

  function _getCtx() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return null; }
    }
    /* resume if browser suspended it */
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  /* ── Core tone ─────────────────────────────────────────── */
  function _tone(freq, freqEnd, type, vol, dur, delayMs) {
    const delay = (delayMs || 0) / 1000;
    setTimeout(() => {
      try {
        const ctx = _getCtx();
        if (!ctx) return;
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (freqEnd && freqEnd !== freq) {
          osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + dur);
        }
        gain.gain.setValueAtTime(vol || 0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + dur + 0.01);
      } catch (e) {}
    }, delayMs || 0);
  }

  /* ── Individual sounds ─────────────────────────────────── */

  /** Player spell or strike connects — unified to Radiant Light Chime style */
  function playerHit(type) {
    // Radiant Lydian Chime Arpeggio (4-note ascending light chime)
    _tone(1047, 1047, 'sine', 0.15, 0.30, 0);   // C6
    _tone(1319, 1319, 'sine', 0.12, 0.25, 50);  // E6
    _tone(1568, 1568, 'sine', 0.10, 0.22, 100); // G6
    _tone(1976, 1976, 'sine', 0.08, 0.20, 150); // B6
    _tone(2093, 2093, 'sine', 0.05, 0.40, 200); // C7 (resonance)
  }

  /** Enemy strikes player — heavy thud with balanced volume */
  function enemyHit() {
    _tone(150, 50, 'triangle', 0.26, 0.20);
    _tone(90, 30, 'sawtooth', 0.12, 0.16, 15);
    _tone(70, 40, 'sine', 0.20, 0.25, 30);
  }

  /** Victory — ascending 4-note fanfare */
  function victory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => _tone(f, f * 0.97, 'sine', 0.20, 0.28, i * 130));
  }

  /** Defeat — descending 3-note fade */
  function defeat() {
    const notes = [392, 311, 220];
    notes.forEach((f, i) => _tone(f, f * 0.92, 'triangle', 0.18, 0.40, i * 220));
  }

  /** Gold earned — quick high sparkle */
  function gold() {
    _tone(1200, 800, 'sine', 0.15, 0.07);
    _tone(1600, 900, 'sine', 0.10, 0.07, 55);
  }

  /** Level up — bright ascending arpeggio */
  function levelUp() {
    const notes = [262, 330, 392, 523, 784];
    notes.forEach((f, i) => _tone(f, f * 1.02, 'sine', 0.22, 0.22, i * 75));
  }

  /** Buy spell — short confirm chime */
  function buy() {
    _tone(440, 550, 'sine', 0.18, 0.10);
    _tone(660, 660, 'sine', 0.14, 0.12, 80);
  }

  /** Fusion result — resonant ring */
  function fusion(success) {
    if (success) {
      _tone(880, 1100, 'sine', 0.20, 0.20);
      _tone(660, 880,  'sine', 0.14, 0.25, 80);
    } else {
      _tone(280, 140, 'sawtooth', 0.22, 0.30);
      _tone(200, 80,  'triangle', 0.15, 0.35, 60);
    }
  }

  return { playerHit, enemyHit, victory, defeat, gold, levelUp, buy, fusion };
})();

window.SFX = SFX;
