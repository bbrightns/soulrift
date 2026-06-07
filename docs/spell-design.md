# SOULRIFT — Spell Design Reference

> เอกสารนี้ใช้เป็น reference สำหรับการออกแบบระบบเวทย์ใหม่  
> อ้างอิงจากเกมต้นแบบ + แนวคิดที่ปรับให้เหมาะกับ SOULRIFT

---

## Core Design Philosophy

- แต่ละ Tower มี **"สิ่งที่สะสม" (Accumulator)** เป็นของตัวเอง
- ทุก Tower ใช้ pattern เดียวกัน: **Setup → Accumulate → Payoff**
- Combo ระหว่าง spell คือ soul ของเกม — spell เดี่ยวไม่ควรแรงเท่า combo
- Ultimate spell ต้องรู้สึก **payoff จริงๆ** เมื่อ setup ครบ
- ดาเมจใช้ **% of ATK** ไม่ใช่ flat number — ทำให้ scale ตาม stat อัตโนมัติ

---

## Design Vision — สิ่งที่ SOULRIFT ต้องการสื่อให้ผู้เล่นรู้สึก

> combo ทั้งหมดที่เห็นใน reference นี้คือ **จินตนาการ** ไม่ใช่กลไกบังคับ  
> สิ่งที่ต้องการคือให้ผู้เล่น SOULRIFT **ค้นพบ combo เหล่านี้เอง**

### ความรู้สึกที่ต้องการ

- เวทย์แต่ละตัว **มีบทบาท** — ไม่ใช่แค่กดแล้วตัวเลขขึ้น
- มี **ทางเลือกหลายทาง** — ไม่มีสูตรตายตัว
- พอเจอ combo ที่ work แล้ว **รู้สึกฉลาด** ไม่ใช่รู้สึกแค่โชค
- มี "คอมโบหากิน" ยอดนิยม แต่ก็มีทางอื่นที่ work ได้เช่นกัน

### หลักการออกแบบ 10 เวทย์ต่อหอ

แม้จะมีเพียง 10 เวทย์ต่อ Tower สิ่งที่สร้าง depth ไม่ใช่จำนวน แต่คือ **interaction ระหว่างเวทย์**

ทุก Tower ต้องมีอย่างน้อย:
- **1 Enabler** — เวทย์ที่สร้างเงื่อนไข (เช่น Freeze, Flood, Dark Cloud)
- **1 Payoff** — เวทย์ที่ได้ประโยชน์จากเงื่อนไขนั้น (เช่น Terra Voltage, Overlaps, Night Raid)

เมื่อผู้เล่นค้นพบว่า "ถ้าร่าย A ก่อน แล้วตาม B จะแรงขึ้น" — นั่นคือ combo ที่เกิดขึ้นเอง

---

## Tower Summary

### Stats โดยรวม

| Tower | ATK | HP | SP | DEF | จุดเด่น |
|-------|-----|----|----|-----|---------|
| 🔥 Fire | ★★★★★ | ★★★ | ★★ | ★★ | Burn สะสมเอง, Wyvern ตีฟรี |
| ☀️ Light | ★★★ | ★★★★★ | ★★★★ | ★★★★★ | Heal + Shield ยืดเวลา, Mana Explosion |
| 🌑 Dark | ★★★★★ | ★★ | ★★★ | ★★ | Night burst, ทะลุทุกการป้องกัน |
| ❄️ Water | ★★ | ★★ | ★★★★★ | ★★★ | Mana Shield (SP = HP สำรอง), Overlaps |

### ข้อดี / ข้อเสีย

| Tower | ข้อดี | ข้อเสีย |
|-------|-------|---------|
| 🔥 Fire | Burn ทะลุ Heal, จบเร็ว, ไม่ต้อง setup มาก | SP น้อย, โดน Reverse Soul ตาย, Armor Impaction เจ็บมาก |
| ☀️ Light | อยู่ยงมาก, Mana Explosion ทะลุ DEF | Setup หนัก, Healing Trap กลับด้านทันที, Dark จบก่อน Turn7 ได้ |
| 🌑 Dark | Night Raid แรงสุด, Anger Spirit ทะลุทุกอย่าง, Doppelgänger รับ burst | HP น้อย, ต้องพึ่ง timing กลางคืน, Holy Guard ป้องกันได้ |
| ❄️ Water | HP+SP รวมกัน = ทนมาก, Overlaps ไม่มีเพดาน | ATK ต่ำสุด, Setup หนัก, vs Fire ยาก (EB ออกไม่ได้) |

### คอมโบหากินของแต่ละ Tower

**🔥 Fire**
```
Flame Shot (stack burn) → Echo of Flame → Infernal × N → Magma Surge
```
จบด้วย burn accumulated ทีเดียว

**☀️ Light**
```
Enchantment stack + Shield → chargeStack → Blast of Enchantment
หรือ SP สูง → Mana Explosion (ทะลุ DEF ทุกอย่าง)
```

**🌑 Dark**
```
Dark Cloud → Soul Offering → Night Raid × 2 (ปิดใน 2 turn)
vs Light: Armor Impaction → Anger Spirit
รับ burst: Doppelgänger → ร่างแยกตาย → ร่างจริง Night Raid ปิด
```

**❄️ Water**
```
Energy Balance → Mana Heart → Flood → Energy Blast × 3 → Overlaps
หรือ: Freeze → Terra Voltage (Inventor opener)
```

### matchup น่าสนใจ

| คู่ | ทำไมน่าสนใจ |
|-----|-----------|
| 🔥 vs ☀️ | Fire ต้องจบก่อน Holy Guard Turn7 ขึ้น |
| 🌑 vs ❄️ | Dark ต้อง Reverse Soul ก่อน Water ใช้ Mana Heart |
| ☀️ vs ❄️ | ทั้งคู่ survive ได้นาน — ยาวที่สุด |
| 🌑 vs 🔥 | Dark ชนะถ้ากลางคืน, Fire ชนะถ้ากลางวัน + SP ยังเหลือ |

---

## Damage Formula (ใหม่)

```
damage = Math.floor(player.atk * (spell.atkPct / 100))
```

### ช่วง atkPct ตามความหายาก

| Rarity   | atkPct (base hit) | หมายเหตุ |
|----------|-------------------|----------|
| Common   | 100–140%          | ไม่มีเงื่อนไข ใช้ได้ทันที |
| Uncommon | 150–250%          | มีเงื่อนไขเล็กน้อย หรือ side effect |
| Rare     | 200–400%          | ต้องการ setup หรือเงื่อนไขพิเศษ |
| Ultimate | 350–500%+         | ต้องการ full setup ถึง payoff |

### Spell ที่ไม่ใช้ atkPct
บาง spell ใช้สูตรต่างออกไป เช่น:
- `% of Burn accumulated` → Explosion Burn
- `% of enemy max HP` → Shock Wave
- `% of HP lost` → Fire Blood, Blood Equilibrium
- `player.level × multiplier` → Suicide Bomb

---

## Spell Types

