# SOULRIFT RPG CHRONICLES — Spell Library Prompt r2
## Magic Fortress-Aligned 40-Spell Catalog for Light / Dark / Fire / Ice Towers

Use this prompt in Codex / Claude / Cursor to create or update the **Spell Library**, **Spell Data**, **Shop Filtering**, **Magic Stone Forging**, **Set Order**, and **Skill Icon Generation Prompts** for Soulrift RPG Chronicles.

This r2 version updates the previous spell library using `magicfortress_info.md` as the source of truth while preserving as many familiar spell names as possible.

---

# PROMPT START

Continue from the current **Soulrift RPG Chronicles** project.

Do **NOT** redesign the whole game.
Do **NOT** rebuild unrelated pages.
Do **NOT** change the current Gothic Dark Fantasy visual identity.
Do **NOT** add real multiplayer, server, database, authentication, guild economy, or backend yet.

This task is to create the complete MVP spell/skill catalog inspired by the classic **Magic Fortress** structure.

---

# 1. Task Goal

Create a full spell catalog for **4 main towers**:

1. **Light Tower**
2. **Dark Tower**
3. **Fire Tower**
4. **Ice Tower**

Each tower must have **10 spells**.

Total: **40 spells**

Rarity structure per tower:

| Rarity | Amount per Tower | Purpose |
|---|---:|---|
| Common | 4 | Early-game / basic stones / shop-ready spells |
| Uncommon | 3 | Tower identity / monster drops |
| Rare | 2 | Build-defining spells |
| Ultimate | 1 | Late-game boss fantasy finisher |

Important rules:

- Common spells are allowed in the shop.
- Uncommon, Rare, and Ultimate spells are **NOT** sold in the basic shop.
- Uncommon / Rare / Ultimate spells are obtained from monster drops, boss drops, Catalyst Exchange, map progression, or special progression systems.
- The basic shop must show only **Common spells from the player's selected tower**.
- The Spell Library / Encyclopedia must show **all 40 spells from all towers**.
- New players receive **3 copies of their tower's Shot stone** from Kolis after completing the tower details onboarding.

---

# 2. Game Context

Soulrift is a **text-based tactical 10-turn spell planning RPG**.

Before battle, the player arranges 10 spell stones in order.

During battle, combat runs automatically and is shown through dramatic text logs.

Core Magic Fortress rules to preserve:

- Combat uses **10-Turn Preset Planning**.
- In PvE, monsters act first on turn 1, so defensive planning matters.
- HP reaches 0 means defeat.
- HP and SP refill after battle.
- If a spell's SP cost cannot be paid, that spell fails and the player wastes that turn.
- Some **Enchants** may temporarily reduce Max HP in exchange for stronger power.
- Some **Hexes** may reduce Max SP or disrupt spell planning.
- Magic stones have levels **Lv. 1-11**.
- Higher-level stones improve damage, scaling, status strength, and special effects.
- Duplicate spell stones matter because Set Order can use multiple owned copies.

Each spell object should include:

```js
{
  id: "",
  name: "",
  tower: "",
  element: "",
  rarity: "",
  role: "",
  spCost: 0,
  basePower: 0,
  scaling: "",
  condition: "",
  effect: "",
  combo: "",
  obtain: "",
  battleLog: {
    cast: "",
    trigger: "",
    expire: ""
  },
  rules: [],
  iconPrompt: ""
}
```

---

# 3. Tower Identity r2

## Light Tower

Classic identity:

- High HP
- High SP
- Low direct attack
- Protection, healing, reflection, status cleansing
- Charge-based burst finisher
- Medium difficulty

Main play pattern:

- survive early enemy pressure
- build shields / holy guard / charge
- release accumulated power in one decisive turn

Color identity:

- radiant gold
- ivory
- sacred white
- pale sun yellow
- blue-white holy glow

---

## Dark Tower

Classic identity:

- Lowest HP / fragile defense
- Highest damage
- Curse, armor break, fog, true damage
- Vampiric healing
- Demon summoning pressure
- Night-time power window between 18:00 and 06:00 server time
- Medium difficulty with high risk

Main play pattern:

- weaken or blind enemy
- stack curse / dark combo
- burst with critical, true damage, night skills, or execute effects

Color identity:

- violet
- black
- blood red
- abyssal purple
- cold moonlight silver

---

## Fire Tower

Classic identity:

- Highest HP
- Low SP
- High attack
- Easiest early tower
- Burn stacking and Explosion Burn
- Fire Thief / money stealing / farming economy
- Dragon and Wyvern synergy
- Requires careful SP budgeting despite simple early power

Main play pattern:

- apply Burn
- steal Credit / Gold while fighting
- detonate Burn stacks
- later combine with dragon commands

Color identity:

- crimson
- ember orange
- molten gold
- volcanic black
- dragon-scale bronze

---

## Ice Tower

Classic identity:

- Lowest HP
- Highest SP
- Medium attack
- Highest difficulty
- Freeze, SP recovery, mana control, disruption
- Golem Master / mechanical summon route
- Mana burst combo route

Main play pattern:

- interrupt enemy turns
- refill SP and extend planning lines
- freeze or delay key enemy actions
- finish with mana burst or golem pressure

Color identity:

- glacial blue
- silver
- cyan
- cold white
- arcane steel

---

# 4. Shared Skill Icon Art Direction

All skill icon prompts should follow this style:

> Dark fantasy browser RPG skill icon, gothic magical UI, semi-realistic painted style, high contrast, readable at small size, circular spell-stone frame, glowing magical energy, ancient occult fantasy, no text, no letters, no UI labels, transparent background if possible.

Do not use generic icons.
Each spell should feel unique and recognizable.

Rarity styling:

| Rarity | Visual Treatment |
|---|---|
| Common | simple magical stone frame |
| Uncommon | stronger glow / special effect |
| Rare | ornate frame / premium detail |
| Ultimate | legendary aura / dramatic composition |

---

# 5. Shop Rules

The Arcane Market / Shop must:

- show only Common spells
- show only spells matching the player's selected tower
- not show Uncommon, Rare, or Ultimate spells
- allow buying Common spell stones
- subtract Credit / Gold
- add purchased spell stones to inventory
- save inventory and Credit / Gold to localStorage

Example:

If the player selected **Fire Tower**, the shop should show only:

- Fire Shot
- Burn
- Fire Thief
- Ember Skin

The player should NOT be able to buy:

- Dark Shot
- Light Shot
- Ice Shot
- any Uncommon / Rare / Ultimate spell

