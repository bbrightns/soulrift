# SOULRIFT — Dev Prompt Step 4: Drop System (Catalyst + Tower-Locked Uncommon)

## Context
Continuing SOULRIFT RPG Chronicles. Vanilla HTML/CSS/JS only.

## Design Rules (DO NOT deviate)
- Common spells: shop only, never drop
- Uncommon spells: drop only from Magi Graveyard, MUST match player's current tower
- Rare spells: exchange only (future system)
- Ultimate spells: boss only (future system)
- Catalyst items: global, no tower lock, same drop rate all towers
- Spell drops are tower-locked. Catalyst drops are NOT tower-locked.

---

## Touch ONLY these files: `enemies.js`, `battle.js`, `index.html`

---

## Task 1 — enemies.js: Add dropTable to each enemy

### Drop item shapes
```js
// Catalyst drop (global, no tower)
{ id: 'catalyst_shard', type: 'catalyst', chance: 0.10 }

// Uncommon spell drop (tower-locked — resolved at runtime, not hardcoded here)
{ type: 'uncommon_spell', chance: 0.15 }
```

For `type: 'uncommon_spell'` — do NOT hardcode a spell id here.
The actual spell is resolved at runtime based on `getTower()`.

### Add to each enemy:

**booby** (Booby Forest):
```js
dropTable: [
  { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
]
```

**goblin_frenzy** (Booby Forest):
```js
dropTable: [
  { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
]
```

**training_shadow** (Booby Forest):
```js
dropTable: [
  { id: 'catalyst_shard', type: 'catalyst', chance: 0.10 },
]
```

*(Magi Graveyard enemies don't exist yet — they will be added in a future step.
When they are added, their dropTable will include:)*
```js
dropTable: [
  { type: 'uncommon_spell', chance: 0.15 },
  { id: 'catalyst_core', type: 'catalyst', chance: 0.06 },
]
```

---

## Task 2 — battle.js: Add helper functions BEFORE runAutoBattle()

### formatItemName()
```js
function formatItemName(id) {
  const names = {
    catalyst_shard:   'Catalyst Shard',
    catalyst_core:    'Catalyst Core',
    catalyst_crystal: 'Catalyst Crystal',
  };
  return names[id] || id;
}
```

### getRandomUncommonForTower()
```js
function getRandomUncommonForTower() {
  const tower = getTower();
  if (!tower || !window.getAllSpells) return null;
  const pool = getAllSpells().filter(s =>
    s.tower === tower && s.rarity === 'uncommon'
  );
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
```

### giveCatalyst()
```js
function giveCatalyst(id) {
  const s = getState();
  if (!Array.isArray(s.items)) s.items = [];
  const existing = s.items.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { s.items.push({ id, qty: 1 }); }
}
```

### rollDrops()
```js
function rollDrops(enemyTemplate) {
  const drops = [];
  if (!enemyTemplate || !Array.isArray(enemyTemplate.dropTable)) return drops;

  enemyTemplate.dropTable.forEach(entry => {
    if (Math.random() >= entry.chance) return;

    if (entry.type === 'catalyst') {
      giveCatalyst(entry.id);
      drops.push({ type: 'catalyst', name: formatItemName(entry.id) });

    } else if (entry.type === 'uncommon_spell') {
      const spell = getRandomUncommonForTower();
      if (!spell) return;
      giveSpell(spell.id, 1);
      drops.push({ type: 'spell', name: spell.name, rarity: 'uncommon' });
    }
  });

  return drops;
}
```

---

## Task 3 — battle.js: Call rollDrops() in victory handler

Find this exact block:
```js
const won = enemy.hp <= 0 && player.hp > 0;
if (won) {
  const goldReward = enemy.gold + Math.floor(Math.random() * 25);
  const expReward = enemy.exp;
  s.gold += goldReward;
  gainExp(expReward);
  await appendBattleLog('Victory. Gained ' + goldReward + ' Gold and ' + expReward + ' EXP.', 'reward');
  showBattleOutcome({ won: true, goldReward, expReward });
  setBattleResult('<span class="c-ok">Victory recorded</span>');
```

Replace with:
```js
const won = enemy.hp <= 0 && player.hp > 0;
if (won) {
  const goldReward = enemy.gold + Math.floor(Math.random() * 25);
  const expReward = enemy.exp;
  s.gold += goldReward;
  gainExp(expReward);

  const drops = rollDrops(enemyTemplate);
  saveState();

  await appendBattleLog('Victory. Gained ' + goldReward + ' Gold and ' + expReward + ' EXP.', 'reward');
  for (const drop of drops) {
    await appendBattleLog('✦ Drop: ' + drop.name, 'reward');
  }

  showBattleOutcome({ won: true, goldReward, expReward, drops });
  setBattleResult('<span class="c-ok">Victory recorded</span>');
```

---

## Task 4 — battle.js: Remove inventory snapshot guard

Find and DELETE this entire block:
```js
if (JSON.stringify(s.spells) !== inventoryBefore) {
  console.warn('[battle] Inventory changed during battle; restoring spell inventory snapshot.');
  s.spells = JSON.parse(inventoryBefore);
}
```

This block was a safeguard against accidental inventory changes during battle.
Now that drops intentionally modify inventory after battle, this block must be removed.
`saveState()` inside the victory handler handles persistence correctly.

---

## Task 5 — battle.js: Update showBattleOutcome() to display drops

Find the `showBattleOutcome` function.
After the line that calls `setText('battle-result-rewards', ...)`, add:

```js
// Drop display
const dropEl = document.getElementById('battle-drops');
if (dropEl) {
  if (outcome.drops && outcome.drops.length > 0) {
    dropEl.innerHTML = outcome.drops.map(d =>
      '<div class="c-gold" style="font-size:13px;margin-top:4px;">✦ ' + d.name + '</div>'
    ).join('');
  } else {
    dropEl.innerHTML = '<div style="opacity:0.35;font-size:12px;margin-top:6px;">No drops this run.</div>';
  }
}
```

Also update `clearBattleOutcome()` — add this line inside it:
```js
const dropEl = document.getElementById('battle-drops');
if (dropEl) dropEl.innerHTML = '';
```

---

## Task 6 — index.html: Add #battle-drops div

Find this exact block:
```html
<div class="battle-result-rewards" id="battle-result-rewards"></div>
```

Replace with:
```html
<div class="battle-result-rewards" id="battle-result-rewards"></div>
<div id="battle-drops"></div>
```

---

## Do Not Touch
`state.js`, `shop.js`, `ui.js`, `inventory.js`, `fusion.js`,
`order.js`, `tower.js`, `spells.js`, `theme.css`, `layout.css`, `atmosphere.css`
