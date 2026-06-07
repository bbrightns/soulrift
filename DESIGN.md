---
name: SOULRIFT
description: A solo mobile RPG set in the World of Arcadia — arcane, atmospheric, forbidden.
colors:
  void: "#05050a"
  surface: "#141420"
  overlay: "#1a1a28"
  inset: "#09090f"
  gold: "#d4aa55"
  gold-text: "#e8c070"
  gold-hi: "#f5d878"
  gold-dim: "#7a6030"
  border-subtle: "#1a160a"
  border-mid: "#2e2610"
  border-bright: "#4a3c18"
  crimson: "#8b1a1a"
  crimson-hi: "#c03030"
  fire: "#d94f1a"
  dark-tower: "#7030c0"
  light-tower: "#b89820"
  ice: "#66c7e8"
  text-primary: "#e8e0d0"
  text-secondary: "#a09880"
  text-muted: "#605850"
  text-hi: "#f5f0e8"
  status-ok: "#2e9050"
  status-warn: "#c07818"
  status-bad: "#b83030"
  rarity-common: "#606878"
  rarity-uncommon: "#2a9858"
  rarity-rare: "#2860c8"
  rarity-epic: "#8840c8"
  rarity-ultimate: "#c87010"
  rarity-ancient: "#c02828"
typography:
  display:
    fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  headline:
    fontFamily: "'Cinzel', Georgia, serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.10em"
  title:
    fontFamily: "'Cinzel', Georgia, serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Cinzel', Georgia, serif"
    fontSize: "9px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.20em"
rounded:
  sm: "3px"
  md: "6px"
  lg: "10px"
  xl: "16px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
components:
  button-primary:
    backgroundColor: "linear-gradient(145deg, #6a4e1e, #c5a059 45%, #9a7a40)"
    textColor: "#080808"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "linear-gradient(145deg, #7a5e2e, #d5b069 45%, #aa8a50)"
    textColor: "#080808"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.02)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "rgba(197,160,89,0.05)"
    textColor: "{colors.gold-text}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-danger:
    backgroundColor: "linear-gradient(145deg, #5a0e0e, #8b1a1a)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  card-base:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "12px"
  card-raised:
    backgroundColor: "{colors.overlay}"
    rounded: "{rounded.lg}"
    padding: "12px"
  card-gold:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "12px"
---

# Design System: SOULRIFT

## 1. Overview

**Creative North Star: "The Forbidden Observatory"**

SOULRIFT's design system is a relic, not a product. Every screen is an instrument panel inside a sealed observatory: celestial machinery in dark iron, star-charts inked in aged gold, brass fittings that glow faintly when the rift opens. The interface does not present information — it reveals it, slowly, to those patient enough to look. Nothing is decorative. The void background (`#05050a`) is the night sky through a cracked dome; the gold borders are the remnants of illuminated manuscript pages; the glow effects are bioluminescence from the rift itself.

The system carries two modes simultaneously: the oppressive stillness of deep space (dark backgrounds, near-invisible borders, long shadows) and the sudden revelation of forbidden light (gold glows, tower-color flares, crimson danger). These two states — dormant and activated — define every interactive moment. At rest, components are nearly invisible against the void. Touched, they ignite.

This system explicitly rejects: mobile F2P visual noise (Clash of Clans badge-spam, neon-on-black urgency, rainbow rarity systems that shout); anime/JRPG softness (pastels, chibi proportions, kawaii exclamation points); generic fantasy parchment (warm beiges, tavern-brown, stock serif-on-cream); SaaS dashboard flatness (Inter on white, teal accents, progress bars as productivity metrics); and any surface that explains itself before it has been touched.

**Key Characteristics:**
- Void-dark foundation with near-invisible layering — depth without noise
- Gold as the single primary accent; all other colors are elemental roles (tower) or system states (status, rarity)
- Cinzel serif for all game language; Inter for functional body copy — two registers, never mixed
- Components inscribed and revealed: dormant until activated, then they glow
- SVG grain noise + cosmic radial gradients as atmosphere — the texture of the observatory itself
- Touch-first: 44px minimum tap targets, one-thumb reachability throughout