---

# 6. Spell Library Rules

The Spell Library must:

- show all 40 spells
- allow filtering by tower
- allow filtering by rarity
- show full details
- show obtain method
- show battle log samples
- show icon placeholder or generated icon area
- show icon generation prompt for each spell in development/debug mode

The Spell Library is read-only.
It is NOT the shop.

---

# 7. Full Spell Catalog

## LIGHT TOWER SPELLS

### 1. Light Shot

```js
{
  id: "light_shot",
  name: "Light Shot",
  tower: "Light",
  element: "Light",
  rarity: "Common",
  role: "Basic Holy Damage",
  spCost: 7,
  basePower: 24,
  scaling: "Damage increases by magic stone level.",
  condition: "None.",
  effect: "Deal basic holy damage to one enemy.",
  combo: "Can become the release target for Light Charge effects.",
  obtain: "Starter reward from Kolis and Light Tower shop.",
  battleLog: {
    cast: "The mage gathers a clean shard of holy light.",
    trigger: "Light Shot strikes the enemy with sacred force.",
    expire: ""
  },
  rules: ["New Light players receive 3 Light Shot stones from Kolis."],
  iconPrompt: "Dark fantasy RPG skill icon of a golden holy light projectile, radiant ivory glow, sacred circular spell-stone frame, no text, transparent background if possible."
}
```

### 2. Light Charge

```js
{
  id: "light_charge",
  name: "Light Charge",
  tower: "Light",
  element: "Light",
  rarity: "Common",
  role: "Charge Setup",
  spCost: 6,
  basePower: 0,
  scaling: "Stored charge value increases by magic stone level.",
  condition: "No direct damage this turn.",
  effect: "Store holy energy. Each charge increases the next compatible Light release spell.",
  combo: "Use multiple times before Charge Release - Light Shot or Heavenfall Chronicle.",
  obtain: "Light Tower shop.",
  battleLog: {
    cast: "Radiant power gathers silently within the spell circle.",
    trigger: "Light Charge stores holy energy for a later release.",
    expire: ""
  },
  rules: ["Charge stacks should survive until consumed by a release spell or battle end."],
  iconPrompt: "Magic spell icon for Light Charge, a swirling vortex of brilliant white and golden solar energy condensing into a glowing sphere, magical runes floating around, dark contrasting background, fantasy RPG style, circular spell-stone frame, no text."
}
```

### 3. Holy Guard

```js
{
  id: "holy_guard",
  name: "Holy Guard",
  tower: "Light",
  element: "Light",
  rarity: "Common",
  role: "Defense Buff",
  spCost: 10,
  basePower: 0,
  scaling: "Defense bonus increases by magic stone level.",
  condition: "None.",
  effect: "Increase physical and magical defense for 2 turns.",
  combo: "Pairs with monster-first PvE rules and improves survival before charging.",
  obtain: "Light Tower shop.",
  battleLog: {
    cast: "Holy particles form a guardian mantle around the mage.",
    trigger: "Holy Guard reduces incoming damage.",
    expire: "The holy guard fades."
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of a radiant guardian shield around a hooded mage, ivory gold light, gothic circular spell-stone frame, no text, transparent background if possible."
}
```

### 4. Shield of Absorption

```js
{
  id: "shield_of_absorption",
  name: "Shield of Absorption",
  tower: "Light",
  element: "Light",
  rarity: "Common",
  role: "Shield / Conversion",
  spCost: 12,
  basePower: 34,
  scaling: "Shield value and conversion rate increase by magic stone level.",
  condition: "Absorbs damage received while active.",
  effect: "Create a shield that absorbs incoming damage and converts a portion of absorbed damage into HP or SP recovery.",
  combo: "Strong before charge turns or against monster-first openers.",
  obtain: "Light Tower shop.",
  battleLog: {
    cast: "A luminous barrier opens like a sacred lens.",
    trigger: "Shield of Absorption drinks in the impact and returns power to the mage.",
    expire: "The absorbing shield dissolves."
  },
  rules: ["Conversion is based on absorbed damage, not raw incoming damage."],
  iconPrompt: "Dark fantasy RPG skill icon of a golden translucent shield absorbing dark energy into a holy core, gothic circular spell-stone frame, no text."
}
```

### 5. Charge Release - Light Shot

```js
{
  id: "charge_release_light_shot",
  name: "Charge Release - Light Shot",
  tower: "Light",
  element: "Light",
  rarity: "Uncommon",
  role: "Charge Finisher",
  spCost: 16,
  basePower: 48,
  scaling: "Damage increases by magic stone level and stored Light Charge count.",
  condition: "Best used after Light Charge.",
  effect: "Consume stored Light Charge stacks to deal heavy holy damage.",
  combo: "The more turns spent charging, the stronger the release.",
  obtain: "Monster drop from holy or ancient enemies, or paired unlock with Light Charge.",
  battleLog: {
    cast: "Stored radiance focuses into a single impossible point.",
    trigger: "Charge Release - Light Shot consumes holy charge and erupts forward.",
    expire: ""
  },
  rules: ["Consumes all Light Charge stacks."],
  iconPrompt: "Dark fantasy RPG skill icon of a blinding golden beam released from a charged holy orb, ivory gold light, circular spell-stone frame, no text."
}
```

### 6. Energy Blast

```js
{
  id: "energy_blast",
  name: "Energy Blast",
  tower: "Light",
  element: "Light",
  rarity: "Uncommon",
  role: "Accuracy Pierce",
  spCost: 15,
  basePower: 50,
  scaling: "Damage and anti-evasion reliability increase by magic stone level.",
  condition: "Best against evasive targets.",
  effect: "Release concentrated holy energy that ignores or reduces enemy evasion.",
  combo: "Reliable finisher when defensive play must still connect.",
  obtain: "Monster drop from Magi Graveyard or Catalyst Exchange.",
  battleLog: {
    cast: "The mage compresses holy energy into a piercing blast.",
    trigger: "Energy Blast cuts through evasive movement.",
    expire: ""
  },
  rules: ["Should bypass dodge bonuses, not all defense."],
  iconPrompt: "Dark fantasy RPG skill icon of a condensed white-gold energy wave piercing through shadow mist, gothic circular spell-stone frame, no text."
}
```

### 7. Angel Wing