| Type | คำอธิบาย | ตัวอย่าง |
|------|----------|---------|
| **Attack** | โจมตีโดยตรง | Flame Shot, Ice Shot |
| **DoT** | ความเสียหายต่อเนื่องทุก turn | Burn, Unstable Burn |
| **Buff** | เพิ่ม stat ฝั่งเรา | Strength of Fire, Ember Skin |
| **Debuff** | ลด stat ศัตรู | Melt Armor, Siege |
| **Enchantment** | passive ที่ต้องจ่าย maintenance | Flaming Sphere, Dragonic Favour |
| **Hex** | debuff ถาวรบนศัตรู มี maintenance | Unstable Ground, Money Corrupt |
| **Ward** | trigger เมื่อเงื่อนไขครบ | Ward of Flame (HP < 25%) |
| **Control** | หยุด/ขัด action ศัตรู | Freeze, Fog |
| **Utility** | ผล side effect พิเศษ | Energy Refill, Blood to Mana |
| **Ultimate** | boss drop, payoff สูงสุด | Everant's Call, Word of Destruction |

---

## 10-Turn Battle Structure

```
Turn 1–3   : Setup phase  — วาง Enchantment, Buff, DoT
Turn 4–7   : Accumulate   — สะสม stacks, สร้าง pressure
Turn 8–10  : Payoff       — ระเบิด combo (ExBurn, Singularity, etc.)
```

> Spell ที่ใช้ turn เยอะต้องได้ payoff ที่ชัดเจน  
> Spell ที่ใช้ turn น้อยต้อง damage ต่ำกว่า combo route

---

---

## 🔥 Fire Tower

### Identity
เน้น**เลือด (HP)** และ**ไฟสะสม (Burn)** — ยิ่งยืดเกมนาน ยิ่งแรง  
สู้แบบ slow burn: ทนรับดาเมจ สะสม Burn จนระเบิด

### Core Accumulator: `burnAccum`
- Burn spell แต่ละ cast เพิ่ม `burnAccum` (หน่วย damage ต่อ turn)
- `burnAccum` ดำรงอยู่ตลอดจนกว่าจะถูก consume
- **Explosion Burn** = `burnAccum × atkPct%` แล้ว reset `burnAccum = 0`
- **Melt Armor** = ลด enemy DEF ตาม `burnAccum` ทั้งหมด
- **Heat Up** = เพิ่ม `burnAccum` % แล้ว deal damage ตามที่เพิ่มขึ้น

### Spell List (Fire Tower)

#### Shop Spells (Common)
| Spell | atkPct (Lv1→Lv15) | SP Cost | หมายเหตุ |
|-------|--------------------|---------|---------|
| Flame Shot (FS) | 110%→250% | 12→40 | basic shot, ไม่มีเงื่อนไข |
| Strength of Fire (SoF) | — | 0 | buff: +ATK%, +DEF flat. ใช้ได้ครั้งเดียว/battle |
| Force Wyvern (FW) | — | 30 (ทุก Lv) | สั่ง Wyvern โจมตีทันที, +damage flat |
| Burn (B) | — | 18→66 | DoT: เพิ่ม burnAccum X หน่วย/turn |
| Wyvern Breaker (WB) | 110%→250% | 25 (ทุก Lv) | ขับ Wyvern ศัตรูออก |
| Machine Breaker (MB) | 110%→250% | 25 (ทุก Lv) | หยุดเครื่องจักรศัตรู |
| Fire of Thief (FoT) | 110%→250% | 19→75 | deal damage + ขโมย Gold |
| Seal of Dragon (SoD) | — | 0 | Summon Wyvern (tier ตาม Lv) |
| Money Strike (MS) | 130%→340% | 19→75 | ใช้ Gold 100 เพิ่มดาเมจ |
| Melt Armor (MA) | — | 120→0 (Lv13), -20 (Lv15) | ลด DEF ตาม burnAccum |

#### Drop Spells (Uncommon / ไม่มีในร้าน)
| Spell | สูตร | SP Cost | หมายเหตุ |
|-------|------|---------|---------|
| Meteor Strike (MS/Mete) | 120%→400% ATK | 24→80 | ดาเมจหลังจาก 3 turn |
| Force of Dragon (FoD) | 110%→250% ATK | 23→59 | +8.5%/Slayer rank crit chance, +Gold หลังสู้ |
| Granite Skin (GS) | — | Enchant | จำกัดดาเมจ 5 turn แรกไม่เกิน X% max HP |
| Unstoppable (Unstop) | — | 33→75 | เวทย์ turn ถัดไปไม่สามารถ block/reflect |
| Shock Wave (SW) | 6%→20% enemy max HP | 24→80 | เวทย์ประชิด, ดัน Siege ออก |
| Inferno | 70%→210% ATK + Burn | 33→69 | ประชิด, เพิ่ม burnAccum ทุก cast |
| Ward of Flame (WoF) | — | Enchant | trigger เมื่อ HP < 25%: +burnAccum, +Wyvern dmg |
| Blood to Mana (B2M) | — | — | แลก HP เป็น SP |
| Greeder (GD) | — | 5→75 | +Gold% หลังการต่อสู้ |
| Flare | flat dmg (no DEF) | 72→(-40) | เปลี่ยน night→day, SP cost ลดจนติดลบ |
| Echo of Flame (EoF) | +20 burnAccum | 28→70 | มีโอกาส cast ซ้ำอัตโนมัติ (17%→45%) |
| Explosion Burn (ExBurn) | burnAccum × 320%→620% | 45→125 | consume burnAccum ทั้งหมด |
| Wyvern Control (WC) | — | — | +Wyvern dmg%, +attack chance |
| Blood Equilibrium (BEQ) | 90%→146% of HP lost | 34→90 | ลด HP เราให้เท่าศัตรู, deal dmg ตาม HP ที่หาย |
| Wyvern Guard (WG) | — | 65 (ทุก Lv) | sacrifice Wyvern เพื่อลดดาเมจ 44%→100% |
| Fire Blood (FB) | 74%→130% of half HP | 19→75 | ลด HP ฝั่งเราครึ่ง, deal dmg ตามที่หาย |
| Unstable Burn (UnBurn) | 20→90 burnAccum/turn | 38→80 | แรงกว่า Burn แต่ 30% chance โอก เพิ่ม HP ศัตรู |
| Flaming Sphere | — | Enchant | ฝ่ายตั้งรับ: โอกาส 19%→67% สร้าง 30% ATK dmg + burnAccum |
| Siege (Enchant) | — | Enchant | เข้าประชิดหอศัตรู, ลด SP ค่าใช้จ่ายตาม Lv |
| Unstable Ground | — | Hex | ลด wall level ศัตรู |

