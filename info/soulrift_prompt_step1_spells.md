# SOULRIFT — Dev Prompt Step 1: Rewrite spells.js (Full 40-Spell Catalog)

## Context
You are continuing development of **SOULRIFT RPG Chronicles**.
- Gothic Dark Fantasy tactical browser RPG
- Vanilla HTML/CSS/JS only — no frameworks, no imports
- File loads via `<script>` tag in index.html before all other scripts

## Task
**Rewrite `/spells.js` only.** Do not touch any other file.

Replace the current 16-spell stub with the complete 40-spell catalog below.
Use the **exact spell data provided** — do not invent or change any spell.

---

## Required Object Shape

Each spell must follow this exact shape:

```js
{
  id: '',           // snake_case unique id
  name: '',
  tower: '',        // 'light' | 'dark' | 'fire' | 'ice'  (lowercase)
  element: '',      // 'Light' | 'Dark' | 'Fire' | 'Ice'  (title case)
  rarity: '',       // 'common' | 'uncommon' | 'rare' | 'ultimate'  (lowercase)
  role: '',
  spCost: 0,
  basePower: 0,
  price: 0,         // gold price if common, else 0
  obtain: '',       // 'shop' | 'drop' | 'boss'
  desc: '',         // short 1-line UI description
  scaling: '',
  condition: '',
  effect: '',
  combo: '',
  battleLog: {
    cast: '',
    trigger: '',
    expire: ''
  },
  rules: []
}
```

**Price guide for common spells:**
- spCost 0–8 → price 120
- spCost 9–11 → price 150–160
- spCost 12+ → price 180

---

## Required Global Functions

```js
function getAllSpells()              // returns full SPELLS_DATA array
function getSpellDef(id)            // returns spell by id or null
function getSpellsByTower(tower)    // returns all spells for a tower
function getCommonShopSpells(tower) // returns only common spells for a tower (shop use)
function getSpellsByRarity(rarity)  // returns spells filtered by rarity
```

All functions must also be assigned to `window.*` at the end of the file.

---

## Complete 40-Spell Data (use exactly as given)

### LIGHT TOWER (10 spells)

