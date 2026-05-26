---
name: Eldritch Manuscript
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#d1c5b4'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#9a8f80'
  outline-variant: '#4e4639'
  surface-tint: '#e9c176'
  primary: '#e9c176'
  on-primary: '#412d00'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#775a19'
  secondary: '#ffb3ad'
  on-secondary: '#680109'
  secondary-container: '#891c1d'
  on-secondary-container: '#ff9991'
  tertiary: '#d1c5b2'
  on-tertiary: '#363022'
  tertiary-container: '#afa492'
  on-tertiary-container: '#413a2c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#891c1d'
  tertiary-fixed: '#ede1cd'
  tertiary-fixed-dim: '#d1c5b2'
  on-tertiary-fixed: '#201b0f'
  on-tertiary-fixed-variant: '#4d4637'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
  void-surface: '#16161a'
  void-elevated: '#1e1e24'
  gold-light: '#e8c87a'
  gold-dim: '#7a6035'
  crimson-light: '#c42b2b'
  text-secondary: '#9a8f7a'
  text-muted: '#5a5248'
  rune-border: rgba(197, 160, 89, 0.15)
  rune-border-bright: rgba(197, 160, 89, 0.4)
typography:
  display-hero:
    fontFamily: Cinzel
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  headline-lg:
    fontFamily: Cinzel
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Cinzel
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  title-card:
    fontFamily: Cinzel
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  body-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-small:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Cinzel
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  label-micro:
    fontFamily: Cinzel
    fontSize: 9px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  margin-screen: 1rem
  gutter-grid: 1.5rem
---

## Brand & Style

The design system establishes an **Atmospheric Dark Fantasy** aesthetic, designed specifically for a mobile-first, text-heavy RPG. The brand personality is **mystical, prestigious, and arcane**, evoking the feeling of interacting with a living, enchanted artifact. 

The design style is a hybrid of **Minimalist Layering** and **Tactile Occultism**. It prioritizes high-density text readability while framing it with "void" depth and radiant, rune-etched accents. The UI should feel like a "God-ray" piercing through an obsidian abyss—focused, high-contrast, and deeply immersive. We avoid traditional skeumorphism in favor of "light-based" depth, using glows and radial gradients to signify importance rather than physical shadows.

## Colors

The palette is anchored in **The Void (#0a0a0b)**, providing a high-contrast foundation for text and golden illumination. 

- **Primary Gold**: Represents divinity, rarity, and active player agency. Use `gold-light` for interactive highlights and `gold-dim` for structural ornaments.
- **Secondary Crimson**: Reserved strictly for health depletion, danger states, and combat-related feedback.
- **Tertiary Parchment**: This is the primary text color, chosen to reduce the harshness of pure white on black, mimicking aged vellum.
- **Surface Strategy**: Use `void-surface` for container backgrounds and `void-elevated` for floating elements like tooltips or battle log entries. 
- **Atmospheric Gradients**: Use radial gradients (e.g., `radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, transparent 70%)`) to create ambient "pool of light" effects behind major UI sections.

## Typography

This system utilizes a strict hierarchy between **Cinzel** (the soul) and **Inter** (the mind).

- **Cinzel**: Used for lore titles, headers, and UI labels. It must be treated as a decorative element. Wider letter spacing (up to 0.5em for logos) enhances the "ancient manuscript" feel. Almost all Cinzel usage should be `uppercase`.
- **Inter**: Used for all logs, stats, and long-form descriptions. Because this is a text-heavy RPG, line-height is set generously (1.6) to ensure readability on small screens.
- **Runic Metadata**: Use `label-micro` for navigation and small status indicators to maintain the fantasy theme even in functional areas.

## Layout & Spacing

This design system employs a **Fluid Layout model** with a primary focus on the **Vertical Scroll**.

- **Mobile First**: Content is centered in a single column with a `margin-screen` of 16px. 
- **Sticky Zones**: 
    - **Top Status Bar**: A condensed 48px height zone for persistent stats (HP, Mana, Gold) with a `blur(12px)` background.
    - **Bottom Navigation**: A unified hub for primary actions, using `void-elevated` to separate it from the scrollable content.
- **The Log Rhythm**: Battle logs and story text follow a strict 8px vertical rhythm to create a sense of list-like order.
- **Modal Overlays**: Use a `3rem` top margin for modal panels to allow the underlying status bar to remain partially visible, reinforcing the "layering" concept.

## Elevation & Depth

Visual hierarchy is achieved through **Luminous Layering** rather than traditional shadows.

- **The Void Base**: The lowest level is the `#0a0a0b` background, often featuring subtle radial gradients of `#c5a059` at 5% opacity to create "focal points."
- **Tonal Tiers**: Cards and panels use `void-surface`. When a card is active or hovered, it doesn't move closer to the user; instead, its border opacity increases from `0.15` to `0.4`, and it gains a `0 0 12px` gold outer glow.
- **Glassmorphism**: Sticky bars and modals use `backdrop-filter: blur(12px)` combined with a 70% opaque `void-surface` fill. This suggests that the UI is a translucent overlay on top of the "void" of the game world.
- **Z-Index Tiers**:
    - `Level 0`: Background/Ambient effects.
    - `Level 1`: General content cards and text.
    - `Level 2`: Sticky Navigation and Status bars.
    - `Level 3`: Pop-up modals and Parchment logs.

## Shapes

The shape language is **Sharp and Architectural**. 

- **Primary Radius**: A minimal `2px` (Soft) radius is applied to buttons and inputs to avoid a "corporate" rounded look while remaining modern.
- **Containers**: Cards use a `4px` radius. 
- **Decorative Runes**: Every significant card or panel must feature "Corner Runes"—1px gold lines that bracket the corners (top-left and bottom-right) in an L-shape.
- **Status Markers**: Use 45-degree rotated squares (diamonds) for bullet points or active state indicators, reinforcing the geometric/occult theme.

## Components

- **Buttons**: Primary buttons are solid `void-elevated` with a 1px `gold-dim` border. Text is `label-caps`. On press, the border glows `gold-light`.
- **Glow-Stone Cards**: Interactive cards (Spells, Items) feature a central radial gradient that matches the item's "alignment" (e.g., violet for Void, orange for Fire).
- **Parchment Logs**: Special story moments use a subtle `text-secondary` background with a rough, 1px "torn edge" border effect to simulate physical paper within the digital void.
- **Unified Bottom Bar**: Icons should be minimalist line-art in `gold-dim`, turning `gold-light` with a vertical 2px line underneath when active.
- **Status Bar**: A persistent top-screen element. Stats are displayed as "Pills" with a `2px` radius. HP bars use a `crimson` to `crimson-light` horizontal gradient.
- **Input Fields**: Ghost-style. No fill, only a bottom `1px` border of `rune-border`. On focus, the border expands to the full perimeter and glows.
- **Dividers**: Instead of simple lines, use a `1px` gradient line that fades out at the edges, with a `45deg` diamond icon at the center.