#### Rare Spells
| Spell | สูตร | SP Cost | หมายเหตุ |
|-------|------|---------|---------|
| Suicide Bomb (SB) | player.level × 7.5→14.5 | 45→115 | ประชิด, เสียหายทั้ง 2 ฝ่าย, ใช้ได้ครั้งเดียว, ไม่ได้ใน 3 turn แรก |
| Flame Shield (Fsh) | reflect 12%→46% dmg received | 35→120 | +DEF, reflect ดาเมจ |
| Extend Life (Ext) | — | 25→95 | +HP max และ HP ปัจจุบัน 27.5%→62.5% ครั้งเดียว |
| Blood Exchange (BEX) | — | 43→85 | สลับ HP กับศัตรู (62%→90% success) |
| Defense of Dragon (DoD) | — | 90→160 | +DEF 27%→55% (ต้องมี Wyvern) |
| Fire Eater (FE) | 85%→155% of burnAccum → HP | 85→15 | แปลง burnAccum ศัตรูเป็น HP ฝั่งเรา |
| Fire Storm (FSt) | player.level per ball | 50% SP remaining | ยิง 1→17 ลูก, 20% dmg → burnAccum |
| Wyvern Kamikaze (WK) | Wyvern ATK × 60%→1020% × turns | 65→145 | sacrifice Wyvern, แรงขึ้นตาม turn ที่ Wyvern อยู่ |
| Heat Up (HU) | +16%→30% burnAccum, × 1.1→2.4 dmg | 35→105 | เพิ่ม burn แล้ว deal ดาเมจตามที่เพิ่ม |
| Blaze | 115%→325% (ATK + DEF) | 33→75 | ประชิด, หลัง cast ATK/DEF -30% |
| Money Corrupt (MC) | — | Hex | ขโมย Gold 1,000→11,000 หลังชนะทุกครั้ง |

#### Enchantments (Passive / Maintenance)
| Spell | Effect | Maintenance |
|-------|--------|-------------|
| Dragonic Favour (DF) | +HP, +ATK, +DEF flat | Credit + SP/day |
| Flame Attunement (FA) | immune Freeze, +SP max%, +ATK vs Ice | Credit + SP/day |
| Enchantment of Luck (EoL) | +รายได้รายวัน % | Credit + SP/day |
| Fire and Fury (FoF) | Guild Hex: +burnAccum ทุก turn ฝั่งศัตรู, -Wyvern chance | Guild War only |

#### Ultimate Spells (Boss Drop)
| Spell | Effect | SP Cost |
|-------|--------|---------|
| Everant's Call | เปลี่ยน Wyvern → Everant (Legendary), โจมตีทันที 3× | 100 |
| Replenish (Rep) | 67%: เติม HP เต็ม / ล้มเหลว: +200 HP ทั้ง 2 ฝ่าย | 80 |
| Word of Destruction (WoD) | 400% ATK, Wyvern+เครื่องจักรศัตรูหยุดตลอดเกม | 100 |
| Flame Lord Form | Enchant: auto-cast Burn Lv15, -20% dmg from Fire/Water | 250,000 Credit |
| Phoenix Form | Enchant: Wyvern → Phoenix (Everant power, revive ทุก turn) | 250,000 Credit |

### Fire Combos
| Combo | Spells | Strategy |
|-------|--------|----------|
| **Intensive Burn** | Burn + Echo of Flame + Fire Storm + ExBurn | สะสม burnAccum ให้มากที่สุด แล้วระเบิด |
| **Blood Attack** | Extend Life + Fire Blood + Replenish | แลก HP โจมตี เหมาะกับศัตรู HP น้อย |
| **Change Lose to Win** | Blood Exchange + any damage spell | HP เหลือน้อย → สลับ HP → ปิดเกม |
| **Money is God** | Fire of Thief + Greeder | farm Gold ระหว่างสู้ |

---

---

## ❄️ Ice / Water Tower

### Identity
**"ควบคุม SP — ของตัวเองและศัตรู"**  
HP น้อย แต่ชดเชยด้วย Mana Shield (รับดาเมจด้วย SP แทน HP)  
ชนะด้วยการบีบ SP ศัตรูจนร่ายเวทย์ไม่ออก หรือสร้างส่วนต่าง SP แล้วปิดด้วย Overlaps

### 2nd Class
| Class | แนวทาง | เวทย์เด่น |
|-------|---------|----------|
| **Energy Tower** | SP manipulation — drain enemy SP, ยิง Overlaps ปิดเกม | Energy Blast, Overlaps, Energy Amplified |
| **Inventor Tower** | Golem army — March of Golem + Blood Golem drain | Call Blood Golem, March of Golem, Terra Voltage |

### Core Mechanics (3 resource tracks)

#### 1. `ownSP` — SP ของเราคือ HP สำรอง
- **Mana Shield** (Enchant): damage ส่วนหนึ่งลด SP แทน HP → อยู่รอดได้นานกว่า
- **Switch of Polarity**: สลับ HP↔SP + bonus เล็กน้อย → ใช้เมื่อ SP < HP เพื่อดึง SP กลับมา
- **Energy Balance**: equalize SP เราให้เท่า SP ศัตรู (เมื่อ SP เราน้อยกว่า) → ดึง SP จากศัตรูทางอ้อม
- **Mana Heart**: แปลง SP ทั้งหมด → HP แล้ว SP Max = 0 (ใช้ Energy Balance ก่อน เพื่อให้ SP เยอะ)

#### 2. `enemySP` — บีบ SP ศัตรูให้หมด
- **Echo of Exhaustion**: ลด SP ศัตรู 20, โอกาส cast ซ้ำ
- **Energy Golem**: โกเลมที่ลด SP ศัตรูทุก hit (ดี vs Fire ที่ SP น้อย)
- **Flood**: ลด HP ศัตรูทุก turn + ลด ATK เล็กน้อย (เหมาะ vs Light / Fire ที่ HP สูง)

#### 3. `spGap` — ส่วนต่าง SP คือดาเมจ
- **Energy Blast**: แรงกว่า Ice Shot 20% **แต่** ใช้ได้เมื่อ SP ศัตรู > 50% เท่านั้น
- **Overlaps**: dmg ตามผลต่าง SP (เรา − ศัตรู) → **finisher หลักของ Energy build**
- **Energy Burst**: ลด HP ทั้ง 2 ฝ่ายตาม SP ที่เสียไปรวมกัน (ดี vs Light ที่ SP สูง)

### Win Conditions

| วิธี | Flow | เหมาะกับ |
|------|------|---------|
| **SP Gap Finisher** | Balance → Heart → Flood → EB×N → Overlaps | Energy build vs ทุก tower |
| **Golem Swarm** | Balance → Heart → BG×4 + MoG | Inventor vs Light/monster |
| **SP Drain** | EGolem + Echo ×N → EB → Burst | vs Fire (SP น้อยอยู่แล้ว) |
| **Freeze Combo** | Freeze → Terra Voltage | Inventor form opener |
| **Time Stall** | Time Warp / Time Lapse + Mana Shield | รับ burst แล้ว recover |

### Spell List