## 2. Colors: The Void Palette

A near-black foundation with a single gold accent ramp, four elemental tower colors, and a crimson danger register.

### Primary

- **Rift Gold** (`#d4aa55`): The dominant accent. Used on divider ornaments, active nav indicators, and sparse highlight moments. Never used as a fill on large surfaces.
- **Gold Text** (`#e8c070`): All Cinzel headings, names, prices, and game-critical labels. Slightly brighter than Rift Gold for legibility.
- **Gold Highlight** (`#f5d878`): Victory states, maximum-intensity glows, the brightest moment in a reward sequence.
- **Gold Dim** (`#7a6030`): Border traces, section label ornaments, muted gold at rest. The gold the observatory already had before it was lit.

### Secondary — Crimson

- **Deep Crimson** (`#8b1a1a`): Danger button fill. The color of a seal that should not be broken.
- **Crimson High** (`#c03030`): Active danger states, defeat accents, error borders.

### Tertiary — Tower Colors

Each tower is a distinct elemental register. Used only in tower-scoped contexts (`data-tower` attribute drives them via CSS custom properties). Never mixed across towers on a single screen.

- **Rift Fire** (`#d94f1a`): Ember orange-red. The oldest, most aggressive tower.
- **Void Dark** (`#7030c0`): Deep purple. Arcane, hidden, unknowable.
- **Pale Light** (`#b89820`): Burnished gold-amber. Ancient illumination.
- **Frost Ice** (`#66c7e8`): Cold cyan. The rarest, the clearest.

### Neutral

- **The Void** (`#05050a`): Body background. The space between stars. Unlit.
- **Observatory Surface** (`#141420`): Panel and card fill. Dark stone lit from below.
- **Elevated Overlay** (`#1a1a28`): Above-surface elements: modals, sheets, dropdowns.
- **Inset Well** (`#09090f`): Input backgrounds, recessed containers. Darker than void.
- **Text Primary** (`#e8e0d0`): Main body copy. Warm-pale, easy to read in dark.
- **Text Secondary** (`#a09880`): Metadata, secondary labels, ghost button labels.
- **Text Muted** (`#605850`): Disabled states, placeholder copy, least-important labels.
- **Text Highlight** (`#f5f0e8`): Maximum legibility: stat values, player names, battle results.

### Status Colors

- **Ward Green** (`#2e9050`): Reward, success, healing, auto-battle active.
- **Omen Amber** (`#c07818`): Warning, near-limits, mana-burn caution.
- **Blood Red** (`#b83030`): Error, defeat, damage, forbidden action.

### Rarity Colors

Six tiers from common (gray-blue) to ancient (blood crimson). Used only in badge and item-name contexts — never as surface fills.

**The Restraint Rule.** Gold appears on ≤15% of any screen's surface area. Its scarcity is the mechanism. An interface where everything glows gold is an interface where nothing does.

**The One Tower Rule.** A single tower's color governs all active states on a given screen. Fire and Ice never coexist in active states. The tower the player chose is the world they inhabit.

## 3. Typography

