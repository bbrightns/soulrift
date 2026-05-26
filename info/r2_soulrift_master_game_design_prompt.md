# SOULRIFT RPG CHRONICLES
## MASTER PRODUCTION DOCUMENT (MVP FOUNDATION)

Version: Early Production Spec v2  
Project Type: Mobile-First Browser RPG  
Architecture: Vanilla HTML/CSS/JavaScript  
Priority: Systems First, Graphics Later

---

# 1. CORE GAME IDENTITY

SOULRIFT is a:
- Gothic Dark Fantasy
- Tactical Browser RPG
- Buildcraft RPG
- Spell Sequencing RPG
- Text Battle RPG

The core emotional fantasy is:

> Designing the perfect 10-turn magical combat sequence.

The player fantasy is NOT:
- fast action combat
- reflex gameplay
- button mashing
- real-time execution skill

The player fantasy IS:
- magical strategy
- spell programming
- combo planning
- optimization
- build experimentation
- discovering broken combinations
- refining combat blueprints

---

# 2. GAME DESIGN PHILOSOPHY

## Focus On:
- replayability
- experimentation
- build theorycrafting
- progression
- dopamine from rare discoveries
- text immersion
- low asset dependency
- scalable systems
- deterministic combat clarity
- satisfying progression loops

## Avoid:
- MMO-scale scope
- real-time combat
- animation-heavy gameplay
- open-world complexity
- backend dependency during MVP
- multiplayer systems during early development
- feature creep
- overengineered architecture

---

# 3. MVP SCOPE LOCK

DO NOT BUILD YET:
- PvP
- guild systems
- global chat
- auction house
- online multiplayer
- login/authentication
- backend/database
- open world
- realtime movement
- live economy
- raids
- crafting professions
- seasonal systems
- matchmaking
- trading systems

ONLY BUILD:
- tower selection
- inventory
- spell library
- spell shop
- spell fusion
- 10-turn setup
- automatic battle
- text battle logs
- dungeon exploration
- save/load
- basic progression

---

# 4. PLAYER CORE LOOP

```txt
Enter Rift
↓
Battle enemies
↓
Gain Gold + EXP
↓
Acquire spell stones
↓
Improve build
↓
Modify 10-turn blueprint
↓
Discover better combos
↓
Challenge harder Rift
↓
Repeat
```

Core addiction loop:

```txt
Experiment
↓
Discover synergy
↓
Become stronger
↓
Unlock harder content
↓
Find stronger combinations
↓
Experiment again
```

---

# 5. PLAYER START

Initial State:
- No equipment
- No armor
- Empty inventory
- No rare spells

Starting Resources:
- 1000 Gold

Player starts weak intentionally.

The progression fantasy is:
> slowly transforming from a fragile mage into a broken magical build engine.

---

# 6. TOWER SYSTEM

Players choose ONE tower.

Available Towers:
- Fire Tower
- Dark Tower
- Light Tower

Tower choice affects:
- available shop spells
- starting strategy
- progression identity
- build direction

Cross-tower access is locked during MVP.

Future systems MAY unlock:
- hybrid builds
- forbidden spells
- legendary cross-tower magic

NOT during MVP.

---

# 7. TOWER IDENTITIES

## FIRE TOWER

Theme:
- aggressive farming
- burn stacking
- explosive combos
- gold stealing

Main Stats:
- Strength
- Attack

Difficulty:
- Medium

Combat Style:
- setup burn
- detonate burn
- chain fire spells

Player fantasy:
> endless escalating inferno combos.

---

## DARK TOWER

Theme:
- risky burst damage
- combo chaining
- curse amplification
- lifesteal

Main Stats:
- Agility
- Attack

Difficulty:
- Hard

Combat Style:
- glass cannon
- combo sequencing
- execution gameplay

Player fantasy:
> surviving on the edge while dealing absurd damage.

---

## LIGHT TOWER

Theme:
- sustain
- healing
- shields
- defensive scaling
- reflection

Main Stats:
- Intelligence
- HP

Difficulty:
- Easy

Combat Style:
- survival
- setup defense
- counter-play

Player fantasy:
> becoming an untouchable radiant fortress.

---

# 8. CORE BATTLE SYSTEM

## Battle Structure

Before battle:
- player prepares 10 spell slots

Example:

```txt
Turn 1 → Fire Shot
Turn 2 → Burn Mark
Turn 3 → Blaze Chain
Turn 4 → Combustion
```

During battle:
- combat becomes automatic
- no manual inputs
- battle executes from slot 1 → 10

---

## Turn Rules

- enemy acts first on Turn 1
- battle max length = 10 turns
- spells consume SP
- some spells require conditions
- empty slots cause STRUGGLE

---

# 9. DETERMINISTIC COMBAT RULE

The same:
- player setup
- stats
- equipment
- enemy
- spell sequence