#### Shop Spells (Common)
| Spell | Effect | หมายเหตุ | ★ |
|-------|--------|---------|---|
| Ice Shot (IS) | basic dmg | ไม่มีเงื่อนไข fallback | C |
| Energy Blast (EB) | IS + 20%, ใช้ได้เมื่อ enemy SP > 50% | เวทย์หลัก หลอม Lv สูงๆ | A |
| Energy Recharge | ฟื้น SP จำนวนหนึ่ง | ไม่ค่อยใช้ถ้ามี Mana Heart | D |
| Energy Refill | ฟื้น SP ต่อเนื่อง ถ้า SP < 50% | ไม่ค่อยใช้ถ้ามี Mana Heart | D |
| Flood (Fl) | ลด HP ศัตรูทุก turn + ลด ATK เล็กน้อย | ยิ่ง MaxHP ศัตรูเยอะ ยิ่งดี | B |
| Freeze (Fr) | ติดสถานะแช่แข็ง → ลด ATK ศัตรูมาก | จำเป็นสำหรับ Inventor form | C |
| Call Golem (G) | Golem ATK สูง ไม่มี effect พิเศษ | ใช้ก่อนมี BG | B |
| Call Plattinium Golem (PG) | Golem DEF สูง ATK ต่ำ | ไม่แนะนำ ใช้ G แทน | D |
| Detonate (D) | ระเบิด Explosive Golem ทุกตัว | ต้องมี ExG จำนวนมากถึงคุ้ม | C |
| Enchant Frost Breath (EFB) | เพิ่ม Wyvern + ลด SP ศัตรู | ถ้าเงินเหลือ | C |
| Extinguish (Ex) | ลด Burn damage ของหอไฟ | ใช้ได้เฉพาะ vs Fire | E |
| Seal of Energy (SE) | ดูด SP ศัตรูเล็กน้อย | น้อยมาก ไม่คุ้ม | E |
| Siege (Si) | เข้าประชิด + ลด SP ใช้ | ไม่มีเวทย์ melee | E |

#### Non-Shop Spells (Drop/Exchange)
| Spell | Effect | หมายเหตุ | ★ |
|-------|--------|---------|---|
| Mana Shield (MS) | Enchant: dmg บางส่วน → SP แทน HP | หัวใจของทุก Water build | A |
| Switch of Polarity (SW) | สลับ HP↔SP + bonus, ใช้เมื่อ SP < 90% | ดึง SP กลับหลัง Mana Shield กิน | B |
| Energy Balance (Ba) | ปรับ SP เราให้เท่า SP ศัตรู (เมื่อ SP เราน้อยกว่า) | ใช้ก่อน Mana Heart | B |
| Energy Burst (Bu) | ลด HP ตาม SP ที่เสียไปทั้ง 2 ฝ่าย | ดี vs Light (SP สูง) แย่ vs Fire | B |
| Echo of Exhaustion (Echo) | ลด SP ศัตรู 20, โอกาส cast ซ้ำ | drain SP ต่อเนื่อง | B |
| Call Energy Golem (EG) | Golem ลด SP ศัตรูตาม ATK | ป้องกัน, ดี vs Fire | B |
| Call Explosive Golem (ExG) | Golem ระเบิดได้ด้วย Detonate | ต้องมีจำนวนมากถึงคุ้ม | C |
| Call Armor Golem (AG) | Golem ถูกทำลาย → ฟื้นตัวใหม่ | counter WoD ของ Fire | C |
| Mana Vortex (MV) | IS dmg + ลด SP ศัตรูบางส่วน | ถ้า Lv สูงก็พอใช้ | C |
| Snow Storm (SnS) | ลด dmg จาก Fire + ลดโอกาส Wyvern โจมตี | เฉพาะ vs Fire | C |
| March of Golem (MoG) | dmg เมื่อมี Golem ชนิดเดียวกันในสนาม | เวทย์หลัก Inventor build | A |
| Terra Voltage (TV) | dmg แรงขึ้นมากถ้าศัตรูติด Freeze | opener สำหรับ Inventor form | A |
| Leak and Exhaustion (LAE) | Hex: ลด SP ศัตรู (War เท่านั้น) | ไม่มีประโยชน์ solo | E |

#### Rare Spells
| Spell | Effect | หมายเหตุ | ★ |
|-------|--------|---------|---|
| Mana Heart (MH) | แปลง SP ทั้งหมด → HP, SP Max = 0 | ใช้ Energy Balance ก่อน | A |
| Overlaps (OL) | dmg ตามส่วนต่าง SP (เรา − ศัตรู) | ไม้ตาย Energy build | A |
| Energy Amplified (EA) | Enchant: +ATK แต่ใช้ SP เพิ่ม | ถ้าเวทย์ยิงเบาเกินไป | A |
| Call Blood Golem (BG) | Golem drain HP ศัตรู 50% ของ ATK | โกเลมดีที่สุด | A |
| Aqua Illusion (AL) | ถ้าศัตรูโจมตี illusion → เราไม่รับ dmg | ไม่ป้องกันเวทย์ทะลุเกราะ | B |
| Time Lapse (TL) | ย้อน HP/SP ไปต้นเทิร์นที่แล้ว | ถ่วงเวลา หรือ recover หลังโดน burst | C |
| Time Warp (TW) | หลุดออกจากเวลา 1 เทิร์น | ใช้เปลี่ยน Form ได้ด้วย | C |

#### Ultimate Spells (Boss Drop)
| Spell | Map | หมายเหตุ |
|-------|-----|---------|
| Mind Freeze (อัลติ1) | Neuro Laboratory (Lv45-60) | — |
| Absolute Zero (อัลติ2) | ต่อจาก Mind Freeze | BG Lv3+ + MoG Lv5+ + MH Lv5+ ชนะ Turn10 |
| Overload (อัลติ3) | (กำลังหาทาง) | BG Lv5+ + MoG Lv5+ + MH Lv5+ |

### Water Tower Spell Sets

#### Energy Build
```
Turn 1: Energy Balance
Turn 2: Mana Heart
Turn 3: Flood
Turn 4-6: Energy Blast
Turn 7: Energy Burst
Turn 8+: Energy Blast (→ Overlaps ถ้า SP gap กว้างพอ)
เสริม: Energy Amplified ถ้าต้องการยิงแรงขึ้น
```

#### Inventor Build
```
Turn 1: Energy Balance
Turn 2: Mana Heart
Turn 3-5: Call Blood Golem ×3 (+ March of Golem active)
Turn 6: Flood
Turn 7: Energy Burst
Turn 8+: Call Blood Golem
ถ้าไม่มี BG: ใช้ Golem Lv7+ แทน
```

### Tips & Counters

| ศัตรูใช้ | Water ตอบโต้ด้วย |
|---------|----------------|
| Burn (Fire) | Extinguish, Snow Storm |
| Mana Explosion (Light) | ระวัง SP สูง → โดนหนัก, ใช้ Mana Heart ก่อน |
| Night Raid (Dark) | Mana Shield รับ → Balance → Heart → Overlaps |
| Reverse Soul (Dark) | ใช้ Mana Heart ก่อนที่ Dark จะร่าย (SP Max = 0) |
| DEF/Armor (Light) | Energy Burst + Flood ไม่สนใจ DEF |
| Holy Guard (Light) | รีบปิดเกมก่อน Turn7 |

### Identity (draft)
เน้น**ควบคุม (Control)** และ**ความแม่นยำ (Precision)**  
สะสม cold pressure บนศัตรู จนล็อกได้ แล้วระเบิด Mana Burst

### Core Accumulator: `coldStack` *(draft — รอ confirm)*
- Chill/Freeze spell เพิ่ม coldStack
- Mana Burst scale ตาม coldStack
- Glacial Singularity consume ทั้งหมด