```js
{
  id: "angel_wing",
  name: "Angel Wing",
  tower: "Light",
  element: "Light",
  rarity: "Uncommon",
  role: "Evasion / Tempo",
  spCost: 14,
  basePower: 0,
  scaling: "Dodge reliability and duration improve by magic stone level.",
  condition: "Best before expected heavy enemy attack.",
  effect: "Gain a sacred wing buff that can completely avoid the next incoming direct attack.",
  combo: "Creates a safe turn to charge or heal afterward.",
  obtain: "Monster drop from angelic, ancient, or guardian enemies.",
  battleLog: {
    cast: "Wings of pale light unfold behind the mage.",
    trigger: "Angel Wing turns the enemy strike into empty air.",
    expire: "The angelic wings scatter into feathers of light."
  },
  rules: ["Avoids one direct attack only. Does not cleanse DoT already applied."],
  iconPrompt: "Dark fantasy RPG skill icon of luminous angel wings crossing over a mage silhouette, sacred gold and white glow, circular spell-stone frame, no text."
}
```

### 8. Divine Reflection

```js
{
  id: "divine_reflection",
  name: "Divine Reflection",
  tower: "Light",
  element: "Light",
  rarity: "Rare",
  role: "Counter / Reflection",
  spCost: 24,
  basePower: 0,
  scaling: "Reflection percentage increases by level up to and beyond 100% at high stone levels.",
  condition: "Reflects only the next direct damage received before the effect expires.",
  effect: "Prepare a radiant mirror. When the player receives direct damage from the next enemy attack, reflect a percentage of actual HP damage received back to the enemy.",
  combo: "Works after Shield of Absorption for survival, then Holy Guard or healing afterward.",
  obtain: "Rare guardian boss drop or Catalyst Exchange. Not sold in shop.",
  battleLog: {
    cast: "The mage raises a divine mirror of radiant judgment.",
    trigger: "Divine Reflection mirrors the enemy's attack back as holy damage.",
    expire: "The divine mirror fades without reflecting an attack."
  },
  rules: [
    "Reflects only direct damage.",
    "Does not reflect Burn, poison, DoT, passive damage, or reflected damage.",
    "Does not stack with itself.",
    "Expires after one enemy action.",
    "Reflection damage is based on actual HP damage received after shield and mitigation."
  ],
  iconPrompt: "Dark fantasy RPG skill icon of a radiant golden mirror shield reflecting a crimson enemy strike, gothic holy magic, ivory and royal gold glow, ornate circular spell-stone frame, no text."
}
```

### 9. Chorus of Sanctuary

```js
{
  id: "chorus_of_sanctuary",
  name: "Chorus of Sanctuary",
  tower: "Light",
  element: "Light",
  rarity: "Rare",
  role: "Regeneration / Cleanse Field",
  spCost: 26,
  basePower: 32,
  scaling: "Healing and cleanse strength increase by magic stone level.",
  condition: "Best after taking sustained damage or status pressure.",
  effect: "Create a sanctuary field that restores HP and cleanses negative statuses over several turns.",
  combo: "Allows Light to survive long enough to build Charge Release lines.",
  obtain: "Rare drop from Magi Graveyard, Library of Magi, or Light boss.",
  battleLog: {
    cast: "A sacred chorus rolls across the battlefield.",
    trigger: "Chorus of Sanctuary restores HP and purges corruption.",
    expire: "The sanctuary hymn falls silent."
  },
  rules: ["Cleanse should not remove boss-only permanent mechanics unless explicitly allowed."],
  iconPrompt: "Dark fantasy RPG skill icon of a cathedral-like holy sound wave cleansing black mist, golden sanctuary circle, ornate spell-stone frame, no text."
}
```

### 10. Heavenfall Chronicle

```js
{
  id: "heavenfall_chronicle",
  name: "Heavenfall Chronicle",
  tower: "Light",
  element: "Light",
  rarity: "Ultimate",
  role: "Ultimate Charge Finisher",
  spCost: 40,
  basePower: 145,
  scaling: "Massive scaling with magic stone level, stored Light Charge, active shields, and active buffs.",
  condition: "Requires defensive setup and charge setup for maximum power.",
  effect: "Deal massive holy damage based on active buffs, shields, and stored radiant charge.",
  combo: "Best after Holy Guard, Shield of Absorption, Light Charge, and Charge Release setup.",
  obtain: "Ultimate boss drop after late map progression / quest 4 equivalent.",
  battleLog: {
    cast: "The heavens open, and a chronicle of light descends upon the enemy.",
    trigger: "Heavenfall Chronicle converts sacred preparation into judgment.",
    expire: ""
  },
  rules: ["Should feel powerful but require setup turns."],
  iconPrompt: "Dark fantasy RPG ultimate skill icon of an ancient golden heavenly book opening above a battlefield, beams of sacred light falling, ivory and gold, gothic legendary frame, no text."
}
```

## DARK TOWER SPELLS

### 11. Dark Shot

```js
{
  id: "dark_shot",
  name: "Dark Shot",
  tower: "Dark",
  element: "Dark",
  rarity: "Common",
  role: "Basic Dark Damage",
  spCost: 9,
  basePower: 36,
  scaling: "Damage increases by magic stone level.",
  condition: "None.",
  effect: "Deal basic dark damage to one enemy.",
  combo: "Feeds Dark Combo and curse-based finishers.",
  obtain: "Starter reward from Kolis and Dark Tower shop.",
  battleLog: {
    cast: "A shard of darkness pierces the enemy.",
    trigger: "Dark Shot wounds the target with abyssal force.",
    expire: ""
  },
  rules: ["New Dark players receive 3 Dark Shot stones from Kolis."],
  iconPrompt: "Dark fantasy RPG skill icon of a black violet shadow projectile, abyssal energy, gothic circular spell-stone frame, no text, transparent background if possible."
}
```

### 12. Curse Fang

```js
{
  id: "curse_fang",
  name: "Curse Fang",
  tower: "Dark",
  element: "Dark",
  rarity: "Common",
  role: "Curse Setup",
  spCost: 10,
  basePower: 16,
  scaling: "Curse strength increases by magic stone level.",
  condition: "None.",
  effect: "Apply Curse. Cursed enemies take increased dark damage.",
  combo: "Improves Dark Combo, Abyssal Crit, Dark Rift, and execute spells.",
  obtain: "Dark Tower shop.",
  battleLog: {
    cast: "A cursed fang bites into the enemy's soul.",
    trigger: "Curse Fang weakens the enemy against dark magic.",
    expire: "The curse fades from the enemy."
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of a black cursed fang with violet runes and blood-red aura, gothic circular spell-stone frame, no text."
}
```