```
1.  id: light_shot           | rarity: common    | spCost: 7  | basePower: 24  | role: Basic Holy Damage
    obtain: shop | effect: Deal basic holy damage to one enemy.
    combo: Can become the release target for Light Charge effects.
    cast: "The mage gathers a clean shard of holy light."
    trigger: "Light Shot strikes the enemy with sacred force."

2.  id: light_charge         | rarity: common    | spCost: 6  | basePower: 0   | role: Charge Setup
    obtain: shop | effect: Store holy energy. Each charge increases the next compatible Light release spell.
    combo: Use multiple times before Charge Release or Heavenfall Chronicle.
    cast: "Radiant power gathers silently within the spell circle."
    trigger: "Light Charge stores holy energy for a later release."

3.  id: holy_guard           | rarity: common    | spCost: 10 | basePower: 0   | role: Defense Buff
    obtain: shop | effect: Increase physical and magical defense for 2 turns.
    combo: Pairs with monster-first PvE rules.
    cast: "Holy particles form a guardian mantle around the mage."
    trigger: "Holy Guard reduces incoming damage."
    expire: "The holy guard fades."

4.  id: shield_of_absorption | rarity: common    | spCost: 12 | basePower: 34  | role: Shield / Conversion
    obtain: shop | effect: Create a shield that absorbs incoming damage and converts part of absorbed damage into HP or SP recovery.
    combo: Strong before charge turns or against monster-first openers.
    cast: "A luminous barrier opens like a sacred lens."
    trigger: "Shield of Absorption drinks in the impact and returns power to the mage."
    expire: "The absorbing shield dissolves."

5.  id: charge_release_light_shot | rarity: uncommon | spCost: 16 | basePower: 48 | role: Charge Finisher
    obtain: drop | effect: Consume stored Light Charge stacks to deal heavy holy damage.
    combo: The more turns spent charging, the stronger the release.
    cast: "Stored radiance focuses into a single impossible point."
    trigger: "Charge Release - Light Shot consumes holy charge and erupts forward."
    rules: ["Consumes all Light Charge stacks."]

6.  id: energy_blast         | rarity: uncommon  | spCost: 15 | basePower: 50  | role: Accuracy Pierce
    obtain: drop | effect: Release concentrated holy energy that ignores or reduces enemy evasion.
    combo: Reliable finisher when defensive play must still connect.
    cast: "The mage compresses holy energy into a piercing blast."
    trigger: "Energy Blast cuts through evasive movement."

7.  id: angel_wing           | rarity: uncommon  | spCost: 14 | basePower: 0   | role: Evasion / Tempo
    obtain: drop | effect: Gain a sacred wing buff that can completely avoid the next incoming direct attack.
    combo: Creates a safe turn to charge or heal afterward.
    cast: "Wings of pale light unfold behind the mage."
    trigger: "Angel Wing turns the enemy strike into empty air."
    expire: "The angelic wings scatter into feathers of light."

8.  id: divine_reflection    | rarity: rare      | spCost: 24 | basePower: 0   | role: Counter / Reflection
    obtain: drop | effect: Prepare a radiant mirror. Reflect a percentage of actual HP damage received back to the enemy on next hit.
    combo: Works after Shield of Absorption for survival.
    cast: "The mage raises a divine mirror of radiant judgment."
    trigger: "Divine Reflection mirrors the enemy attack back as holy damage."
    expire: "The divine mirror fades without reflecting an attack."
    rules: ["Reflects only direct damage.", "Does not reflect Burn, DoT, or passive damage.", "Expires after one enemy action."]

9.  id: chorus_of_sanctuary  | rarity: rare      | spCost: 26 | basePower: 32  | role: Regeneration / Cleanse
    obtain: drop | effect: Create a sanctuary field that restores HP and cleanses negative statuses over several turns.
    combo: Allows Light to survive long enough to build Charge Release lines.
    cast: "A sacred chorus rolls across the battlefield."
    trigger: "Chorus of Sanctuary restores HP and purges corruption."
    expire: "The sanctuary hymn falls silent."

10. id: heavenfall_chronicle | rarity: ultimate  | spCost: 40 | basePower: 145 | role: Ultimate Charge Finisher
    obtain: boss | effect: Deal massive holy damage based on active buffs, shields, and stored radiant charge.
    combo: Best after Holy Guard, Shield of Absorption, Light Charge, and Charge Release setup.
    cast: "The heavens open, and a chronicle of light descends upon the enemy."
    trigger: "Heavenfall Chronicle converts sacred preparation into judgment."
```

---

### DARK TOWER (10 spells)