---

---

## ☀️ Light Tower

### Identity
**"การป้องกันที่สมบูรณ์แบบ + ท่าไม้ตายที่รุนแรง"**  
ATK ต่ำที่สุดของทุก Tower (multiplier 1.2×) แต่ DEF สูงที่สุด (2.0×)  
เน้นการอยู่รอด สะสม resource ให้ครบ แล้วชนะด้วยวิธีที่เลือก

### 2nd Class
| Class | แนวทาง | เวทย์เด่น |
|-------|---------|----------|
| **Holy Tower** | Offense — โจมตีเน้น God Blast + Charge | God Blast, Master of Mana |
| **Life Tower** | Defense — ฟื้นฟู + ป้องกัน | Echo of Life, Enchantress Form |

### Core Accumulators — มี 3 แกนให้เลือก

Light Tower ไม่ใช่ tower ที่สะสมอย่างเดียว แต่มี **3 resource ต่างกัน** และ win condition ต่างกัน:

#### 1. `chargeStack` — Charge the Magic → Charge Release
- Charge the Magic สะสม stack (Lv1: 1/cast, Lv5: 2/cast, Lv12: 3/cast)
- **Charge Release – Light Shot**: `105–175% ATK × chargeStack` — consume ทั้งหมด
- **Charge Release – Heal**: `chargeStack × multiplier` HP (capped)
- **Master of Mana** (Holy Tower skill): chargeStack ครบ 16 → **ชนะทันที**
- Charge Conflagration (Enchantment): deal dmg ต่อทุก charge ที่เพิ่ม

#### 2. `enchantLevel` — เปิด Enchantment → Blast of Enchantment
- **Blast of Enchantment**: `[spellLv mult × enchantLevel total]% ATK` (capped 350%)
  - Lv1: 4.5 × totalLevel, Lv13: 10.5 × totalLevel
  - เปิด Enchantment level รวม ≥ 37 → Max 350% ได้แม้ใช้ Blast Lv1
- Enchantment ที่ใช้สะสม: Glowing Light (SP 0), Aura of Revealing, Aura of Faith, Divine Armor, Mana Vault, Light Sphere ฯลฯ

#### 3. `currentSP` — สะสม SP → Mana Explosion
- **Mana Explosion**: `104–168% of currentSP` — ใช้ SP ทั้งหมด, ทะลุ DEF
- เป็นเวทย์เดียวของ Light Tower ที่ทะลุ Defense of Dragon และ Aquatic Illusion
- Mana Vault (Enchantment) ช่วย: รับ dmg → ได้ SP คืน 10–22%

### Win Conditions (3 แบบ)

| # | วิธีชนะ | แกนหลัก | Turn structure |
|---|---------|---------|----------------|
| 1 | **Blast of Enchantment** | enchantLevel + DEF→ATK | เปิด Enchant Turn 1–8, DtA Turn 9, Blast Turn 10 |
| 2 | **Test of Faith** | HP > enemy Turn 10 | Heal/Buff Turn 1–9, ToF Turn 10 |
| 3 | **Master of Mana** | chargeStack ≥ 16 | Charge Turn 1–5 (Lv12 gives 3/cast) → ชนะ |
| bonus | **Mana Explosion** | currentSP | SP build + dump |

### Key Mechanics

**Defense to Attack / Attack to Defense** — stat swap  
- `DtA`: ลด DEF X% → เพิ่ม ATK Y% (ใช้ก่อน Blast/Mana Explosion)  
- `AtD`: ลด ATK X% → เพิ่ม DEF Y% (ใช้ก่อน Divine Shield)  
- ทำให้ DEF สูงของ Light กลายเป็น ATK สูงได้ชั่วคราว

**New Balance** — swap ATK↔DEF ทั้ง 2 ฝ่าย  
- ลด ATK ศัตรูที่มี DEF น้อยได้มาก (เช่น Dark Tower ที่ใช้ ATK เยอะ)

**Remove Magic / Spell Copy** — utility สูงมาก  
- Remove Magic: สลาย buff ศัตรูทั้งหมดที่ถอดได้ในครั้งเดียว + deal dmg ต่อ buff  
- Spell Copy: copy buff ศัตรูทั้งหมดที่คัดลอกได้ในครั้งเดียว

**Ward of Life** — trigger เมื่อ HP < 25%, heal % of maxHP, auto-recast เมื่อป้องกัน  
เหมือน "Turn ที่ 11" — ฟื้นฟูโดยไม่เสีย Turn

**Unsummon** — สลาย Demon/Golem/Aquatic Illusion ของศัตรู (SP 0)

### Spell List

#### Common Spells (Shop)
| Spell | สูตร | SP | หมายเหตุ |
|-------|------|----|---------|
| Holy Shot | 110%→250% ATK | 12→40 | basic shot, ไม่มีเงื่อนไข |
| Heal | (25+playerLv)→(95+playerLv) HP | 14→70 | ฟื้นฟู HP flat + level |
| Recovery | 30→170 SP | 0 | ฟื้นฟู SP, SP cost 0 ทุก Lv |
| Seal of Blessing | 7→105 SP + 8→120 dmg | 0 | ฟื้นฟู SP พร้อมโจมตี |
| Charge the Magic | 1→3 stack/cast | 2→24 | Lv1: 1, Lv5: 2, Lv12: 3 stack |
| Charge Release – Heal | chargeStack × 10→150 HP (capped) | — | heal ตาม stack |
| Charge Release – Light Shot | 105%→175% ATK × chargeStack | 10→150 | attack ตาม stack |
| God Blast | 135%→275% ATK, 50% crit 1.5× | 12→40 | Holy Tower เท่านั้น |
| Holy Shining | 115%→325% ATK | 12→40 | ใช้ได้เฉพาะกลางวัน |
| Flash | ลด ATK ศัตรู 2%→30% | 15→85 | ประชิด, ใช้ได้ครั้งเดียว/battle |
| Cure | สลาย debuff Lv ≤ spell Lv | 5 (ทุก Lv) | cleanse |
| Peaceful Moment | ลด dmg ทั้ง 2 ฝ่าย 7→105 flat | 30→142 | ป้องกันเบื้องต้น |

#### Common Enchantments (Shop)
| Spell | Effect | Maintenance |
|-------|--------|-------------|
| Aura of Faith | +Max HP 20→140 flat | Credit + SP 25→85/day |
| Aura of Revealing | กลางวันตอนป้องกัน, มองเห็น Cloak | Credit + SP 140→20/day (ลดตาม Lv) |
| Divine Armor | ลด dmg 1%→13% ของ dmg turn ที่แล้ว | Credit + SP 25→85 |
| Glowing Light | ไม่มีความสามารถ (ใช้สะสม enchantLevel เท่านั้น) | Credit เท่านั้น (SP 0) |
| Mana Vault | ได้ SP 10%→22% ของ dmg ที่รับ | Credit + SP 14→62 |
| Siege (Light) | เข้าประชิด Turn 6→1, +DEF 3→39 | Credit + SP 95→35 |