must always produce:
- the same battle result

unless:
- explicit RNG mechanics trigger

Examples of allowed RNG:
- critical hits
- rare proc effects
- drop rewards

Combat logic must remain:
- predictable
- readable
- debuggable

---

# 10. STRUGGLE SYSTEM

Triggered when:
- slot empty
- insufficient SP

Effect:
- weak physical attack

Formula:

```txt
Struggle Damage =
Strength × 0.4
```

Minimum damage:

```txt
1
```

Purpose:
- punish poor planning
- preserve battle flow
- avoid dead turns

---

# 11. CORE STATS

Player Stats:

```js
{
  level,
  hp,
  maxHp,
  sp,
  maxSp,
  attack,
  defense,
  intelligence,
  agility,
  strength,
  critRate,
  critDamage
}
```

Stats should influence:
- build identity
- tower specialization
- spell scaling
- equipment value

---

# 12. DAMAGE FORMULA

Base Formula:

```txt
Final Damage =
(basePower + statScaling + weaponBonus)
× comboMultiplier
× critMultiplier
× elementalModifier
- targetDefense
```

Minimum damage:

```txt
1
```

Formula priority:
- readable
- expandable
- consistent

NOT:
- hyper realistic
- overly complicated

---

# 13. STATUS EFFECT RULES

## Burn

Properties:

```txt
Duration: 3 turns
Stackable: Yes
Max Stacks: 5
```

Formula:

```txt
Burn Damage =
(basePower × 0.35)
× burnStacks
```

Burn activates:
- at start of turn

---

## Curse

Effect:
- increases dark damage taken

Default Value:

```txt
+20% dark damage received
```

Duration:

```txt
3 turns
```

---

## Shield

Formula:

```txt
Incoming Damage
→ Shield absorbs first
→ remaining damage hits HP
```

---

# 14. SPELL SYSTEM

Spells are:
- magical stones
- collectible
- upgradeable
- fusion materials

Each spell contains:

```js
{
  id,
  name,
  tower,
  rarity,
  role,
  spCost,
  basePower,
  condition,
  effect,
  combo,
  obtain,
  battleLog
}
```

---

# 15. SPELL ASSIGNMENT RULE

Battle blueprint slots store:
- spellId only

NOT inventory quantity.

If the player owns at least ONE copy of a spell stone:
- the spell may be assigned multiple times
- the spell may appear in multiple turn slots

Combat limitations are controlled by:
- SP cost
- combo requirements
- battle logic

NOT inventory consumption.

Example:

```txt
Player owns:
1x Fire Shot

Allowed setup:
Turn 1 → Fire Shot
Turn 2 → Fire Shot
Turn 3 → Fire Shot
Turn 4 → Fire Shot
```

---

# 16. SPELL RARITY

```txt
1. Common
2. Uncommon
3. Rare
4. Epic
5. Ultimate
6. Ancient
```

MVP uses:
- Common
- Uncommon
- Rare
- Ultimate

---

# 17. SHOP RULES

The shop:
- only sells Common spells
- only shows spells matching selected tower

Example:
Fire Tower player sees:
- Fire Shot
- Burn Mark
- Ember Skin

Cannot buy:
- Dark Shot
- Holy Mend

---

# 18. INVENTORY SYSTEM

Inventory stores:
- spell stones
- equipment
- relics
- consumables

MVP inventory uses:
- localStorage only

No backend/database yet.

Inventory must:
- load fast
- remain simple
- support future expansion

---

# 19. SPELL FUSION

Fusion Rules:

```txt
2 identical spell stones
+
same level
=
attempt upgrade
```

Success:

```txt
spell level +1
```

Failure:

```txt
materials destroyed
```

Consumes:

```txt
Time Units (TU)
```

Fusion should feel:
- risky
- rewarding
- addictive

---

# 20. DUNGEON SYSTEM

## Starting Dungeons

### Booby Forest
Purpose:
- beginner farming

Theme:
- cursed forest
- weak creatures
- safe experimentation

---

### Magi Graveyard
Purpose:
- mid-game progression

Theme:
- forbidden magic
- dangerous enemies
- high risk rewards

---

## Dungeon Rewards

Possible rewards:
- Gold
- EXP
- spell stones
- equipment
- relics

---

# 21. TEXT BATTLE LOGS

Battle logs are CRITICAL.

Combat emotion must come from:
- wording
- pacing
- combo payoff
- dramatic triggers

Example:

```txt
Turn 4

Burn erupts violently.
42 damage dealt.

The mage casts Combustion.

The enemy explodes in crimson fire.
187 damage dealt.
```

The game should feel:
- immersive
- atmospheric
- dangerous

Even with minimal animation.

---

# 22. COMBAT PRESENTATION RULES

Combat should feel:
- fast
- readable
- dramatic
- addictive

Avoid:
- long animations
- animation lock
- slow transitions
- excessive VFX clutter
- delayed UI feedback