### 13. Fog

```js
{
  id: "fog",
  name: "Fog",
  tower: "Dark",
  element: "Dark",
  rarity: "Common",
  role: "Disruption / Blind",
  spCost: 11,
  basePower: 0,
  scaling: "Miss chance and disruption reliability increase by magic stone level.",
  condition: "None.",
  effect: "Cover the battlefield in dark fog, increasing the enemy's chance to miss or fail a spell.",
  combo: "Buys fragile Dark players time to set up curse and burst.",
  obtain: "Dark Tower shop.",
  battleLog: {
    cast: "A black fog crawls across the battlefield.",
    trigger: "Fog disrupts the enemy's aim and casting.",
    expire: "The dark fog thins."
  },
  rules: ["Should not make bosses helpless; bosses may have resistance."],
  iconPrompt: "Dark fantasy RPG skill icon of thick violet-black fog swallowing a battlefield silhouette, gothic circular spell-stone frame, no text."
}
```

### 14. Soul Drain

```js
{
  id: "soul_drain",
  name: "Soul Drain",
  tower: "Dark",
  element: "Dark",
  rarity: "Common",
  role: "Vampiric Healing",
  spCost: 12,
  basePower: 26,
  scaling: "Damage and healing increase by magic stone level.",
  condition: "None.",
  effect: "Deal dark damage and heal the player for part of the damage dealt.",
  combo: "Healing increases if the enemy is cursed.",
  obtain: "Dark Tower shop.",
  battleLog: {
    cast: "The mage tears life from the enemy and drinks it as power.",
    trigger: "Soul Drain restores HP from the enemy's soul.",
    expire: ""
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of violet soul energy being drained into a dark hand, black and purple glow, gothic circular spell-stone frame, no text."
}
```

### 15. Siege

```js
{
  id: "siege",
  name: "Siege",
  tower: "Dark",
  element: "Dark",
  rarity: "Uncommon",
  role: "Armor Break",
  spCost: 15,
  basePower: 34,
  scaling: "Damage and defense reduction increase by magic stone level.",
  condition: "Best before high-damage spells.",
  effect: "Crush enemy armor and reduce defense for the current battle.",
  combo: "Sets up Dark Combo, Abyssal Crit, and Night Raid.",
  obtain: "Monster drop from armored or fortress enemies.",
  battleLog: {
    cast: "A dark siege force hammers the enemy's defenses.",
    trigger: "Siege cracks armor and weakens protection.",
    expire: ""
  },
  rules: ["Defense reduction should have a cap."],
  iconPrompt: "Dark fantasy RPG skill icon of black siege chains crushing a cracked shield, violet impact sparks, gothic circular spell-stone frame, no text."
}
```

### 16. Dark Combo

```js
{
  id: "dark_combo",
  name: "Dark Combo",
  tower: "Dark",
  element: "Dark",
  rarity: "Uncommon",
  role: "Combo Amplifier / Crit Scaling",
  spCost: 15,
  basePower: 46,
  scaling: "Damage and critical multiplier improve by magic stone level. At high levels, this can reach x2-style critical fantasy.",
  condition: "Best used after another Dark spell.",
  effect: "Deal dark damage. Consecutive Dark spells increase the dark combo multiplier.",
  combo: "Main Dark Tower identity spell.",
  obtain: "Monster drop from dark enemies.",
  battleLog: {
    cast: "The darkness compounds, each strike feeding the next.",
    trigger: "Dark Combo increases the dark chain multiplier.",
    expire: ""
  },
  rules: ["Preserve the classic Dark Combo (Crit x2) fantasy at high investment."],
  iconPrompt: "Dark fantasy spell icon for Dark Combo, two intersecting slashing energy blades of purple and obsidian shadow magic, high impact critical hit visual effect, dark gothic theme, gaming UI design, sleek and sharp, no text."
}
```

### 17. Night Raid

```js
{
  id: "night_raid",
  name: "Night Raid",
  tower: "Dark",
  element: "Dark",
  rarity: "Uncommon",
  role: "Time-Window Burst",
  spCost: 18,
  basePower: 54,
  scaling: "Damage and night bonus increase by magic stone level.",
  condition: "Stronger between 18:00 and 06:00 server time.",
  effect: "Deal fast dark damage. Damage is greatly increased during the night window.",
  combo: "Pairs with Curse Fang, Siege, and Dark Combo.",
  obtain: "Monster drop from nocturnal enemies or Catalyst Exchange.",
  battleLog: {
    cast: "The mage vanishes into the hour of night.",
    trigger: "Night Raid strikes with amplified midnight force.",
    expire: ""
  },
  rules: ["In local-only MVP, simulate server time using the player's local time until backend exists."],
  iconPrompt: "Dark fantasy RPG skill icon of a midnight assassin strike under a crescent moon, violet-black trails, gothic circular spell-stone frame, no text."
}
```

### 18. Dark Rift

```js
{
  id: "dark_rift",
  name: "Dark Rift",
  tower: "Dark",
  element: "Dark",
  rarity: "Rare",
  role: "True Damage",
  spCost: 26,
  basePower: 78,
  scaling: "True damage increases by magic stone level.",
  condition: "Best against heavily defended targets.",
  effect: "Open a dimensional rift and deal damage that bypasses defense.",
  combo: "Very strong after Curse Fang, but expensive for Dark's fragile survival plan.",
  obtain: "Rare drop from Library of Magi, Doppelganger, or Dark boss.",
  battleLog: {
    cast: "A rift opens where the enemy's shadow should be.",
    trigger: "Dark Rift bypasses defense and wounds reality itself.",
    expire: ""
  },
  rules: ["True damage should bypass defense but not immunity or scripted boss shields unless specified."],
  iconPrompt: "Dark fantasy RPG skill icon of a violet-black dimensional tear splitting a shield apart, ornate gothic spell-stone frame, no text."
}
```

### 19. Demon Summoning

```js
{
  id: "demon_summoning",
  name: "Demon Summoning",
  tower: "Dark",
  element: "Dark",
  rarity: "Rare",
  role: "Summon / Pressure",
  spCost: 28,
  basePower: 38,
  scaling: "Summon damage and duration increase by magic stone level.",
  condition: "Best when the player can survive several turns.",
  effect: "Summon a demon familiar that attacks or pressures the enemy for several turns.",
  combo: "Excellent against defensive Light builds and while Fog is active.",
  obtain: "Rare ritual enemy drop, Doryl Watchtower, or Catalyst Exchange.",
  battleLog: {
    cast: "A demon claw breaks through the summoning circle.",
    trigger: "The summoned demon rends the enemy.",
    expire: "The demon is pulled back into the abyss."
  },
  rules: ["Summon attacks should be represented in text logs and should not require real-time controls."],
  iconPrompt: "Dark fantasy RPG skill icon of a horned demon silhouette emerging from a violet summoning circle, blood-red runes, ornate spell-stone frame, no text."
}
```