#### Uncommon Spells (Drop)
| Spell | สูตร | SP | หมายเหตุ |
|-------|------|----|---------|
| Heavenly Blessing | +ATK/DEF 9%→23%, +HP/SP 7.9%→20.5% | 18→130 | ใช้ซ้ำสะสมได้ |
| Blast of Enchantment | [4.5→11.5 × enchantLevel]% ATK (cap 350%) | 25→95 | main nuke |
| Defense to Attack | ลด DEF 8%→100% → เพิ่ม ATK 39%→95% ของที่ลด | 33→75 | stat convert |
| Attack to Defense | ลด ATK 8%→100% → เพิ่ม DEF 55%→100% ของที่ลด | 33→69 | stat convert |
| Mana Explosion | 104%→168% ของ currentSP (ทะลุ DEF) | ใช้ SP ทั้งหมด | only true DEF-pierce |
| Echo of Life | heal ตาม ATK, โอกาส cast ซ้ำ 13%→55% | 28→70 | ฟื้นฟูสูงสุด ถ้า ATK สูง |
| Healing Enhance | +15%→225% ประสิทธิภาพ Heal/Echo/Vital | 14→70 | multiplier heal |
| Light Focus | +12.5%→47.5% dmg โจมตีทุกเวทย์ | 15 (ทุก Lv) | dmg amplifier |
| Magic Barrier | ลด dmg จากเวทย์โจมตีโดยตรง 12.5%→47.5% | 15 (ทุก Lv) | magic shield |
| Physical Barrier | ลด dmg จาก Wyvern/Golem 12.5%→47.5% | 14→70 | physical shield |
| Reflect | สะท้อน dmg โจมตีโดยตรง 32%→60% | 24→80 | 2 turn, ทำงานครั้งเดียว |
| New Balance | สลับ ATK↔DEF ทั้ง 2 ฝ่าย 62%→90% success | 43→85 | counter ATK-heavy |
| Remove Magic | สลาย buff ศัตรู ≤ Lv + 20→300 dmg/buff | 5 (ทุก Lv) | dispel |
| Spell Copy | copy buff ศัตรู ≤ Lv | 8→120 | copy |
| Unsummon | สลาย Demon/Golem 35%→99% success + heal | 0 (ทุก Lv) | anti-summon |
| Holy Sacrifice | ลด ATK/DEF/HP/SP 12.5%→33.5%, ลด dmg รับ 10%→24% | 34→90 | ใช้ครั้งเดียว/battle |
| Force of Archangel | 110%→250% ATK, +1%×Slayer rank max HP | 23→66 | Slayer bonus |
| Modified Holy Shot | 110%→250% ATK, ลด ATK ศัตรู 20%×playerLv | 18→60 | ATK debuff |

#### Uncommon Enchantments (Drop)
| Spell | Effect | Maintenance |
|-------|--------|-------------|
| Aura of Exorcist | +ATK 3→39 (4→52 vs Dark Tower) | Credit + SP 35→95 |
| Charge Conflagration | deal dmg 5%→65% playerLv ต่อทุก charge ที่เพิ่ม | Credit + SP 6→78 |
| Light Sphere | ตอนป้องกัน: 19%→67% โอกาส 30% ATK dmg + ลด ATK ศัตรู | Credit + SP 80 (ทุก Lv) |
| Melody of Life | เมื่อ Heal/Echo → +Max HP 11%→23% ของที่ฟื้นฟูได้ | Credit + SP 55→115 |
| Ward of Life | trigger HP < 25%: heal 4%→52% maxHP, auto-recast | Credit + SP 5→65 |

#### Rare Spells (Drop)
| Spell | สูตร | SP | หมายเหตุ |
|-------|------|----|---------|
| Holy Guard | block dmg 1 ครั้ง, +HP 5%→75% ของที่ block | 50 (ทุก Lv) | ใช้ครั้งเดียว/battle |
| Divine Shield | สร้างเกราะ 220%→500% ของ DEF ที่เสีย (+25% vs Dark) | 44→102 | convert DEF→shield |
| Vital Benediction | heal 17%→45% ของ maxHP | — | ใช้ครั้งเดียว/battle |
| Test of Faith | Turn 10 เท่านั้น: ลด HP ตัวเอง 46.5%→(-2.5%), ถ้า HP > ศัตรู → ชนะ | 45→115 | win condition |
| Chorus Sanctuary | heal HP/SP % ตาม maxHP/maxSP ทุก turn | 30→70 | sustained recovery |

#### Hex (Uncommon/Guild Only)
| Spell | Effect | หมายเหตุ |
|-------|--------|---------|
| Life and Peace | +ATK/DEF 3→33, +MaxHP 2.5%→27.5% ให้ศัตรู | Guild War only, Lv35+ |

#### Ultimate Spells (Boss Drop)
| Spell | Effect | ได้จาก |
|-------|--------|-------|
| Shield of Mass Reflection | สะท้อน 85%, ทำงานได้ 2 Turn | Volom, The Elder Ents (Lv27-40) |
| Divine Judgment | 150-250% ATK (200-350% vs Dark), ลด ATK ศัตรู 25% | Immanuela, Avatar of Dawn Bringer (Lv40-60) |
| Shield of Absorption | เกราะ = ศัตรู Lv × 15, ยกเลิกถ้าโจมตีระหว่างมีผล | Magus Magious De Evangelize (Lv60-99) |
| Angel Form (Holy Lord) | กลางวันตลอด, +God Blast dmg, Dark/Light protection 20% | Alica, The Archangel |
| Enchantress Form (Life Lord) | +200 maxSP, +50 SP/turn, Heal → ลด HP ศัตรู 25% ทะลุทุกป้องกัน, 50% ลด dmg 20% | Jessica d.Frey, The Enchantress |

### Light Tower Combos

| Combo | Spells | Strategy |
|-------|--------|----------|
| **Enchant Nuke** | Glowing Light + Aura of Revealing + (Enchants) + DtA + Blast | เปิด Enchant รวมLevel ≥ 37 → Blast = 350% ATK |
| **Holy Burst** | Chorus Sanctuary + Heavenly Blessing ×N + DtA + Blast | buff ก่อน, DtA Turn 9, Blast Turn 10 |
| **SP Nuke** | Heavenly Blessing + Mana Vault + Recovery + Mana Explosion | สะสม SP ให้มาก, dump turn ท้าย |
| **HP Win** | Healing Enhance + Echo of Life + Vital Benediction + Test of Faith | ฟื้นฟู HP ให้มากกว่าศัตรู, ToF Turn 10 |
| **Charge Win** | Charge the Magic Lv12 ×5 turns = 15 charges → Charge Release | Holy Tower: 16 charges = Master of Mana win |
| **Defense Convert** | AtD + Heavenly Blessing + Divine Shield | ย้าย ATK → DEF → เกราะขนาดใหญ่ |

### Counter Knowledge (จากต้นแบบ)