```
11. id: dark_shot            | rarity: common    | spCost: 9  | basePower: 36  | role: Basic Dark Damage
    obtain: shop | effect: Deal basic dark damage to one enemy.
    combo: Feeds Dark Combo and curse-based finishers.
    cast: "A shard of darkness pierces the enemy."
    trigger: "Dark Shot wounds the target with abyssal force."

12. id: curse_fang           | rarity: common    | spCost: 10 | basePower: 16  | role: Curse Setup
    obtain: shop | effect: Apply Curse. Cursed enemies take increased dark damage.
    combo: Improves Dark Combo, Abyssal Crit, Dark Rift, and execute spells.
    cast: "A cursed fang bites into the enemy's soul."
    trigger: "Curse Fang weakens the enemy against dark magic."
    expire: "The curse fades from the enemy."

13. id: fog                  | rarity: common    | spCost: 11 | basePower: 0   | role: Disruption / Blind
    obtain: shop | effect: Cover the battlefield in dark fog, increasing the enemy's chance to miss or fail a spell.
    combo: Buys fragile Dark players time to set up curse and burst.
    cast: "A black fog crawls across the battlefield."
    trigger: "Fog disrupts the enemy's aim and casting."
    expire: "The dark fog thins."

14. id: soul_drain           | rarity: common    | spCost: 12 | basePower: 26  | role: Vampiric Healing
    obtain: shop | effect: Deal dark damage and heal the player for part of the damage dealt.
    combo: Healing increases if the enemy is cursed.
    cast: "The mage tears life from the enemy and drinks it as power."
    trigger: "Soul Drain restores HP from the enemy's soul."

15. id: siege                | rarity: uncommon  | spCost: 15 | basePower: 34  | role: Armor Break
    obtain: drop | effect: Crush enemy armor and reduce defense for the current battle.
    combo: Sets up Dark Combo, Abyssal Crit, and Night Raid.
    cast: "A dark siege force hammers the enemy's defenses."
    trigger: "Siege cracks armor and weakens protection."

16. id: dark_combo           | rarity: uncommon  | spCost: 15 | basePower: 46  | role: Combo Amplifier / Crit Scaling
    obtain: drop | effect: Deal dark damage. Consecutive Dark spells increase the dark combo multiplier.
    combo: Main Dark Tower identity spell.
    cast: "The darkness compounds, each strike feeding the next."
    trigger: "Dark Combo increases the dark chain multiplier."

17. id: night_raid           | rarity: uncommon  | spCost: 18 | basePower: 54  | role: Time-Window Burst
    obtain: drop | effect: Deal fast dark damage. Damage is greatly increased during night window (18:00–06:00).
    combo: Pairs with Curse Fang, Siege, and Dark Combo.
    cast: "The mage vanishes into the hour of night."
    trigger: "Night Raid strikes with amplified midnight force."
    rules: ["In local-only MVP, simulate server time using player's local time."]

18. id: dark_rift            | rarity: rare      | spCost: 26 | basePower: 78  | role: True Damage
    obtain: drop | effect: Open a dimensional rift and deal damage that bypasses defense.
    combo: Very strong after Curse Fang.
    cast: "A rift opens where the enemy's shadow should be."
    trigger: "Dark Rift bypasses defense and wounds reality itself."
    rules: ["True damage bypasses defense but not immunity."]

19. id: demon_summoning      | rarity: rare      | spCost: 28 | basePower: 38  | role: Summon / Pressure
    obtain: drop | effect: Summon a demon familiar that attacks or pressures the enemy for several turns.
    combo: Excellent against defensive Light builds and while Fog is active.
    cast: "A demon claw breaks through the summoning circle."
    trigger: "The summoned demon rends the enemy."
    expire: "The demon is pulled back into the abyss."
    rules: ["Summon attacks shown in text logs only."]

20. id: oblivion_gospel      | rarity: ultimate  | spCost: 42 | basePower: 165 | role: Ultimate Curse / Combo Finisher
    obtain: boss | effect: Deal catastrophic dark damage. If curse and combo requirements are met, may execute a weakened enemy.
    combo: Best after Curse Fang, Siege, Fog, Dark Combo, and Night Raid timing.
    cast: "The gospel of oblivion is recited, and the enemy's existence begins to collapse."
    trigger: "Oblivion Gospel consumes accumulated dark power for catastrophic damage."
```

---

### FIRE TOWER (10 spells)