### 20. Oblivion Gospel

```js
{
  id: "oblivion_gospel",
  name: "Oblivion Gospel",
  tower: "Dark",
  element: "Dark",
  rarity: "Ultimate",
  role: "Ultimate Curse / Combo Finisher",
  spCost: 42,
  basePower: 165,
  scaling: "Massive scaling with magic stone level, Curse, Siege, Dark Combo count, and night window bonus.",
  condition: "Requires prior dark setup for maximum power.",
  effect: "Deal catastrophic dark damage. If curse and combo requirements are met, may execute a weakened enemy.",
  combo: "Best after Curse Fang, Siege, Fog, Dark Combo, and Night Raid timing.",
  obtain: "Ultimate boss drop after late map progression / quest 4 equivalent.",
  battleLog: {
    cast: "The gospel of oblivion is recited, and the enemy's existence begins to collapse.",
    trigger: "Oblivion Gospel consumes accumulated dark power for catastrophic damage.",
    expire: ""
  },
  rules: ["Execution threshold should be conservative in MVP balance."],
  iconPrompt: "Dark fantasy RPG ultimate skill icon of an ancient black book opening into a void, violet abyssal light, blood-red runes, gothic legendary spell frame, no text."
}
```

## FIRE TOWER SPELLS

### 21. Fire Shot

```js
{
  id: "fire_shot",
  name: "Fire Shot",
  tower: "Fire",
  element: "Fire",
  rarity: "Common",
  role: "Basic Fire Damage",
  spCost: 8,
  basePower: 30,
  scaling: "Damage increases by magic stone level.",
  condition: "None.",
  effect: "Deal basic fire damage to one enemy.",
  combo: "Feeds Burn and Fire combo plans.",
  obtain: "Starter reward from Kolis and Fire Tower shop.",
  battleLog: {
    cast: "The mage launches a burning projectile into the enemy.",
    trigger: "Fire Shot scorches the target.",
    expire: ""
  },
  rules: ["New Fire players receive 3 Fire Shot stones from Kolis."],
  iconPrompt: "Dark fantasy RPG skill icon of a blazing fire projectile, ember orange flame, molten glow, circular spell-stone frame, gothic fantasy style, no text."
}
```

### 22. Burn

```js
{
  id: "burn",
  name: "Burn",
  tower: "Fire",
  element: "Fire",
  rarity: "Common",
  role: "Stacking Damage Over Time",
  spCost: 10,
  basePower: 12,
  scaling: "Burn damage and stack strength increase by magic stone level.",
  condition: "None.",
  effect: "Apply Burn. Burn damages the enemy at the start of each turn and can stack.",
  combo: "Explosion Burn consumes Burn stacks for burst damage.",
  obtain: "Fire Tower shop.",
  battleLog: {
    cast: "A harsh flame brands the enemy.",
    trigger: "Burn sears the enemy at the start of the turn.",
    expire: "The flames gutter out."
  },
  rules: ["Burn should stack but have a practical cap for balance."],
  iconPrompt: "Dark fantasy RPG skill icon of a flaming sigil burned into dark metal, crimson ember glow, molten rune circle, circular spell-stone frame, no text."
}
```

### 23. Fire Thief

```js
{
  id: "fire_thief",
  name: "Fire Thief",
  tower: "Fire",
  element: "Fire",
  rarity: "Common",
  role: "Damage + Credit Steal",
  spCost: 12,
  basePower: 24,
  scaling: "Damage and stolen Credit increase by magic stone level.",
  condition: "The spell must successfully deal damage to steal Credit.",
  effect: "Deal fire damage and steal a small amount of Credit / Gold from the enemy.",
  combo: "Steals extra Credit if the enemy is Burning.",
  obtain: "Fire Tower shop.",
  battleLog: {
    cast: "Flames twist into greedy hands and rip Credit from the enemy.",
    trigger: "Fire Thief burns and steals treasure.",
    expire: ""
  },
  rules: ["In MVP, stolen Credit can be generated from PvE reward tables instead of taking currency from real players."],
  iconPrompt: "Magic spell icon for Fire Thief, a mischievous fox made of embers and orange fire stealing glowing gold coins out of a burnt wooden chest, sparks and smoke rising, clean game illustration style, vibrant colors, circular spell-stone frame, no text."
}
```

### 24. Ember Skin

```js
{
  id: "ember_skin",
  name: "Ember Skin",
  tower: "Fire",
  element: "Fire",
  rarity: "Common",
  role: "Self Buff / Survival",
  spCost: 9,
  basePower: 0,
  scaling: "Protection increases by magic stone level.",
  condition: "None.",
  effect: "Increase temporary HP or reduce incoming damage for 2 turns.",
  combo: "Helps Fire survive while saving SP for Burn detonation.",
  obtain: "Fire Tower shop.",
  battleLog: {
    cast: "Embers wrap around the mage like living armor.",
    trigger: "Ember Skin absorbs part of the incoming damage.",
    expire: "The ember armor fades into ash."
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of a mage silhouette covered in ember armor, crimson and molten gold glow, circular spell-stone frame, no text."
}
```

### 25. Explosion Burn

```js
{
  id: "explosion_burn",
  name: "Explosion Burn",
  tower: "Fire",
  element: "Fire",
  rarity: "Uncommon",
  role: "Burn Detonation",
  spCost: 18,
  basePower: 58,
  scaling: "Explosion damage increases by magic stone level and consumed Burn stacks.",
  condition: "Enemy should have Burn stacks.",
  effect: "Consume Burn stacks on the enemy and convert them into a single heavy explosion.",
  combo: "Core Fire finisher after repeated Burn setup.",
  obtain: "Monster drop from fire-aligned enemies or Catalyst Exchange.",
  battleLog: {
    cast: "The burn marks pulse like buried bombs.",
    trigger: "Explosion Burn consumes every flame and detonates.",
    expire: ""
  },
  rules: ["Consumes Burn stacks. Damage should scale clearly with stack count."],
  iconPrompt: "Dark fantasy RPG skill icon of a fiery explosion bursting from stacked burning runes, volcanic orange and crimson fire, gothic circular spell-stone frame, no text."
}
```