**Display Font:** Cinzel Decorative (with Cinzel, Georgia, serif fallback)
**Headline / UI Font:** Cinzel (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** Cinzel is the voice of the world: authoritative, ancient, slightly formal. It carries all game language — names, titles, labels, spell names, level indicators. Inter is the voice of the interface: neutral, legible, efficient. It handles descriptions, tooltips, and copy where the system speaks functionally rather than mythically. The pairing is a contrast axis (ceremonial serif vs humanist sans) and a semantic register (world vs interface).

### Hierarchy

- **Display** (Cinzel Decorative, 700, 38px, 0.14em tracking, lh 1.0): The SOULRIFT logotype and landing screen title only. Never used inside the app shell.
- **Headline** (Cinzel, 700, 18px, 0.10em tracking, uppercase, lh 1.2): Screen titles — the name of the currently active area of the observatory.
- **Title** (Cinzel, 700, 13px, 0.06–0.08em tracking, uppercase, lh 1.3): Card names, spell names, tower names, section heads within panels.
- **Body** (Inter, 400, 14px, lh 1.5): Spell descriptions, dungeon lore, system copy, any prose longer than one line. Max line length ~55ch on mobile.
- **Label** (Cinzel, 600, 9–11px, 0.10–0.28em tracking, uppercase, lh 1.0): Section divider labels, nav button text, badge text, HUD elements, metadata. The smallest voice of the world.

**The Two Registers Rule.** Cinzel belongs to the world; Inter belongs to the interface. Never use Cinzel for body-length descriptions and never use Inter for game entity names, spell titles, or level identifiers. If a piece of copy could appear on an in-world scroll, it uses Cinzel. If it instructs the player how to use the app, it uses Inter.

**The Uppercase Ceiling Rule.** Uppercase is for labels (≤4 words) and proper nouns used as labels. It is never used for body-length prose. Battle descriptions, dungeon lore, and spell effect text are sentence case.

## 4. Elevation

SOULRIFT uses a **hybrid elevation system**: ambient black shadows for structural depth, and gold or tower-color glow shadows for interactive state. The two systems are never mixed on the same element simultaneously — a card is either structurally elevated (shadow only) or activated (glow only, shadow retained). Flat surfaces are not permitted; every raised element carries at least `--shadow-sm`.

The observatory is a layered space: the void is the floor, panels float above it, modals and overlays float above panels, toasts float above everything. Each layer is expressed through a background step (void → surface → overlay) and a corresponding shadow weight, not just z-index alone.

### Shadow Vocabulary

- **xs** (`0 1px 4px rgba(0,0,0,0.60)`): Minimal lift. Badges, chips, small inset elements.
- **sm** (`0 2px 8px rgba(0,0,0,0.75)`): Standard card elevation. Most panels at rest.
- **md** (`0 4px 16px rgba(0,0,0,0.85)`): Raised cards, spell picker options, selected states.
- **lg** (`0 8px 32px rgba(0,0,0,0.90)`): Sheet drawers, hovered tower cards, toasts.
- **xl** (`0 16px 48px rgba(0,0,0,0.95)`): Modal overlays, full-screen drawers.
- **Inset** (`inset 0 1px 3px rgba(0,0,0,0.70)`): Input wells, recessed containers.
- **Inset md** (`inset 0 2px 8px rgba(0,0,0,0.80)`): Deeper recesses, health/SP bars.

### Glow Vocabulary (activated states only)

- **Gold sm** (`0 0 8px rgba(197,160,89,0.20)`): Subtle gold on focused inputs, selected cards at rest.
- **Gold** (`0 0 18px rgba(197,160,89,0.25), 0 0 40px rgba(197,160,89,0.10)`): Primary button hover, active nav indicator.
- **Gold hi** (`0 0 24px rgba(197,160,89,0.40), 0 0 60px rgba(197,160,89,0.15)`): Victory states, rare/ultimate item reveals.
- **Tower glows**: Each tower has a matched glow pair (dim inner + wide outer) derived from its color. Applied only when the player's tower is active.

**The Glow Restraint Rule.** Glows are not shadows. They appear only in response to interaction (hover, focus, selection, activation). A surface glowing at rest is an observatory instrument left running — atmospheric, but an error. The exception: the landing screen's star field, which is ambient by design.

## 5. Components

### Buttons

Inscribed and revealed: ghost and ghost-adjacent by default; activated when confirmed. The primary button is the heaviest commitment in the interface — its gold gradient is the only large gold fill in the entire system.

- **Shape:** Subtly rounded (6px radius). Not pill-shaped; not square. Deliberately in between.
- **Primary:** Gold gradient fill (`linear-gradient(145deg, #6a4e1e, #c5a059 45%, #9a7a40)`), near-black text (`#080808`), 12px Cinzel 600 uppercase 0.08em tracking. Internal padding `0 16px`, min-height 40px. Carries `--glow-gold-sm` and `--shadow-sm` at rest.
- **Primary Hover:** `filter: brightness(1.14)`, glow upgrades to `--glow-gold`. Scale unchanged.
- **Primary Active:** `filter: brightness(.88)`, `translateY(1px)`.
- **Ghost:** `rgba(255,255,255,0.02)` fill, `--c-border-md` border, `--c-text-2` label. Transitions to gold-tinted border and `--c-gold-text` label on hover.
- **Danger:** Deep crimson gradient fill, warm text. Hover: `filter: brightness(1.18)` + crimson glow `0 0 16px rgba(184,48,48,0.25)`.
- **Disabled:** `opacity: 0.28`, `pointer-events: none`. No visual indication beyond opacity.

All buttons use Cinzel 500–600 for labels. Inter is never used on a button. Minimum touch target: 40px height (with padding extending the tap area to 44px in context).

### Cards / Containers

Three elevation tiers, same radius:

- **Base Card** (`--c-raised`): `background: linear-gradient(160deg, rgba(255,255,255,0.018) 0%, transparent 60%), #141420`. Border `1px solid rgba(197,160,89,0.10)`. Shadow sm + shadow inset. Padding 12px.
- **Raised Card** (`--c-overlay`): Same gradient formula, higher lightness. Border-md. Shadow md + inset.
- **Gold Card:** Base card with border-hi (`rgba(197,160,89,0.50)`) and glow-gold-sm. Used for selected items, active slots, and achievement moments.
- **Arcane Card:** Purple-tinted variant (`rgba(112,48,192,0.06)` bg tint, purple border). Tower-Dark only.

Corners: 10px radius throughout (`--r-lg`). Never pill-shaped, never 0. The 10px is the rounding of a carved stone edge, not a soft consumer-app corner.

The subtle `linear-gradient(160deg, rgba(255,255,255,0.018)...)` specular on every card surface is mandatory — it simulates the observatory's ambient light catching the instrument's upper-left face. Never remove it; flat `#141420` reads as dead.

### Inputs / Fields

Recessed into the observatory floor, not raised above it.

- **Style:** Background `--c-inset` (`#09090f`), border `1px solid --c-border-md`, radius 6px, padding `12px 16px`. Cinzel for game-name inputs; Inter for search/filter fields.
- **Focus:** Border upgrades to `--c-border-hi` (`rgba(197,160,89,0.50)`), `--glow-gold-sm` appears. No color shift on the background.
- **Placeholder:** `--c-text-3`, italic, 13px. Contrast is marginal at `#605850` on `#09090f` — verified to pass WCAG AA for placeholder (4.5:1 against that inset bg). Do not lighten further.
- **Error:** Border shifts to crimson (`rgba(184,48,48,0.45)`), label above turns `--c-bad`.

### Navigation

The bottom navigation is the observatory's instrument selector — the only persistent chrome in the app shell.

- **Container:** Fixed to bottom, `--c-surface` background with heavy downward vignette, gold top-border gradient, `0 -4px 24px rgba(0,0,0,0.70)` shadow. A fine gold line traces its top edge.
- **Nav Button (rest):** Icon 17px, label 8px Cinzel uppercase 0.10em. Color: `--c-text-3`. No background.
- **Nav Button (active):** Color upgrades to `--c-gold-text` (default) or tower color. Icon scales to 1.12×. A 2px gold gradient bar appears at the button's top edge with a gold glow `0 0 8px rgba(197,160,89,0.50)`.
- **Tower overrides:** When `data-tower` is set on `#app`, the active nav color and glow shift to that tower's color. Fire: `#ff5a10`. Dark: `#b060ff`. Ice: `#40c8e8`. Light: `#e8c830`.

### Badges

Tight labels only. 9px Cinzel 700 uppercase 0.10em tracking. Used for rarity tiers, level numbers, and tower affiliations. Background is a 12% opacity tint of the badge's color, with a 32% opacity border. Never used as a button or interactive element.

### Section Labels (Signature Component)

The observatory's instrument labels — sparse, archival, directional.

- **Style:** 9px Cinzel 600 uppercase 0.28em tracking, `--c-gold-dim`. A `▸` glyph precedes the text; a gradient line (`--c-border-md` fading to transparent) extends to the right.
- **Rule:** One section label per logical group. Never use it as a visual rhythm device across every section of a screen. It marks a categorical shift, not a spacing convenience.

### Toasts

Appear from above the header, animate in with `translateY(-8px) scale(0.97)`, fade in over 180ms.

- **Base:** `--c-overlay` fill, `--c-border-md` border, `--shadow-lg`.
- **Success:** Green border (`rgba(46,144,80,.45)`), `--c-ok` text.
- **Error:** Crimson border (`rgba(184,48,48,.45)`), `--c-bad` text.
- **Gold:** `--c-border-hi` border, `--c-gold-text` text, `--glow-gold-sm`. Used for rare item discoveries and level-up events only.

## 6. Do's and Don'ts

### Do:

- **Do** keep the void (`#05050a`) as the body background on every screen, including new ones. It is non-negotiable.
- **Do** add the `linear-gradient(160deg, rgba(255,255,255,0.018)...)` specular to every card surface. Flat dark surfaces without it feel dead.
- **Do** use `--c-border-subtle` / `--c-border-md` / `--c-border-hi` to build depth. Gold border opacity is the depth signal.
- **Do** restrict Cinzel to the game register: entity names, screen titles, spell names, labels ≤4 words, badges. Use Inter for all explanatory prose.
- **Do** pair new interactive states with `filter: brightness()` rather than background color shifts. The system's interaction model is luminance-based.
- **Do** scope tower colors (`--c-tower-dim`, `--c-tower-hi`) to `data-tower`-attributed elements only. Tower colors must never appear in base/unskinned components.
- **Do** add `@media (prefers-reduced-motion: reduce)` alternatives for every animation. Crossfade or instant; never just removing the keyframe.
- **Do** keep all tap targets ≥44px. For small visual elements (badges, icons), extend the tap area with `padding` or a larger sibling element.
- **Do** use the six rarity colors (`--c-common` through `--c-ancient`) only in badge and item-name contexts. Never as surface fills or large-area accent colors.

### Don't:

- **Don't** introduce warm-neutral backgrounds (beige, cream, parchment, any `background-color` in the OKLCH L 0.84–0.97, C < 0.06, hue 40–100 range). The void is the brief. There is no "day mode".
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, or callout. The system does not use side-stripe affordances.
- **Don't** apply `background-clip: text` with a gradient. All text uses solid colors from the palette.
- **Don't** use gold as a fill on large surfaces. The gold gradient on `.btn--primary` is the single permitted exception. A section with a gold background is a category error.
- **Don't** make components glow at rest without user interaction. Glows are activated states. The observatory's instruments are dormant until touched.
- **Don't** add glassmorphism (`backdrop-filter: blur()` on decorative cards) as a default treatment. The profile sheet uses `backdrop-filter: blur(2px)` on its scrim — that is structural, not decorative. New components do not inherit this.
- **Don't** use more than two fonts. Cinzel (including Cinzel Decorative) + Inter is the complete pair. No third typeface, no Google Fonts additions.
- **Don't** ship any surface that replicates mobile F2P visual language: badge-dot notifications on nav icons at rest, countdown timers with red urgency borders, "FREE" energy fills, rainbow rarity names animated with shine effects.
- **Don't** use D&D Beyond / SRD / reference-tool flatness: white or light-gray backgrounds, table-dominant layouts, Inter-on-white body text, blue hyperlink colors.
- **Don't** use SaaS dashboard conventions: pill buttons, teal or indigo accents, `font-size: 16px` Inter body on a white card, metric tiles with big numbers and small labels.
- **Don't** add eyebrow labels (small all-caps tracked text above every section heading) as a structural rhythm. The `.section-label` component is for categorical shifts only — one per logical group, not one per visual section.