| ศัตรูใช้ | Light ตอบโต้ด้วย |
|---------|----------------|
| Anger Spirit (Dark) | Shield of Absorption / Divine Shield (ทะลุ Reflect/Holy Guard/Magic Barrier) |
| Dark Rift (Dark) | Shield of Absorption / Holy Guard / Divine Shield |
| Armor Breaker (Dark) | ใช้ DtA ย้าย DEF → ATK ก่อนถูก break |
| Defense of Dragon (Fire) | Mana Explosion เท่านั้นที่ทะลุได้ |
| Unstoppable (Fire) | Shield of Absorption / Divine Shield |
| Flame Shield (Fire) | Spell Copy หรือ Remove Magic |
| Mind Freeze (Ice) | ทำ dmg ให้ Ice หมด SP ก่อน |
| Aquatic Illusion (Ice) | Unsummon / Mana Explosion (ทะลุ) |
| Wyvern (Fire) | Physical Barrier เท่านั้นที่ลด Wyvern dmg ได้ |

---

---

## 🌑 Dark Tower

### Identity
**"โจมตีรวดเร็ว, จบใน 3–4 turn, ดูด HP/SP ศัตรู"**  
HP น้อย แต่มีเครื่องมือ drain ทุกทาง  
ต่างจากทุก Tower ตรงที่ **ไม่สะสมแบบ linear** แต่เลือก timing และ burst

### 2nd Class
| Class | แนวทาง | เวทย์เด่น |
|-------|---------|----------|
| **Death Tower** | Pure burst — ยิงแรงทะลุทุกการป้องกัน | Night Raid, Anger Spirit, Armor Breaker |
| **Blood Tower** | Drain — ดูดเลือด, ใช้ Vampiric + Demon | Vampiric, Summon Demon, Life Syphon |

### Core Mechanics (ไม่มี single accumulator แต่มี 3 resource)

#### 1. `nightTiming` — กลางคืน (18:00–06:00)
- **Night Raid** ใช้ได้เฉพาะกลางคืน (แรงกว่า Dark Shot ~4% ต่อ level)
- **Night Ritual** ฟื้น SP ใช้ได้เฉพาะกลางคืน
- **Vampiric** ดูด HP ใช้ได้เฉพาะกลางคืน
- **Shadow Ambush** โอกาสยิงก่อนใช้ได้กลางคืน
- แก้ไขด้วย: **Dark Cloud** (ร่ายใน battle → เปลี่ยนเป็นกลางคืน) หรือ **Dark Cloud Hex** (ป้องกัน → กลางคืนเสมอ)
- Death Tower skill **Night of Horror** (Lv90): ใช้เวทกลางคืนได้กลางวัน

#### 2. `darkComboCounter` — Dark Combo chain
- ร่าย **Dark Combo** ติดกันไม่สลับเวทย์อื่น → แรงขึ้น +4→+40 ต่อ Lv ต่อครั้ง
- ช่วง Lv1–30 คือเวทย์หลัก ช่วงหลังเลิกใช้
- เหมาะกับ early game / เก็บ boss / map ต้นๆ

#### 3. `enemyState` — ลดทอนศัตรู
- **Armor Impaction**: dmg = % of enemy DEF → ยิ่งศัตรูมี DEF สูง ยิ่งโดนมาก
- **Death Scythe**: deal dmg + ลด Max HP ศัตรู 50% ของ dmg → ศัตรูฮีลได้น้อยลง
- **Healing Trap**: เวทย์ Heal ศัตรูกลายเป็นลด HP แทน → counter Light Tower heal
- **Reverse Soul**: สลับ HP↔SP ศัตรู → ถ้าศัตรู SP > HP จะตายทันที (เหมาะ vs Ice)

### Win Conditions

| วิธี | Flow | เหมาะกับ |
|------|------|---------|
| **Night Burst** | Dark Cloud → Night Raid ×7 turns | Death Tower |
| **True Damage** | Anger Spirit (ทะลุทุกอย่าง) | vs Light ที่ป้องกันเยอะ |
| **DEF Exploit** | Armor Impaction | vs Light ที่ DEF สูง |
| **HP Drain** | Vampiric + Demon + Night Raid | Blood Tower |
| **Doppelgänger** | รับ burst ด้วยร่างแยก → ร่างจริงมาปิดเกม | ป้องกัน 1 hit kill |
| **Reverse Soul** | สลับ HP↔SP เมื่อ HP เรามากกว่า SP ศัตรู | vs Ice (SP สูง) ห้ามใช้! |

### Spell List

#### Shop Spells (Common)
| Spell | สูตร | SP | หมายเหตุ | ★ |
|-------|------|----|---------|---|
| Dark Shot (DS) | 110%→200% ATK | 12→30 | basic, ไม่มีเงื่อนไข | 5 |
| Night Raid (NR) | 114%→240% ATK | 12→30 | กลางคืนเท่านั้น, main DPS ช่วงหลัง | 5 |
| Dark Combo (DC) | 100% + stack bonus | 20→65 | ยิงติดต่อกัน → +4→+40/Lv ต่อครั้ง | 5(ต้น) / 3(หลัง) |
| Berserk | ลด DEF ตัวเอง, +ATK | 14→50 | ไม่คุ้ม เสีย turn | 2 |
| Decrease Attack | ลด ATK ศัตรู 10→30 flat / Hex | 15 | นิยมใช้นอก battle | 3 |
| Decrease Defense | ลด DEF ศัตรู 10→30 flat / Hex | 15 | นิยมใช้นอก battle | 3 |
| Fog | กลางคืน (ฝั่งป้องกัน), SP 20%→0% | 20%→0% | Death Tower มีทักษะ auto-fog แล้ว | 1 |
| Night Ritual | ฟื้น SP 27→90 | 0 | กลางคืนเท่านั้น | 3 |
| Seal of Pain | เวทถัดไป: heal 26%→80% ของ dmg | 0 | ไม่ค่อยมีคนใช้ | 2 |
| SP Leech | ดูด SP 11.5%→25% ของ SP ศัตรู | 25→70 | ใช้กับ Ice ดีกว่า | 2 |
| Siege | Enchantment: เข้าประชิด Turn6→1 | Enchant | มี Shadow Strike ดีกว่า | 1 |