### 26. Melt Armor

```js
{
  id: "melt_armor",
  name: "Melt Armor",
  tower: "Fire",
  element: "Fire",
  rarity: "Uncommon",
  role: "Armor Melt / Physical Vulnerability",
  spCost: 14,
  basePower: 22,
  scaling: "Armor reduction increases by magic stone level.",
  condition: "Best before physical, dragon, or Wyvern damage.",
  effect: "Melt enemy armor so the target takes increased physical damage on later turns.",
  combo: "Sets up Wyvern attacks, Dragon Slayer-style effects, or Fire's late pet synergy.",
  obtain: "Monster drop from armored enemies or Doryl Watchtower.",
  battleLog: {
    cast: "White-hot flame crawls across the enemy's armor.",
    trigger: "Melt Armor softens the target's defenses.",
    expire: "The molten armor begins to harden again."
  },
  rules: ["Mainly increases physical or pet damage, not every magic spell."],
  iconPrompt: "Dark fantasy RPG skill icon of a steel breastplate melting under orange-white fire, molten droplets, gothic spell-stone frame, no text."
}
```

### 27. Fire Storm

```js
{
  id: "fire_storm",
  name: "Fire Storm",
  tower: "Fire",
  element: "Fire",
  rarity: "Uncommon",
  role: "Area Pressure / Charge Disruption",
  spCost: 20,
  basePower: 46,
  scaling: "Damage and disruption chance increase by magic stone level.",
  condition: "Best against charging or setup-heavy enemies.",
  effect: "Create a violent fire storm that deals continuing fire pressure and can disrupt charge-type spells.",
  combo: "Counters Light Charge and similar setup turns.",
  obtain: "Monster drop, boss drop, or Catalyst Exchange.",
  battleLog: {
    cast: "A fire storm tears across the battlefield.",
    trigger: "Fire Storm burns and disrupts focused casting.",
    expire: "The storm collapses into sparks."
  },
  rules: ["Disruption chance should be readable in battle logs."],
  iconPrompt: "Dark fantasy RPG skill icon of a swirling crimson fire storm tearing through magical charge rings, gothic circular spell-stone frame, no text."
}
```

### 28. Phoenix Blood

```js
{
  id: "phoenix_blood",
  name: "Phoenix Blood",
  tower: "Fire",
  element: "Fire",
  rarity: "Rare",
  role: "Low HP Power Spell",
  spCost: 22,
  basePower: 70,
  scaling: "Damage multiplier increases by magic stone level.",
  condition: "Stronger when player HP is low.",
  effect: "Deal damage based on missing HP. The lower the player's HP, the stronger the attack.",
  combo: "Turns Fire's high HP pool into comeback pressure.",
  obtain: "Rare drop from Magi Graveyard, fire boss, or Catalyst Exchange.",
  battleLog: {
    cast: "The mage's blood ignites into phoenix fire.",
    trigger: "Phoenix Blood grows stronger from missing HP.",
    expire: ""
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of a phoenix made of blood and flame rising from ashes, crimson and molten gold, ornate circular spell-stone frame, no text."
}
```

### 29. Wyvern Kamikaze

```js
{
  id: "wyvern_kamikaze",
  name: "Wyvern Kamikaze",
  tower: "Fire",
  element: "Fire",
  rarity: "Rare",
  role: "Dragon / Wyvern Finisher",
  spCost: 30,
  basePower: 100,
  scaling: "Damage increases by magic stone level and Wyvern bond/progression.",
  condition: "Requires an available Wyvern companion or MVP placeholder unlock.",
  effect: "Command a Wyvern to dive into the target for massive physical fire damage, then enter recovery.",
  combo: "Best after Melt Armor or Burn setup.",
  obtain: "Rare Wyvern progression reward, dragon nest drop, or Fire boss.",
  battleLog: {
    cast: "The mage gives the final command to the circling Wyvern.",
    trigger: "Wyvern Kamikaze crashes into the enemy in a storm of fire and scales.",
    expire: "The Wyvern retreats into recovery."
  },
  rules: ["If pet systems are not implemented yet, gate this spell behind a placeholder condition and show it in the library only."],
  iconPrompt: "Dark fantasy RPG skill icon of a fiery wyvern diving like a comet into a cracked shield, molten gold sparks, ornate spell-stone frame, no text."
}
```

### 30. Ragnarok Ignition

```js
{
  id: "ragnarok_ignition",
  name: "Ragnarok Ignition",
  tower: "Fire",
  element: "Fire",
  rarity: "Ultimate",
  role: "Ultimate Burn / Dragon Finisher",
  spCost: 40,
  basePower: 160,
  scaling: "Massive scaling with magic stone level, Burn stacks, Fire Storm pressure, and Wyvern synergy.",
  condition: "Requires Burn or Fire setup for full effect.",
  effect: "Consume fire setup to deal catastrophic damage.",
  combo: "Best as final turn after Burn, Fire Thief farming, Explosion Burn timing, and Melt Armor setup.",
  obtain: "Ultimate boss drop after late map progression / quest 4 equivalent.",
  battleLog: {
    cast: "The battlefield erupts as Ragnarok Ignition consumes everything.",
    trigger: "Ragnarok Ignition detonates all accumulated fire power.",
    expire: ""
  },
  rules: ["High SP cost matters because Fire has low SP identity."],
  iconPrompt: "Dark fantasy RPG ultimate skill icon of an apocalyptic firestorm, molten sun collapsing into a battlefield, crimson gold inferno, gothic legendary spell frame, no text."
}
```

## ICE TOWER SPELLS

### 31. Ice Shot

```js
{
  id: "ice_shot",
  name: "Ice Shot",
  tower: "Ice",
  element: "Ice",
  rarity: "Common",
  role: "Basic Ice Damage",
  spCost: 8,
  basePower: 26,
  scaling: "Damage increases by magic stone level.",
  condition: "None.",
  effect: "Deal basic ice damage to one enemy.",
  combo: "Feeds Freeze and Mana Burst plans.",
  obtain: "Starter reward from Kolis and Ice Tower shop.",
  battleLog: {
    cast: "The mage shapes a shard of glacial magic.",
    trigger: "Ice Shot cuts into the enemy with cold force.",
    expire: ""
  },
  rules: ["New Ice players receive 3 Ice Shot stones from Kolis if Ice Tower is enabled in onboarding."],
  iconPrompt: "Dark fantasy RPG skill icon of a sharp blue-white ice projectile, silver frost, gothic circular spell-stone frame, no text."
}
```