Battle pacing target:

```txt
Normal battle:
8–15 seconds

Boss battle:
20–40 seconds
```

The player should:
- rapidly test builds
- rapidly retry content
- rapidly iterate strategies

---

# 23. ITEMIZATION PHILOSOPHY

Items should modify builds.

Examples:

```txt
+ Burn Duration
+ Dark Combo Count
+ Shield Strength
+ Crit Damage
```

Future examples:

```txt
Combustion triggers twice
Burn stacks no longer expire
Reflection damage increased by 50%
```

Items should:
- create identity
- modify playstyle
- enable broken builds

---

# 24. BUILDCRAFT PHILOSOPHY

Build experimentation is a CORE pillar.

Players should eventually discover:
- infinite burn loops
- crit chains
- reflection abuse
- low HP berserker builds
- economy farming builds
- ultra defensive immortal builds

Broken combinations are GOOD.

The game should encourage:
- experimentation
- optimization
- theorycrafting
- discovery

The player should feel:

> "I found something insane."

---

# 25. RNG DOPAMINE DESIGN

The game MUST contain:
- rare drops
- unexpected discoveries
- high-value rewards
- build-changing items

Players should feel:

> "Maybe the next run drops something insane."

RNG should create:
- excitement
- anticipation
- replayability

NOT:
- frustration
- unfairness
- unreadable randomness

---

# 26. UI/UX DIRECTION

Style:
- gothic
- elegant
- dark fantasy
- magical observatory
- ancient magical interface

## Visual Identity

Background:

```txt
#0a0a0b
#16161a
```

Accent:

```txt
Gold: #c5a059
Crimson: #8b1e1e
```

Fonts:
- Cinzel → headings
- Inter → body/UI

---

# 27. UI DENSITY RULE

The interface should feel:
- information rich
- compact
- immersive
- layered

Avoid:
- giant empty spacing
- oversized cards
- excessive padding
- low-information layouts

This is:
- an RPG system interface
NOT:
- a fintech dashboard
- a minimalist portfolio website

---

# 28. MOBILE-FIRST DESIGN

Primary target:
- mobile browser

Navigation:
- bottom navigation bar

Avoid:
- desktop-only layouts
- giant sidebars
- overloaded UI

Design Rules:
- thumb-friendly
- readable
- compact
- layered panels
- fast interaction

Mobile readability is PRIORITY.

Desktop adaptation is SECONDARY.

---

# 29. SESSION DESIGN

Target session:

```txt
1–5 minutes
```

Players should always feel:
- quick progression
- meaningful rewards
- fast experimentation

The game should support:
- short mobile sessions
- repeated farming loops
- low friction replayability

---

# 30. FILE STRUCTURE

```txt
/index.html

/css
  theme.css
  layout.css
  battle.css

/js
  state.js
  ui.js
  battle.js
  shop.js
  inventory.js
  fusion.js

/data
  spells.js
  enemies.js
  items.js
```

---

# 31. STATE MANAGEMENT

Single source of truth:

```js
const gameState = {
  player: {},
  inventory: [],
  equippedSpells: [],
  gold: 0,
  currentTower: "",
  dungeonProgress: {},
  settings: {}
}
```

All systems must:
- read from state
- modify state
- save state

Avoid:
- duplicated state
- hidden state
- disconnected UI logic

---

# 32. SAVE SYSTEM

Use:

```txt
localStorage
```

Must save:
- player progress
- inventory
- spells
- tower
- gold
- dungeon progress

Save system priority:
- stability
- simplicity
- reliability

---

# 33. DEVELOPMENT PRIORITY

## PHASE 1

Build playable core:
- tower select
- spell shop
- inventory
- 10-turn setup
- battle
- battle logs
- rewards
- save/load

---

## PHASE 2

Add progression:
- spell fusion
- relics
- dungeon unlocks
- itemization

---

## PHASE 3

Add polish:
- animation
- sound
- VFX
- icon improvements
- UI refinement

---

# 34. IMPORTANT DEVELOPMENT RULES

DO:
- keep systems modular
- separate files clearly
- prioritize readability
- keep battle logic deterministic
- focus on gameplay loops first
- build reusable UI systems
- optimize mobile usability

DO NOT:
- place all code in one file
- build giant monolithic scripts
- overbuild architecture early
- chase MMO features prematurely
- redesign the entire UI repeatedly
- create unnecessary dependencies

---

# 35. FINAL DESIGN GOAL

SOULRIFT should feel like:

> An ancient forbidden magical combat simulator hidden inside a forgotten browser RPG world.

The player should become obsessed with:
- optimizing spell sequences
- discovering combinations
- farming rare spell stones
- creating broken builds
- refining battle blueprints

SYSTEMS FIRST.
ATMOSPHERE SECOND.
GRAPHICS LATER.