```
21. id: fire_shot            | rarity: common    | spCost: 8  | basePower: 30  | role: Basic Fire Damage
    obtain: shop | effect: Deal basic fire damage to one enemy.
    combo: Feeds Burn and Fire combo plans.
    cast: "The mage launches a burning projectile into the enemy."
    trigger: "Fire Shot scorches the target."

22. id: burn                 | rarity: common    | spCost: 10 | basePower: 12  | role: Stacking Damage Over Time
    obtain: shop | effect: Apply Burn. Burn damages the enemy at the start of each turn and can stack.
    combo: Explosion Burn consumes Burn stacks for burst damage.
    cast: "A harsh flame brands the enemy."
    trigger: "Burn sears the enemy at the start of the turn."
    expire: "The flames gutter out."
    rules: ["Burn stacks but has a practical cap for balance."]

23. id: fire_thief           | rarity: common    | spCost: 12 | basePower: 24  | role: Damage + Credit Steal
    obtain: shop | effect: Deal fire damage and steal a small amount of Gold from the enemy.
    combo: Steals extra Gold if the enemy is Burning.
    cast: "Flames twist into greedy hands and rip Credit from the enemy."
    trigger: "Fire Thief burns and steals treasure."

24. id: ember_skin           | rarity: common    | spCost: 9  | basePower: 0   | role: Self Buff / Survival
    obtain: shop | effect: Increase temporary HP or reduce incoming damage for 2 turns.
    combo: Helps Fire survive while saving SP for Burn detonation.
    cast: "Embers wrap around the mage like living armor."
    trigger: "Ember Skin absorbs part of the incoming damage."
    expire: "The ember armor fades into ash."

25. id: explosion_burn       | rarity: uncommon  | spCost: 18 | basePower: 58  | role: Burn Detonation
    obtain: drop | effect: Consume Burn stacks on the enemy and convert them into a single heavy explosion.
    combo: Core Fire finisher after repeated Burn setup.
    cast: "The burn marks pulse like buried bombs."
    trigger: "Explosion Burn consumes every flame and detonates."
    rules: ["Consumes Burn stacks. Damage scales with stack count."]

26. id: melt_armor           | rarity: uncommon  | spCost: 14 | basePower: 22  | role: Armor Melt / Physical Vulnerability
    obtain: drop | effect: Melt enemy armor so the target takes increased physical damage on later turns.
    combo: Sets up Wyvern attacks or Fire's late pet synergy.
    cast: "White-hot flame crawls across the enemy's armor."
    trigger: "Melt Armor softens the target's defenses."
    expire: "The molten armor begins to harden again."

27. id: fire_storm           | rarity: uncommon  | spCost: 20 | basePower: 46  | role: Area Pressure / Charge Disruption
    obtain: drop | effect: Create a violent fire storm that deals continuing fire pressure and can disrupt charge-type spells.
    combo: Counters Light Charge and similar setup turns.
    cast: "A fire storm tears across the battlefield."
    trigger: "Fire Storm burns and disrupts focused casting."
    expire: "The storm collapses into sparks."

28. id: phoenix_blood        | rarity: rare      | spCost: 22 | basePower: 70  | role: Low HP Power Spell
    obtain: drop | effect: Deal damage based on missing HP. The lower the player's HP, the stronger the attack.
    combo: Turns Fire's high HP pool into comeback pressure.
    cast: "The mage's blood ignites into phoenix fire."
    trigger: "Phoenix Blood grows stronger from missing HP."

29. id: wyvern_kamikaze      | rarity: rare      | spCost: 30 | basePower: 100 | role: Dragon / Wyvern Finisher
    obtain: drop | effect: Command a Wyvern to dive into the target for massive physical fire damage.
    combo: Best after Melt Armor or Burn setup.
    cast: "The mage gives the final command to the circling Wyvern."
    trigger: "Wyvern Kamikaze crashes into the enemy in a storm of fire and scales."
    expire: "The Wyvern retreats into recovery."
    rules: ["Gate this spell behind a placeholder condition until pet systems exist."]

30. id: ragnarok_ignition    | rarity: ultimate  | spCost: 40 | basePower: 160 | role: Ultimate Burn / Dragon Finisher
    obtain: boss | effect: Consume fire setup to deal catastrophic damage. Scales with Burn stacks and Fire Storm pressure.
    combo: Best as final turn after Burn, Fire Thief farming, and Melt Armor setup.
    cast: "The battlefield erupts as Ragnarok Ignition consumes everything."
    trigger: "Ragnarok Ignition detonates all accumulated fire power."
```

---

### ICE TOWER (10 spells)