### 32. Freeze

```js
{
  id: "freeze",
  name: "Freeze",
  tower: "Ice",
  element: "Ice",
  rarity: "Common",
  role: "Turn Denial",
  spCost: 14,
  basePower: 12,
  scaling: "Freeze chance and damage increase by magic stone level.",
  condition: "Best against dangerous next-turn enemy actions.",
  effect: "Attempt to freeze the target, causing it to lose its next spell action.",
  combo: "Creates room for Energy Refill or Mana Burst setup.",
  obtain: "Ice Tower shop.",
  battleLog: {
    cast: "A killing frost wraps around the enemy's limbs.",
    trigger: "Freeze locks the target out of its next action.",
    expire: "The ice prison cracks apart."
  },
  rules: ["Bosses may resist or reduce Freeze duration."],
  iconPrompt: "Dark fantasy RPG skill icon of an enemy silhouette trapped in crystalline blue ice, cold mist, circular spell-stone frame, no text."
}
```

### 33. Energy Refill

```js
{
  id: "energy_refill",
  name: "Energy Refill",
  tower: "Ice",
  element: "Ice",
  rarity: "Common",
  role: "SP Recovery",
  spCost: 0,
  basePower: 0,
  scaling: "SP recovered increases by magic stone level.",
  condition: "Consumes the turn.",
  effect: "Recover SP during battle.",
  combo: "Allows Ice to run expensive control and burst lines.",
  obtain: "Ice Tower shop.",
  battleLog: {
    cast: "Cold air condenses into usable spell power.",
    trigger: "Energy Refill restores SP.",
    expire: ""
  },
  rules: ["This spell should never fail due to SP cost."],
  iconPrompt: "Dark fantasy RPG skill icon of blue mana flowing into a frost crystal battery, cyan glow, gothic circular spell-stone frame, no text."
}
```

### 34. Frost Ward

```js
{
  id: "frost_ward",
  name: "Frost Ward",
  tower: "Ice",
  element: "Ice",
  rarity: "Common",
  role: "Fragile Defense",
  spCost: 9,
  basePower: 0,
  scaling: "Protection and chill retaliation increase by magic stone level.",
  condition: "None.",
  effect: "Gain a small shield. Enemies that hit the shield may be chilled.",
  combo: "Helps low-HP Ice survive monster-first turns.",
  obtain: "Ice Tower shop.",
  battleLog: {
    cast: "A thin ward of frost forms around the mage.",
    trigger: "Frost Ward absorbs damage and chills the attacker.",
    expire: "The frost ward melts away."
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of a fragile blue ice barrier around a mage silhouette, silver frost particles, gothic circular spell-stone frame, no text."
}
```

### 35. Mana Combo

```js
{
  id: "mana_combo",
  name: "Mana Combo",
  tower: "Ice",
  element: "Ice",
  rarity: "Uncommon",
  role: "Mana Burst Setup",
  spCost: 12,
  basePower: 28,
  scaling: "Combo count and damage increase by magic stone level.",
  condition: "Best after Energy Refill or another Ice spell.",
  effect: "Deal ice damage and increase Mana Combo count.",
  combo: "Prepares Mana Burst and rewards careful 10-turn planning.",
  obtain: "Monster drop from ice or arcane enemies.",
  battleLog: {
    cast: "The mage threads cold mana into a precise sequence.",
    trigger: "Mana Combo increases the stored arcane pattern.",
    expire: ""
  },
  rules: [],
  iconPrompt: "Dark fantasy RPG skill icon of interlocking cyan mana rings over ice crystals, arcane steel frame, no text."
}
```

### 36. Mana Burst

```js
{
  id: "mana_burst",
  name: "Mana Burst",
  tower: "Ice",
  element: "Ice",
  rarity: "Uncommon",
  role: "Mana Combo Finisher",
  spCost: 22,
  basePower: 68,
  scaling: "Damage increases by magic stone level and Mana Combo count.",
  condition: "Best after Mana Combo stacks.",
  effect: "Release stored mana into a sharp burst of ice damage.",
  combo: "Core Ice burst route.",
  obtain: "Monster drop or Catalyst Exchange.",
  battleLog: {
    cast: "Stored cold mana flashes beyond control.",
    trigger: "Mana Burst releases the accumulated combo.",
    expire: ""
  },
  rules: ["Consumes Mana Combo stacks."],
  iconPrompt: "Dark fantasy RPG skill icon of a cyan arcane explosion from a frozen mana core, silver-blue shards, gothic circular spell-stone frame, no text."
}
```

### 37. Golem Command

```js
{
  id: "golem_command",
  name: "Golem Command",
  tower: "Ice",
  element: "Ice",
  rarity: "Uncommon",
  role: "Golem Summon / Pressure",
  spCost: 18,
  basePower: 36,
  scaling: "Golem damage and durability increase by magic stone level.",
  condition: "Best for longer fights.",
  effect: "Command an arcane ice golem to attack or guard for several turns.",
  combo: "Alternative Ice route for players who prefer mechanical summon pressure over mana burst.",
  obtain: "Monster drop from Golem Master or frozen ruins enemies.",
  battleLog: {
    cast: "A runed golem core wakes beneath the ice.",
    trigger: "The golem obeys and crushes the enemy.",
    expire: "The golem's core falls silent."
  },
  rules: ["Represent golem actions in text logs; no real-time control required."],
  iconPrompt: "Dark fantasy RPG skill icon of a runed ice-and-steel golem fist rising from snow, cyan mana stones, circular spell-stone frame, no text."
}
```

### 38. Absolute Zero

```js
{
  id: "absolute_zero",
  name: "Absolute Zero",
  tower: "Ice",
  element: "Ice",
  rarity: "Rare",
  role: "Hard Control / Freeze Amplifier",
  spCost: 28,
  basePower: 70,
  scaling: "Damage and control strength increase by magic stone level.",
  condition: "Best against a target already chilled or frozen.",
  effect: "Deal heavy ice damage and greatly improve Freeze reliability or duration.",
  combo: "Turns earlier Freeze or Frost Ward chill into a decisive control window.",
  obtain: "Rare drop from Magi Graveyard, Library of Magi, or Ice boss.",
  battleLog: {
    cast: "All heat vanishes from the battlefield.",
    trigger: "Absolute Zero deepens the freeze into silence.",
    expire: "Warmth slowly returns."
  },
  rules: ["Boss control duration should be reduced for balance."],
  iconPrompt: "Dark fantasy RPG skill icon of a battlefield frozen under a black-blue absolute zero crystal, ornate silver spell-stone frame, no text."
}
```

