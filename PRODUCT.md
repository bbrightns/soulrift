# Product

## Register

product

## Users

Solo mobile players — one hand, phone screen, ambient light ranging from a dark room to outdoors. Sessions are self-paced: a quick inventory check, a focused battle, a long crafting session. The player is alone with the world; no one is explaining the UI to them. Discovery and mastery are part of the pleasure, not bugs to fix.

## Product Purpose

SOULRIFT is a solo fantasy RPG companion/game app set in the World of Arcadia. Players choose a tower allegiance (Fire, Dark, Light, Ice), ascend through levels, collect and fuse soul stones, battle enemies, and manage a character. Success looks like a player who loses track of time — absorbed in the lore, the systems, and the atmosphere.

## Brand Personality

Arcane. Oppressive. Revelatory.

The emotional target is 70% arcane-mysterious (discovery of forbidden magic, the thrill of hidden knowledge) and 30% dark-mythic (ancient, weighty, cosmic dread). Like finding a forgotten tome inside a sealed observatory — not a game, a relic.

Voice: sparse, declarative, slightly archaic without being costume-y. The UI does not explain itself eagerly. It reveals.

## Anti-references

- **Mobile F2P / gacha energy** (Clash of Clans, Raid Shadow Legends): bright, pushy, neon-on-black, monetisation pressure, badge spam.
- **Anime / JRPG aesthetics**: pastel, chibi, kawaii, fast particle effects, exclamation-heavy copy.
- **Generic fantasy tropes**: parchment backgrounds, stock dragon art, Comic Sans cousins, tavern-brown palettes.
- **D&D Beyond / reference-tool flatness**: utilitarian, desktop-first, document-like, no atmosphere.
- **Modern SaaS dashboard design**: clean white surfaces, rounded pill buttons, Inter at 16px on white, progress bars as productivity metrics.

## Design Principles

1. **The tome reveals, it does not shout.** Information surfaces when earned or sought. No unsolicited pop-ups, no nudge badges, no aggressive calls to action. The UI is a door, not a salesperson.
2. **Atmosphere is load-bearing.** The void, the gold, the glows are not decoration — they are the world. Every new surface or component must sustain the observatory feeling, not interrupt it.
3. **Restraint as power.** A single glow on the right element hits harder than glow everywhere. Use tower colors, gold, and glows at specific, meaningful moments — not as default decoration.
4. **Touch first, always.** All interactive surfaces are designed for one thumb on a phone screen. Tap targets ≥44px, no hover-only states, no content that requires precision.
5. **Discovery over instruction.** Empty states, first-run moments, and unfamiliar mechanics communicate through atmosphere and minimal copy — not tooltips, tutorials, or modal walls.

## Accessibility & Inclusion

- Target WCAG AA contrast for all body text and interactive states.
- All animations respect `prefers-reduced-motion: reduce` — crossfade or instant fallback, never hidden content.
- Touch targets minimum 44×44px throughout.
- No color-only state signaling — always pair color with icon, label, or pattern (important for rarity tiers and tower colors).