```
31. id: ice_shot             | rarity: common    | spCost: 8  | basePower: 26  | role: Basic Ice Damage
    obtain: shop | effect: Deal basic ice damage to one enemy.
    combo: Feeds Freeze and Mana Burst plans.
    cast: "The mage shapes a shard of glacial magic."
    trigger: "Ice Shot cuts into the enemy with cold force."

32. id: freeze               | rarity: common    | spCost: 14 | basePower: 12  | role: Turn Denial
    obtain: shop | effect: Attempt to freeze the target, causing it to lose its next spell action.
    combo: Creates room for Energy Refill or Mana Burst setup.
    cast: "A killing frost wraps around the enemy's limbs."
    trigger: "Freeze locks the target out of its next action."
    expire: "The ice prison cracks apart."
    rules: ["Bosses may resist or reduce Freeze duration."]

33. id: energy_refill        | rarity: common    | spCost: 0  | basePower: 0   | role: SP Recovery
    obtain: shop | effect: Recover SP during battle.
    combo: Allows Ice to run expensive control and burst lines.
    cast: "Cold air condenses into usable spell power."
    trigger: "Energy Refill restores SP."
    rules: ["This spell should never fail due to SP cost."]

34. id: frost_ward           | rarity: common    | spCost: 9  | basePower: 0   | role: Fragile Defense
    obtain: shop | effect: Gain a small shield. Enemies that hit the shield may be chilled.
    combo: Helps low-HP Ice survive monster-first turns.
    cast: "A thin ward of frost forms around the mage."
    trigger: "Frost Ward absorbs damage and chills the attacker."
    expire: "The frost ward melts away."

35. id: mana_combo           | rarity: uncommon  | spCost: 12 | basePower: 28  | role: Mana Burst Setup
    obtain: drop | effect: Deal ice damage and increase Mana Combo count.
    combo: Prepares Mana Burst and rewards careful 10-turn planning.
    cast: "The mage threads cold mana into a precise sequence."
    trigger: "Mana Combo increases the stored arcane pattern."

36. id: mana_burst           | rarity: uncommon  | spCost: 22 | basePower: 68  | role: Mana Combo Finisher
    obtain: drop | effect: Release stored mana into a sharp burst of ice damage. Consumes Mana Combo stacks.
    combo: Core Ice burst route.
    cast: "Stored cold mana flashes beyond control."
    trigger: "Mana Burst releases the accumulated combo."
    rules: ["Consumes Mana Combo stacks."]

37. id: golem_command        | rarity: uncommon  | spCost: 18 | basePower: 36  | role: Golem Summon / Pressure
    obtain: drop | effect: Command an arcane ice golem to attack or guard for several turns.
    combo: Alternative Ice route for players who prefer mechanical summon pressure over mana burst.
    cast: "A runed golem core wakes beneath the ice."
    trigger: "The golem obeys and crushes the enemy."
    expire: "The golem's core falls silent."
    rules: ["Represent golem actions in text logs only."]

38. id: absolute_zero        | rarity: rare      | spCost: 28 | basePower: 70  | role: Hard Control / Freeze Amplifier
    obtain: drop | effect: Deal heavy ice damage and greatly improve Freeze reliability or duration.
    combo: Turns earlier Freeze or Frost Ward chill into a decisive control window.
    cast: "All heat vanishes from the battlefield."
    trigger: "Absolute Zero deepens the freeze into silence."
    expire: "Warmth slowly returns."
    rules: ["Boss control duration should be reduced for balance."]

39. id: golem_master         | rarity: rare      | spCost: 30 | basePower: 52  | role: Advanced Golem Build
    obtain: drop | effect: Empower the active golem or summon a stronger war golem for multiple turns.
    combo: Build-defining alternative to Mana Burst.
    cast: "The mage speaks the command language of ancient steel."
    trigger: "Golem Master awakens a heavier war machine."
    expire: "The empowered golem powers down."
    rules: ["Gate usage behind progression if summon systems are not implemented yet."]

40. id: glacial_singularity  | rarity: ultimate  | spCost: 44 | basePower: 155 | role: Ultimate Control / Mana Finisher
    obtain: boss | effect: Collapse frozen mana into a singularity that deals catastrophic damage and disrupts the enemy's next action.
    combo: Best after Freeze, Energy Refill, Mana Combo, and Mana Burst setup.
    cast: "A star of frozen mana collapses between the combatants."
    trigger: "Glacial Singularity tears heat, motion, and spell power from the enemy."
    rules: ["High SP cost is acceptable because Ice has the highest SP identity."]
```

---

## Price Rules for Common Spells
| spCost | price |
|--------|-------|
| 0      | 100   |
| 1–8    | 120   |
| 9–11   | 150   |
| 12+    | 180   |

Non-common spells: `price: 0`

---

## File Structure Rules
- Start with `'use strict';`
- Single `const SPELLS_DATA = [...]` array with all 40 spells
- All 5 functions defined after the array
- End with `window.*` assignments for all functions + `window.SPELLS_DATA`
- No ES6 imports/exports — vanilla JS only

## Do Not Touch
`index.html`, `state.js`, `battle.js`, `shop.js`, `ui.js`, `inventory.js`, `fusion.js`, `order.js`, `tower.js`, all CSS files.