### 39. Golem Master

```js
{
  id: "golem_master",
  name: "Golem Master",
  tower: "Ice",
  element: "Ice",
  rarity: "Rare",
  role: "Advanced Golem Build",
  spCost: 30,
  basePower: 52,
  scaling: "Golem attack, guard, and duration increase by magic stone level.",
  condition: "Requires Golem Command setup or golem route unlock.",
  effect: "Empower the active golem or summon a stronger war golem for multiple turns.",
  combo: "Build-defining alternative to Mana Burst.",
  obtain: "Rare drop from Golem Master, frozen mountain ruins, or Catalyst Exchange.",
  battleLog: {
    cast: "The mage speaks the command language of ancient steel.",
    trigger: "Golem Master awakens a heavier war machine.",
    expire: "The empowered golem powers down."
  },
  rules: ["If summon systems are not implemented yet, show this in the library and gate usage behind progression."],
  iconPrompt: "Dark fantasy RPG skill icon of a giant ancient war golem made of rusted iron and glowing blue mana stones, snowy ruins, ornate circular spell-stone frame, no text."
}
```

### 40. Glacial Singularity

```js
{
  id: "glacial_singularity",
  name: "Glacial Singularity",
  tower: "Ice",
  element: "Ice",
  rarity: "Ultimate",
  role: "Ultimate Control / Mana Finisher",
  spCost: 44,
  basePower: 155,
  scaling: "Massive scaling with magic stone level, Mana Combo stacks, Freeze state, and remaining SP.",
  condition: "Requires Ice setup for maximum power.",
  effect: "Collapse frozen mana into a singularity that deals catastrophic damage and disrupts the enemy's next action.",
  combo: "Best after Freeze, Energy Refill, Mana Combo, and Mana Burst setup.",
  obtain: "Ultimate boss drop after late map progression / quest 4 equivalent.",
  battleLog: {
    cast: "A star of frozen mana collapses between the combatants.",
    trigger: "Glacial Singularity tears heat, motion, and spell power from the enemy.",
    expire: ""
  },
  rules: ["High SP cost is acceptable because Ice has the highest SP identity."],
  iconPrompt: "Dark fantasy RPG ultimate skill icon of a blue-white frozen singularity pulling ice shards and arcane rings inward, legendary silver gothic spell frame, no text."
}
```

---

# 8. Implementation Requirements

Create or update the spell data structure.

Recommended file:

```txt
src/data/spells.js
```

Recommended export:

```js
export const SPELLS = [ ...all 40 spells ];

export function getSpellsByTower(tower) {}
export function getCommonShopSpells(tower) {}
export function getSpellsByRarity(rarity) {}
export function getSpellById(id) {}
export function getStarterSpellsForTower(tower) {}
```

Recommended helper behavior:

```js
getCommonShopSpells("Fire")
// returns Fire Shot, Burn, Fire Thief, Ember Skin only

getStarterSpellsForTower("Dark")
// returns 3 owned copies of Dark Shot
```

---

# 9. Required UI Updates

## Spell Library Page

Update Spell Library to:

- display all 40 spells
- filter by tower: All / Light / Dark / Fire / Ice
- filter by rarity: All / Common / Uncommon / Rare / Ultimate
- show spell role, SP cost, base power, scaling, condition, effect, combo, obtain method
- show battle log sample
- show icon prompt in development/debug mode
- clearly mark spells that are library-only until a system is implemented, such as Wyvern or Golem progression

## Arcane Market / Shop

Update shop to:

- show only Common spells
- match selected tower only
- allow buying Common spell stones
- save purchased spell stones to inventory
- subtract Credit / Gold
- prevent purchase if Credit / Gold is insufficient
- never show Uncommon, Rare, or Ultimate spells in the basic shop

## Kolis Starter Reward

Update onboarding / starter reward to:

- grant 3 copies of the player's tower Shot spell
- Light receives 3x Light Shot
- Dark receives 3x Dark Shot
- Fire receives 3x Fire Shot
- Ice receives 3x Ice Shot if Ice Tower is enabled

## Magic Stone Inventory

Update inventory rules to:

- treat each spell stone as an owned item with `spellId`, `level`, `quantity`, and optional `instanceId`
- support duplicate stones
- support levels 1-11
- show that higher levels improve damage and special effects

## Set Order Page

Update spell selection to:

- show only owned spell stones
- allow duplicate spell stones if owned multiple times
- assign spells to 10 turn slots
- warn if estimated SP cost is too high
- show combo hints
- show warning when a spell has unmet conditions, such as Wyvern or Golem requirements

---

# 10. Balance Notes r2

Initial balance target:

- Common spells should be useful early.
- Uncommon spells should introduce tower identity.
- Rare spells should define a build.
- Ultimate spells should feel like late-game payoff.
- Fire should feel friendly early, but SP pressure should matter.
- Ice should feel complex and powerful in expert hands, but fragile.
- Light should survive well, but needs setup to close fights.
- Dark should hit brutally hard, but can collapse if the plan fails.

Tower difficulty:

| Tower | Difficulty | Reason |
|---|---|---|
| Fire | Easy | Highest HP, money tools, Burn plan, but low SP |
| Light | Medium | Safe, defensive, but low direct damage and needs charge setup |
| Dark | Medium | Extreme damage, curse, vampire tools, but low HP |
| Ice | Hard | Highest SP and best control, but lowest HP and complex sequencing |

Tower stat identity:

| Tower | HP | SP | Attack | Core Mechanic |
|---|---|---|---|---|
| Light | High | High | Low | Charge, shield, heal, reflection |
| Dark | Low | Medium | Highest | Curse, vampire, fog, night burst |
| Fire | Highest | Low | High | Burn, Credit steal, Wyvern synergy |
| Ice | Lowest | Highest | Medium | Freeze, SP refill, mana combo, golem |

---

# 11. Do Not Do Yet

Do not add:

- real PvP
- online multiplayer
- server
- database
- authentication
- guild
- live marketplace economy
- real-time combat
- full pet management
- full golem management

Focus only on:

- spell catalog
- spell data
- spell library
- shop filtering
- starter stone reward
- inventory integration
- set order preparation
- clear placeholders for later Wyvern / Golem systems

# PROMPT END
