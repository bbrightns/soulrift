# Soulrift Landing / Tower Selection Reference

Source: extracted from `v2.html`

Use this file as the visual reference for the first screen: background, typography, tower cards, hover effects, selected state, and Enter Arcadia CTA.

---

## 1) Main CSS for landing style

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SOULRIFT RPG — Choose Your Tower</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --void: #0a0a0b;
    --void2: #16161a;
    --void3: #1e1e24;
    --gold: #c5a059;
    --gold-light: #e8c87a;
    --gold-dim: #7a6035;
    --crimson: #8b1e1e;
    --crimson-light: #c42b2b;
    --text-primary: #e8dcc8;
    --text-secondary: #9a8f7a;
    --text-muted: #5a5248;
    --border-rune: rgba(197, 160, 89, 0.15);
    --border-rune-bright: rgba(197, 160, 89, 0.4);
  }

  html, body {
    min-height: 100vh;
    background: var(--void);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* === COSMIC BG === */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,30,30,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 20% 80%, rgba(197,160,89,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 80% 90%, rgba(30,30,80,0.15) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* Stars */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 15% 20%, rgba(197,160,89,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 35% 8%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 15%, rgba(197,160,89,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 5%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 92% 30%, rgba(197,160,89,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 10% 55%, rgba(255,255,255,0.2) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 70%, rgba(197,160,89,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.15) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 88%, rgba(197,160,89,0.4) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 45% 45%, rgba(197,160,89,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 5% 40%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 60%, rgba(255,255,255,0.2) 0%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  .page-wrapper {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.5rem 5rem;
  }

  /* === HEADER === */
  .site-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .logo-rune {
    font-size: 0.7rem;
    letter-spacing: 0.5em;
    color: var(--gold-dim);
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .game-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.08em;
    line-height: 1.1;
    text-shadow: 0 0 60px rgba(197,160,89,0.3), 0 0 120px rgba(197,160,89,0.15);
    margin-bottom: 0.5rem;
  }

  .game-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    letter-spacing: 0.3em;
    color: var(--text-secondary);
    text-transform: uppercase;
  }

  /* Ornamental divider */
  .ornament {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
    width: 100%;
    max-width: 700px;
  }
  .ornament-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }
  .ornament-diamond {
    width: 8px;
    height: 8px;
    background: var(--gold);
    transform: rotate(45deg);
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(197,160,89,0.6);
  }
  .ornament-text {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.4em;
    color: var(--gold-dim);
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* === CARDS GRID === */
  .towers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin-bottom: 3rem;
  }

  /* === TOWER CARD === */
  .tower-card {
    position: relative;
    background: var(--void2);
    border: 1px solid var(--border-rune);
    border-radius: 4px;
    padding: 1.5rem 1.5rem 1.5rem;
    cursor: pointer;
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Corner rune marks */
  .tower-card::before,
  .tower-card::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    opacity: 0.4;
    transition: opacity 0.35s ease;
  }
  .tower-card::before {
    top: 0; left: 0;
    border-top: 1px solid var(--gold);
    border-left: 1px solid var(--gold);
  }
  .tower-card::after {
    bottom: 0; right: 0;
    border-bottom: 1px solid var(--gold);
    border-right: 1px solid var(--gold);
  }

  .tower-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-rune-bright);
  }
  .tower-card:hover::before,
  .tower-card:hover::after { opacity: 1; }

  /* Selected state */
  .tower-card.selected {
    border-color: var(--gold);
    transform: translateY(-6px);
  }
  .tower-card.selected::before,
  .tower-card.selected::after { opacity: 1; }

  /* Glow overlays per tower */
  .tower-card .card-glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    border-radius: 4px;
  }
  .tower-card:hover .card-glow,
  .tower-card.selected .card-glow { opacity: 1; }

  .light-glow   { background: radial-gradient(ellipse at 50% 0%, rgba(255,220,100,0.08) 0%, transparent 70%); }
  .dark-glow    { background: radial-gradient(ellipse at 50% 0%, rgba(150,80,220,0.09) 0%, transparent 70%); }
  .fire-glow    { background: radial-gradient(ellipse at 50% 0%, rgba(220,80,30,0.1) 0%, transparent 70%); }

  /* Selected glow stronger */
  .tower-card.selected .light-glow  { background: radial-gradient(ellipse at 50% 0%, rgba(255,220,100,0.15) 0%, transparent 70%); }
  .tower-card.selected .dark-glow   { background: radial-gradient(ellipse at 50% 0%, rgba(150,80,220,0.16) 0%, transparent 70%); }
  .tower-card.selected .fire-glow   { background: radial-gradient(ellipse at 50% 0%, rgba(220,80,30,0.18) 0%, transparent 70%); }

  /* === CARD TOP === */
  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .tower-sigil {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    position: relative;
    flex-shrink: 0;
  }

  .sigil-light  { background: rgba(255,220,100,0.1); border: 1px solid rgba(255,220,100,0.3); box-shadow: 0 0 20px rgba(255,220,100,0.15); }
  .sigil-dark   { background: rgba(140,60,200,0.1);  border: 1px solid rgba(140,60,200,0.3);  box-shadow: 0 0 20px rgba(140,60,200,0.15); }
  .sigil-fire   { background: rgba(220,70,20,0.12);  border: 1px solid rgba(220,70,20,0.35);  box-shadow: 0 0 20px rgba(220,70,20,0.2); }

  .tower-card.selected .sigil-light { box-shadow: 0 0 35px rgba(255,220,100,0.4); border-color: rgba(255,220,100,0.7); }
  .tower-card.selected .sigil-dark  { box-shadow: 0 0 35px rgba(140,60,200,0.4);  border-color: rgba(140,60,200,0.7); }
  .tower-card.selected .sigil-fire  { box-shadow: 0 0 35px rgba(220,70,20,0.4);   border-color: rgba(220,70,20,0.7); }

  .selected-badge {
    display: none;
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--gold);
    border: 1px solid var(--gold-dim);
    padding: 3px 10px;
    border-radius: 2px;
    text-transform: uppercase;
    background: rgba(197,160,89,0.07);
  }
  .tower-card.selected .selected-badge { display: block; }

  /* === TOWER NAME === */
  .tower-name {
    font-family: 'Cinzel', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .tower-tagline {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.85rem;
  }
  .color-light  { color: #e0c060; }
  .color-dark   { color: #b080e0; }
  .color-fire   { color: #e06030; }

  /* Stats row */
  .tower-stats {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .stat-pill {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    padding: 3px 10px;
    border-radius: 2px;
    border: 1px solid;
    text-transform: uppercase;
    font-weight: 500;
  }
  .stat-light { background: rgba(255,220,100,0.08); border-color: rgba(255,220,100,0.25); color: #e0c060; }
  .stat-dark  { background: rgba(140,60,200,0.08);  border-color: rgba(140,60,200,0.25);  color: #b080e0; }
  .stat-fire  { background: rgba(220,70,20,0.1);    border-color: rgba(220,70,20,0.3);    color: #e06030; }

  /* Divider */
  .card-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-rune-bright), transparent);
    margin-bottom: 1rem;
  }

  /* Description */
  .tower-desc {
    font-size: 0.82rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 1.25rem;
  }

  /* Playstyle */
  .section-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .playstyle-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }
  .ps-tag {
    font-size: 0.7rem;
    padding: 3px 8px;
    border-radius: 2px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-secondary);
    letter-spacing: 0.05em;
  }

  /* Strength / Weakness */
  .sw-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .sw-block { }
  .sw-label {
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 0.35rem;
  }
  .sw-strength .sw-label { color: #5a8f5a; }
  .sw-weakness .sw-label { color: #8f4a4a; }

  .sw-item {
    font-size: 0.72rem;
    color: var(--text-secondary);
    line-height: 1.8;
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }
  .sw-item::before { content: '·'; flex-shrink: 0; }
  .sw-strength .sw-item::before { color: #5a8f5a; }
  .sw-weakness .sw-item::before { color: #8f4a4a; }

  /* Special mechanic */
  .special-box {
    background: rgba(197,160,89,0.05);
    border: 1px solid rgba(197,160,89,0.12);
    border-radius: 2px;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
  }
  .special-title {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    color: var(--gold-dim);
    text-transform: uppercase;
    margin-bottom: 0.35rem;
  }
  .special-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .special-text em {
    color: var(--gold);
    font-style: normal;
    font-weight: 500;
  }

  /* Details link */
  .details-btn {
    background: transparent;
    border: none;
    padding: 0;
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.2s;
    margin-bottom: 0.85rem;
    align-self: flex-start;
  }
  .details-btn:hover { color: var(--text-secondary); }

  /* Tower detail modal */
  .tower-detail-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(5,5,6,0.8);
    z-index: 400;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    backdrop-filter: blur(6px);
  }
  .tower-detail-overlay.open { display: flex; }
  .tower-detail-box {
    background: rgba(16,16,20,0.98);
    border: 1px solid var(--border-rune-bright);
    border-radius: 4px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    animation: panel-in 0.3s cubic-bezier(.22,.8,.36,1) both;
    scrollbar-width: thin;
    scrollbar-color: var(--gold-dim) transparent;
  }
  .tower-detail-box::-webkit-scrollbar { width: 4px; }
  .tower-detail-box::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
  .tower-detail-head {
    padding: 1.25rem 1.5rem 1rem;
    border-bottom: 1px solid var(--border-rune);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: rgba(16,16,20,0.98);
    z-index: 2;
  }
  .tower-detail-head-left { display: flex; align-items: center; gap: 0.6rem; }
  .tower-detail-title {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .tower-detail-close {
    background: transparent;
    border: 1px solid var(--border-rune);
    color: var(--text-muted);
    width: 30px;
    height: 30px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .tower-detail-close:hover { color: var(--text-primary); border-color: var(--border-rune-bright); }
  .tower-detail-body { padding: 1.5rem; }

  /* Choose button */
  .choose-btn {
    width: 100%;
    padding: 0.85rem 1rem;
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    border: 1px solid var(--border-rune-bright);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-top: auto;
  }

  .choose-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .tower-card[data-tower="light"]  .choose-btn::before { background: rgba(255,220,100,0.08); }
  .tower-card[data-tower="dark"]   .choose-btn::before { background: rgba(140,60,200,0.08); }
  .tower-card[data-tower="fire"]   .choose-btn::before { background: rgba(220,70,20,0.1); }

  .choose-btn:hover::before { opacity: 1; }
  .choose-btn:hover {
    color: var(--text-primary);
    border-color: var(--gold);
  }

  .tower-card.selected .choose-btn {
    background: rgba(197,160,89,0.12);
    border-color: var(--gold);
    color: var(--gold);
  }

  /* === CONFIRM SECTION === */
  .confirm-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
    width: 100%;
    max-width: 480px;
  }
  .confirm-section.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }

  .confirm-text {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    color: var(--text-muted);
    text-transform: uppercase;
    text-align: center;
  }

  .confirm-name {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .enter-arcadia-btn {
    width: 100%;
    max-width: 360px;
    padding: 1.1rem 2rem;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    font-weight: 700;
    border: 1px solid var(--gold);
    background: rgba(197,160,89,0.1);
    color: var(--gold);
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .enter-arcadia-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(197,160,89,0.1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .enter-arcadia-btn:hover::before { transform: scaleX(1); }
  .enter-arcadia-btn:hover {
    background: rgba(197,160,89,0.18);
    box-shadow: 0 0 30px rgba(197,160,89,0.2);
    letter-spacing: 0.4em;
  }

  /* === NOTIFICATION === */
  .notify {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--void3);
    border: 1px solid var(--gold-dim);
    color: var(--text-primary);
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    padding: 0.75rem 2rem;
    border-radius: 2px;
    transition: transform 0.4s ease;
    z-index: 100;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .notify.show { transform: translateX(-50%) translateY(0); }

  /* === FOOTER === */
  .page-footer {
    margin-top: 3rem;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: var(--text-muted);
    font-family: 'Cinzel', serif;
    text-align: center;
    text-transform: uppercase;
  }

  /* Pulse animation for selected sigil */
  @keyframes sigil-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .tower-card.selected .tower-sigil { animation: sigil-pulse 3s ease-in-out infinite; }

  /* Entrance animation */
  @keyframes card-in {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tower-card {
    animation: card-in 0.6s ease both;
  }
  .tower-card:nth-child(1) { animation-delay: 0.1s; }
  .tower-card:nth-child(2) { animation-delay: 0.22s; }
  .tower-card:nth-child(3) { animation-delay: 0.34s; }
  .tower-card:nth-child(4) { animation-delay: 0.46s; }

  @keyframes header-in {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .site-header { animation: header-in 0.8s ease both; }


  /* ============================================================
```

---

## 2) Landing HTML structure

```html
<div class="page-wrapper">

  <!-- HEADER -->
  <header class="site-header">
    <div class="logo-rune">◆ &nbsp; World of Arcadia &nbsp; ◆</div>
    <h1 class="game-title">SOULRIFT</h1>
    <p class="game-subtitle">RPG Chronicles</p>
  </header>

  <div class="ornament">
    <div class="ornament-line"></div>
    <div class="ornament-diamond"></div>
    <span class="ornament-text">Choose Your Tower Alignment</span>
    <div class="ornament-diamond"></div>
    <div class="ornament-line"></div>
  </div>

  <!-- TOWER CARDS -->
  <div class="towers-grid" role="list">

    <!-- LIGHT TOWER -->
    <div class="tower-card" data-tower="light" role="listitem" tabindex="0" aria-label="Light Tower" onclick="selectTower(this)">
      <div class="card-glow light-glow"></div>
      <div class="card-top">
        <div class="tower-sigil sigil-light" aria-hidden="true">☀️</div>
        <span class="selected-badge">Chosen</span>
      </div>
      <div class="tower-name color-light">Light Tower</div>
      <div class="tower-tagline color-light">Sol Radiance · Order of the Dawn</div>
      <div class="tower-stats">
        <span class="stat-pill stat-light">High HP</span>
        <span class="stat-pill stat-light">Self-Healing</span>
        <span class="stat-pill stat-light">Shield Stack</span>
      </div>
      <div class="card-divider"></div>
      <button class="details-btn" onclick="openDetails('light'); event.stopPropagation()">View Details ›</button>
    </div>

    <!-- DARK TOWER -->
    <div class="tower-card" data-tower="dark" role="listitem" tabindex="0" aria-label="Dark Tower" onclick="selectTower(this)">
      <div class="card-glow dark-glow"></div>
      <div class="card-top">
        <div class="tower-sigil sigil-dark" aria-hidden="true">🌙</div>
        <span class="selected-badge">Chosen</span>
      </div>
      <div class="tower-name color-dark">Dark Tower</div>
      <div class="tower-tagline color-dark">Void Curse · Covenant of Shadows</div>
      <div class="tower-stats">
        <span class="stat-pill stat-dark">High Burst</span>
        <span class="stat-pill stat-dark">Lifesteal</span>
        <span class="stat-pill stat-dark">High Risk</span>
      </div>
      <div class="card-divider"></div>
      <button class="details-btn" onclick="openDetails('dark'); event.stopPropagation()">View Details ›</button>
    </div>

    <!-- FIRE TOWER -->
    <div class="tower-card" data-tower="fire" role="listitem" tabindex="0" aria-label="Fire Tower" onclick="selectTower(this)">
      <div class="card-glow fire-glow"></div>
      <div class="card-top">
        <div class="tower-sigil sigil-fire" aria-hidden="true">🔥</div>
        <span class="selected-badge">Chosen</span>
      </div>
      <div class="tower-name color-fire">Fire Tower</div>
      <div class="tower-tagline color-fire">Inferno Forge · Brotherhood of Ash</div>
      <div class="tower-stats">
        <span class="stat-pill stat-fire">Burn Stack</span>
        <span class="stat-pill stat-fire">Explosive AoE</span>
        <span class="stat-pill stat-fire">Gold Farm</span>
      </div>
      <div class="card-divider"></div>
      <button class="details-btn" onclick="openDetails('fire'); event.stopPropagation()">View Details ›</button>
    </div>

  </div><!-- /towers-grid -->

  <!-- CONFIRM SECTION -->
  <div class="confirm-section" id="confirmSection" aria-live="polite">
    <div class="confirm-text">You have chosen your path</div>
    <div class="confirm-name" id="confirmName"></div>
    <div class="ornament" style="max-width:300px; margin: 0.5rem 0;">
      <div class="ornament-line"></div>
      <div class="ornament-diamond"></div>
      <div class="ornament-line"></div>
    </div>
    <button class="enter-arcadia-btn" onclick="enterArcadia()">
      ◆ &nbsp; Enter Arcadia &nbsp; ◆
    </button>
  </div>

  <footer class="page-footer">
    Arcadia Awaits · Soulrift RPG Chronicles · Build Your Legend
```

---

## 3) Tower data needed by landing selection

```javascript
const TOWER = {
  light: {
    badge: '☀️ Light Tower', cls: 'light',
    label: 'Light Tower — Sol Radiance',
    welcome: 'Welcome, Mage of the Light Tower',
    lore: '"The rift tears grow wider. Stand firm in radiance and let your barriers hold the tide."',
    hp: 140, sp: 80, tu: 1500,
    stats: { Strength:8, Intelligence:16, Agility:10, Attack:12, Defense:14, 'Max HP':140, 'Max SP':80 },
    color: 'rgba(255,220,100,0.5)'
  },
  dark: {
    badge: '🌙 Dark Tower', cls: 'dark',
    label: 'Dark Tower — Covenant of Shadows',
    welcome: 'Welcome, Shadow Mage of the Void',
    lore: '"Consume the light. Each chain you forge in darkness multiplies your devastation tenfold."',
    hp: 100, sp: 90, tu: 1500,
    stats: { Strength:12, Intelligence:12, Agility:18, Attack:20, Defense:8, 'Max HP':100, 'Max SP':90 },
    color: 'rgba(140,60,200,0.5)'
  },
  fire: {
    badge: '🔥 Fire Tower', cls: 'fire',
    label: 'Fire Tower — Inferno Forge',
    welcome: 'Welcome, Pyromancer of the Inferno',
    lore: '"Stack the embers. Each flame you kindle stacks higher, until the world itself burns."',
    hp: 110, sp: 70, tu: 1500,
    stats: { Strength:18, Intelligence:10, Agility:12, Attack:22, Defense:10, 'Max HP':110, 'Max SP':70 },
    color: 'rgba(220,70,20,0.6)'
  }
};

/* ═══════════ STATE ═══════════ */
let G = {
  tower: null, playerName: 'Arcane Wanderer',
  level: 1, xp: 0,
  hp: 120, maxHp: 120,
  sp: 80, maxSp: 80,
  gold: 1000,
  inventory: [], spells: [],
  blueprint: Array(10).fill(null)
};

/* ═══════════ INIT ═══════════ */

function loadState(tower) {
  const raw = localStorage.getItem('soulrift_state');
  if (raw) { try { Object.assign(G, JSON.parse(raw)); } catch(e) {} }
  const td = TOWER[tower];
  G.tower = tower;
  if (!raw) { G.maxHp = td.hp; G.hp = td.hp; G.maxSp = td.sp; G.sp = td.sp; }
}

function saveState() {
  localStorage.setItem('soulrift_tower', G.tower);
  localStorage.setItem('soulrift_state', JSON.stringify(G));
}

/* ═══════════ TOWER SELECTION ═══════════ */
const towerNames = {
  light: '☀️ &nbsp; Light Tower — Sol Radiance',
  dark:  '🌙 &nbsp; Dark Tower — Covenant of Shadows',
  fire:  '🔥 &nbsp; Fire Tower — Inferno Forge'
};

```

---

## 4) Selection / Enter button logic

```javascript
function selectTower(card) {
  document.querySelectorAll('.tower-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const tower = card.getAttribute('data-tower');
  localStorage.setItem('soulrift_tower', tower);
  document.getElementById('confirmName').innerHTML = towerNames[tower];
  document.getElementById('confirmSection').classList.add('visible');
  showNotify('You are choosing : ' + tower.toUpperCase() + ' TOWER');
}

function enterArcadia() {
  const tower = localStorage.getItem('soulrift_tower');
  if (!tower) return;
  loadState(tower);
  saveState();
  showHub();
  setTimeout(() => showNotify('Entering Arcadia — ' + TOWER[tower].label), 200);
}
```

---

## Quick search keywords

- `:root` — color variables
- `body::before`, `body::after` — cosmic background and stars
- `.page-wrapper` — first screen wrapper
- `.site-header` — title area
- `.ornament` — Choose Your Tower divider
- `.towers-grid` — tower card layout
- `.tower-card` — tower card base style
- `.tower-card:hover` — hover movement effect
- `.tower-card.selected` — chosen tower state
- `.card-glow`, `.light-glow`, `.dark-glow`, `.fire-glow` — magical glow layers
- `.tower-sigil` — tower icon circle
- `.stat-pill` — tower stat badges
- `.confirm-section` — chosen path section
- `.enter-arcadia-btn` — final CTA button
- `selectTower(card)` — card click logic
- `enterArcadia()` — enter game logic