#### Non-Shop Spells (Drop/Exchange)
| Spell | สูตร | SP | หมายเหตุ | ★ |
|-------|------|----|---------|---|
| Anger Spirit (AS) | 85%→130% ATK | 18→45 | ทะลุ DEF + ทะลุทุกการป้องกัน (Holy Guard, Magic Barrier) | 5 |
| Armor Impaction (AI) | 320%→500% ของ enemy DEF | 19→55 | เหมาะ vs Light (DEF สูง), penalty vs +10 Lv | 4 |
| Dark Cloud | ใน battle: เปลี่ยนเป็นกลางคืน (SP 90→0) / Hex: กลางคืนตอนป้องกัน | — | จำเป็นสำหรับ Night build | 4 |
| Unholy Force | Enchantment: +ATK 5→50 flat | Credit + SP 30→75 | ATK หลักของ Dark | 4 |
| Dark Rift (DR) | 220%→400% ATK ทั้ง 2 ฝ่าย | 35→80 | ถ้าศัตรูตาย แต่เราไม่ตาย = ชนะ (ฝ่ายป้องกันชนะถ้าตายพร้อมกัน) | 4 |
| Death Scythe | 110%→200% ATK + ลด Max HP ศัตรู 50% ของ dmg | 33→60 | counter heal build | 3 |
| Healing Trap (HT) | เมื่อศัตรู Heal → กลายเป็นลด HP (120%→300% ของที่ heal) | 15 | counter Light heal | 3 |
| HP Leech | ดูด HP 7%→25% ของ HP ศัตรู | 40→85 | ดีแต่มักใช้ LS แทน | 3 |
| Double Shot (DB) | 23%→49% โอกาส dmg ×2 ตลอดเกม | 10→100 | ลุ้นดวง, ใช้ตอนเก็บ boss | 3 |
| Echo of Soul | 70% ATK ทะลุ DEF, cast ซ้ำ 12%→30% | 28→55 | เหมือน Echo of Flame แต่ dmg version | 3 |
| Force of Archdemon | DS + 5%×Slayer + 1%×Slayer MaxHP (ทะลุ DEF) | 23→50 | scale ตาม Slayer rank | — |
| Reverse Curse | ย้าย debuff จากเราไปหาศัตรู / Hex cleanse | 24→60 | cleanse Poison Dart | 3 |
| Demon Realm | Enchantment: +Summon Demon dmg 10%→100% | Credit + SP 40→130 | กิน SP มาก แต่ Demon โหด | 4 |
| Cloak of Shadow | Enchantment: ซ่อนหอ ไม่ถูกโจมตีจาก Fire/Dark/Ice | Credit + SP 350 | หอแสงมองเห็นได้ | 2.5 |
| Vampiric | heal 1.5%→15% ของ dmg ทำได้ (กลางคืน) | 10→100 | 1★ สาย Death / 5★ สาย Blood | — |

#### Rare Spells
| Spell | สูตร | SP | หมายเหตุ | ★ |
|-------|------|----|---------|---|
| Doppelgänger (Dopp) | แยกร่าง: ลด MaxHP 5%→23%, HP ร่างแยก = ครึ่ง | 50%→23% SP | ใช้รับ burst แล้วกลับมา HP เต็ม | 4 |
| Reverse Soul (RS) | สลับ HP↔SP ศัตรู (62%→80% success) | 43→70 | อย่าใช้กับ Ice (SP > HP) | 4 |
| Soul Offering (SO) | -20% MaxHP, +HP 13%→40%, ATK ×1.4→×2.0 ต่อ 2 turn → ถ้าไม่ชนะใน 2 turn = แพ้ | 70→115 | หลอม Lv5 พอ (ATK gap น้อย) | 3 |
| Last Chance (LC) | dmg 64%→100% ของ HP ที่เสีย, หลังใช้ HP+SP=1, ทะลุ reflect | 60→150 | หัก MaxHP 20% ก่อน, จริงๆ max = 80% MaxHP | 4 |
| Magic Trick (MT) | เพิ่ม level เวทย์ถัดไป +1→+3 | 130→40 | ใช้กับ NR → NR Lv16 | 3 |
| Poison Dart (PD) | 63%→90% success: ศัตรูเสีย HP 8%→26% ทุก turn | 15 | counter heal, Lv สูงพอที่ Cure ถอดไม่ได้ | 3 |
| Summon Demon (SD) | vs Light เท่านั้น (ยกเว้นมี Demon Realm): dmg ตาม Lv × %, dmg → HP เรา | 70→160 | เหมาะ Lv50+ | 4 |
| Shadow Ambush | Enchantment: 17%→37% โอกาสยิงก่อน (กลางคืน) | HP+SP 47%→20% ของ max | ลุ้นดวง | 3 |

#### Guild/Hex
| Spell | Effect | หมายเหตุ |
|-------|--------|---------|
| Death and Decay | Guild Hex: ลด DEF 5→50 + ลด MaxHP 2.5%→25% | Guild War Lv35+ |

#### Ultimate Spells (Boss Drop)
| Spell | Effect | Boss/Map |
|-------|--------|---------|
| Armor Breaker (อัลติ1) | ทำลายเกราะทั้งหมด + deal dmg | Lv21-23 map |
| Life Syphon (LS) (อัลติ2) | ดูด HP + SP จากศัตรูจำนวนมาก | Lv27-28 map |
| อัลติ3 | (เก็บง่ายที่สุด, ใช้ SO/NR ปิดเกม) | Lv map ถัดไป |
| Demon Form | Ultimate Enchantment: สถานะ Demon 20 นาที | Boss Lv สูง |
| Call of the Infernal | — | Shadow Ambush route |

### Dark Tower Combos (Spell Sets)

| ชื่อ combo | Spells | จุดเด่น |
|-----------|--------|---------|
| **Night Burst** | Dark Cloud → NR ×8 turns | เวทหลักระดับ Lv80+ |
| **Anti-Light** | Armor Impaction + Anger Spirit | ทะลุ DEF สูง + ป้องกันทุกอย่าง |
| **Doppelgänger Escape** | Dopp → (รอรับ burst) → NR/LC | รับ Mana Explosion หรือ charge finisher |
| **Corruption** | PD + HT + DS ×N | counter heal, ลด MaxHP ศัตรู |
| **Soul Gamble** | SO + NR×2 | ชนะใน 2 turn หรือแพ้ |
| **Blood Drain** | Vampiric + Demon Realm + SD | Blood Tower: drain battle |
| **Reverse Kill** | RS + NR | ถ้า SP ศัตรู > HP เดิม → ตายทันที |

### Tips & Counters

| ศัตรูใช้ | Dark ตอบโต้ด้วย |
|---------|----------------|
| Mana Explosion (Light) | Dopp รับ, RS ก่อนถ้าเป็น SP build |
| Charge Release (Light) | Remove Charge (แต่ขยะ), หรือรีบปิดเกมก่อน Turn 5 |
| Shield of Mass Reflection | Anger Spirit (ทะลุ) |
| Holy Guard | Anger Spirit / Dark Rift |
| Shield of Absorption | Dark Rift เท่านั้น |
| Heal สาย Life Tower | Healing Trap Turn7+ |
| Test of Faith Turn10 | ต้องปิดเกมก่อน Turn10 |
| Defense of Dragon (Fire) | Dark Rift (ทะลุ DEF) |
| Wyvern | Dark Rift หรือรีบปิดเกม |

---

---

## Cross-Tower Interactions *(placeholder)*

> จะ fill in เมื่อมีข้อมูลครบทุก tower

| โจมตี ↓ / ป้องกัน → | Fire | Ice | Light | Dark |
|---------------------|------|-----|-------|------|
| Fire | — | ได้เปรียบ | — | — |
| Ice | เสียเปรียบ | — | — | — |
| Light | — | — | — | — |
| Dark | — | — | — | — |

---

## Notes / รอ Confirm

- [ ] Ice Tower spell list จากต้นแบบ
- [ ] Light Tower spell list จากต้นแบบ
- [ ] Dark Tower spell list จากต้นแบบ
- [ ] Tower advantage/disadvantage system
- [ ] Wyvern tier list (Sky / Fury / Two-Headed / Everant)
- [ ] Enchantment maintenance system (Credit + SP)
- [ ] Spell level system (Lv1→Lv17)
- [ ] Wall / proximity mechanic (Siege)
