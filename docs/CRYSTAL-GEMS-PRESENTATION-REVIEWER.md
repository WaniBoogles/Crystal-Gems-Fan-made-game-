# 💎 Crystal Gems! — Game Reviewer & Presentation Guide

> **Purpose of this file:** A complete, easy-to-read reviewer covering **what the game is**, **how it was made**, **its inspirations**, **core mechanics**, and **ready-to-answer Q&A prompts** for a live presentation or defense.

---

## 🎤 1. The 30-Second Elevator Pitch (Start the Presentation With This)

> *"Crystal Gems! is a fan-made 2D side-scrolling action beat-'em-up and RPG set in the Steven Universe universe. What makes it unique technically is that it was built **completely from scratch without a commercial game engine** like Unity or Godot. Using over **34,600 lines** of pure HTML5 Canvas, CSS3, and JavaScript, every single character animation, boss, visual effect, and even the music and sound effects are procedurally drawn and synthesized in real time through code. The entire game compiles into a single self-contained 4.58 MB file and a standalone Windows `.exe` executable that runs 100% offline at 60 FPS."*

---

## 📊 2. Quick Facts at a Glance (Memorize These Numbers)

| Category | Details |
| :--- | :--- |
| **Title** | *Crystal Gems! — Crystal Guardians Unleashed* |
| **Genre** | 2D Side-Scrolling Beat 'Em Up / Action RPG / Co-Op Brawler |
| **Development Time** | ~32+ active hands-on build hours across 20+ iterative engineering sessions |
| **Tech Stack** | Vanilla HTML5 Canvas 2D, CSS3, ES6 JavaScript, Web Audio API, Python (Bundler), C#/.NET (Windows `.exe`), GTK3/WebKit2 (Linux Launcher) |
| **External Game Engine Used?** | **None** (Zero Unity, Zero Unreal, Zero Phaser/PixiJS — 100% custom engine) |
| **Total Lines of Code** | **34,697 lines** in `src/` (`28,596` JS + `4,875` CSS + `1,226` HTML) — **35,403 lines** total with build & launcher tools |
| **Playable Roster** | **10 Playable Heroes** + **9 Playable Canon Fusions** (19 distinct move kits) |
| **Campaign & Enemies** | **10 Story Episodes** (Seasons 1–5 arc), **8 Interactive RNG Lore Puzzles**, **13 Corrupted Gem Minion Types**, **14 Boss Variants** |
| **Build Output** | Single-file `Crystal-Gems.html` (**4.58 MB**) & standalone `Crystal Gems.exe` (**4.7 MB** Windows executable) |

---

## 🛠️ 3. How the Game Is Made (Technical Architecture)

When explaining *how* the game was built, break it down into these **4 simple pillars**:

### Pillar A: Custom 2D Game Engine in Pure JavaScript (`src/game.js` — 28,596 lines)
Instead of relying on a pre-made engine, the game uses a custom **delta-time (`dt`) game loop** driven by `requestAnimationFrame`.
* **Physics & Collision System:** Handles gravity, velocity, double-jumping, ground/platform collision, knockback resistance, and hitbox/hurtbox intersection checks.
* **Smart Camera System:** Smoothly tracks the midpoint between Player 1 and Player 2 across a **2,600-pixel-wide scrolling arena**, with dynamic combat zoom and screen-shake on heavy impacts.
* **Graphics & FPS Controller:** Supports **Low, Medium, and High** graphics presets and selectable frame-rate caps (**30 / 60 / 120 FPS**) by dynamically scaling particle density, shadows, and render intervals.

### Pillar B: 100% Procedural Vector & Cel-Shaded Art (No Sprite Sheets!)
Most 2D games load hundreds of PNG sprite sheets. *Crystal Gems!* draws its characters, fusions, corrupted monsters, and bosses **mathematically using HTML5 Canvas 2D vector paths** (`ctx.beginPath()`, `arc()`, `bezierCurveTo()`, linear/radial gradients).
* **Why do it this way?**
  1. **Resolution Independence:** Graphics stay razor-sharp whether scaled to 1280×720, 1080p, or 4K fullscreen.
  2. **Dynamic Animation:** Hair, capes, water wings, weapons, and hit flashes react smoothly to velocity, breathing cycles, and transformations (such as Connie turning into **Pink Connie** upon revival).
  3. **Tiny File Size:** All 19 playable characters/fusions and 27 enemy/boss rigs fit in pure code.

### Pillar C: Algorithmic Web Audio Synthesizer (`GemAudioEngine`)
Instead of bundling heavy `.mp3` or `.wav` soundtrack files, the game includes a custom **Web Audio API synthesizer**.
* **Procedural Music:** 13 stage, boss, and menu musical themes are programmed as real-time oscillator note sequences (melody, bassline, and harmonic pads in Hz) that automatically switch based on the current Episode or Boss fight.
* **Throttled Combat SFX:** 40+ sound effects (shield blocks, whip cracks, laser beams, gem poofs) are generated with waveform oscillators and per-sound cooldown gates (`_lastSfxTime`) so continuous rapid-hit attacks never clip, stutter, or overwhelm the speakers.

### Pillar D: Single-File Bundler (`tools/build.py`) & Native Windows `.exe` (`CrystalGemsLauncher.cs`)
* **The Python Bundler (`tools/build.py`):** Compiles `src/game.html`, `src/game.css`, `src/game.js`, and base64-encodes the background artwork into one self-contained **`Crystal-Gems.html` (4.58 MB)** with zero external asset dependencies.
* **The Windows Executable (`Crystal Gems.exe`):** Written in C# and compiled with Mono/.NET (`mcs -target:winexe`). It embeds the entire `Crystal-Gems.html` payload inside the `.exe` binary. When double-clicked on Windows:
  1. It spins up a lightweight **local loopback HTTP server** (`http://127.0.0.1:<port>/`) in memory so Web Audio and Canvas features run with zero browser CORS restrictions and 100% offline.
  2. It automatically detects **Microsoft Edge, Google Chrome, or Brave** and launches the game in a clean, borderless native-app window (`--app` mode) with High-DPI support.
  3. When the player closes the window, the background server shuts down automatically.

---

## 🌟 4. Inspirations & Game Design DNA

Every major system in *Crystal Gems!* was inspired by classic games and faithful *Steven Universe* lore:

### 1. *Steven Universe* (Rebecca Sugar / Cartoon Network) — Lore, Characters & "Gem Science"
* **Story Progression:** The 10 episodes follow the actual series chronology from Season 1 (*Beach City Boardwalk*, *Galaxy Warp*, *Prime Kindergarten*) through Season 5 (*The Cluster*, *Bismuth's Forge*, *Pink Diamond's Zoo*, *Homeworld Trial*, and *Change Your Mind* against White Diamond).
* **RPG Stats Based on Lore ("Gem Magic" = Extraterrestrial Gem Science):**
  Every character and fusion has 6 distinct RPG stats: **HP, Attack, Magic, Defense, Critical Chance, and Critical Damage**.
  * In *Steven Universe*, "Magic" is framed as **hard-light projection, ferrokinesis, hydrokinesis, and organic hybrid healing**.
  * Characters like **Peridot** (`HP: 160, DEF: 52, MAG: 44`) and **Bismuth** (`HP: 185, DEF: 60, ATK: 52`) act as high-defense tanks, while **Lapis Lazuli** (`MAG: 62`) and **Pearl** (`CRIT: 22%`) excel at ranged light/hydro-magic and precision crits.
* **Pink Resurrection Lore (2-Player Arcade Revival):**
  In 2-Player Arcade Mode, when a teammate falls, their gemstone floats upward for an **18-second revival countdown**, entering a **3-second hard-light reformation beam** before respawning at `0s`. Because **Connie** is human, reviving her channels Steven's healing resurrection (just like **Lars** and **Lion** in the show), permanently transforming her into **Pink Connie** with cotton-candy pink hair, a rose aura, and a lore stat boost!

### 2. Classic 2D Arcade Beat 'Em Ups (*Castle Crashers*, *Scott Pilgrim vs. The World*, *Streets of Rage*)
* Inspired the side-scrolling 2,600 px brawler stage, 1P/2P local co-op teamwork, ground-and-air combo juggling, destructible stage pillars, bounce pads, and Homeworld destabilizer hazards.
* **Terrifying Boss Fights:** Bosses tower over corrupted gem minions (`1.72×+` visual scale, `1.5×` HP pool, crimson/purple threat aura) and shift into an unpredictable **Phase 2** below 55% HP with 4 rotating attack patterns (Barrage Volleys, Meteor Pounce + Shockwaves, Shadow-Blink Ambushes, and Homing Corruption Orbs).

### 3. *Tekken* & Arcade Fighting Games
* Inspired the **3-hit cadence combo chains**, directional knockbacks, **Perfect Parry / Guard Shield (`S` / `↓`)**, **Dodge Dash invulnerability frames (`I` / `E`)**, and the dedicated **Practice Dojo** where players can test combos and elemental damage against an infinite-HP Holo-Jasper dummy.

### 4. *Marvel vs. Capcom* — Tag-Team Hyper Fusions & Anime Cut-Ins
* When two players build their **Harmony Meter to 100%** and press `V`, they merge into one of **9 canonical Fusions** (*Stevonnie, Smoky Quartz, Rainbow Quartz 2.0, Sunstone, Sugilite, Sardonyx, Opal, Malachite, or Classic Rainbow Quartz*).
* Triggering **Pink Overdrive / Gem Surge** freezes the action for a dramatic **1.9-second anime portrait cut-in** with speed lines and light rays before granting 2× (or 2.5× Dual Fusion) damage.

### 5. *Pokémon* — 11-Type Elemental Matchup Engine
* Every hero's `[J]`, `[K]`, and `[L]` move carries one of **11 elemental types** (`FAIRY`, `FIGHT`, `PSYCHIC`, `STEEL`, `ELECTR`, `WATER`, `FIRE`, `DARK`, `DRAGON`, `FLYING`, `NORMAL`).
* Follows real type-chart multipliers: **2× Super Effective** (4× against dual-typed enemies), **0.5× Resisted**, **+20% STAB** (Same-Type Attack Bonus when a move matches the hero's own element), plus status riders like *Overload (stun)*, *Scorch (burn DoT)*, *Soak (slow)*, and *Armor Crack (+18% damage taken)*.

### 6. *Kingdom Hearts / Zelda* + Spinel Gem Hearts HUD
* Top-left **Spinel Heart Gems** represent player life, backed by each character's **HP + Defense buffer**.
* Instead of losing a whole heart from a single weak scratch, tanky Gems with high HP and Defense watch their Spinel Heart **slowly dim and drain** (`.hud-heart.draining`) before blacking out, and smoothly refill when healed by Steven/Rose or stage pickups.

### 7. *Stardew Valley*, *Plants vs. Zombies* & *Left 4 Dead 2*
* **Stardew Valley:** Character-accurate portrait dialogue boxes before waves and bosses (including villain portraits for corrupted bosses).
* **Plants vs. Zombies:** Clean top-center wave progress bar with simple unlit/lit crystal nodes and boss checkpoints.
* **Left 4 Dead 2:** Living background landscape slideshow on the frameless main menu.

---

## 🎮 5. Game Modes & Controls Summary

### Four Main Modes
1. **Story Mode (10 Episodes):** Narrative campaign with Stardew-style dialogue cutscenes, 8 randomized (RNG) lore logic puzzles with optional non-spoiling Hint toggles, 4 waves per episode, and a climax Boss fight.
2. **Arcade Mode (Map Select & Endless Rush):** Fast-paced wave survival with checkpoint banners every 3–4 waves and boss milestones, full 2-Player 18s floating-gem revival, and high-score tracking.
3. **Practice Dojo:** No-pressure training room with instant Overdrive/Fusion meters and a live combo damage analyzer.
4. **1-Player Solo & 2-Player Local Co-Op:** Play solo or share one keyboard (or connect gamepads via the HTML5 Gamepad API).

### Keyboard Controls Quick Table
| Action | 1-Player Mode | 2-Player: Player 1 | 2-Player: Player 2 |
| :--- | :--- | :--- | :--- |
| **Move Left / Right** | `A` / `D` | `A` / `D` | `←` / `→` |
| **Jump / Double Jump** | `W` or `Space` | `W` | `↑` |
| **Guard / Parry Shield** | `S` | `S` | `↓` |
| **Primary Combo** | `J` | `F` | `J` |
| **Special Attack** | `K` | `G` | `K` |
| **Signature Skill / Heal** | `L` | `H` | `L` |
| **Dodge Dash (i-frames)** | `I` | `E` | `I` |
| **Pink Overdrive (Gem Surge)** | `U` or `O` | `R` | `O` |
| **2P Canon Gem Fusion** | — | `V` | `V` |
| **Pause / Menu Hotkeys** | `Esc` (Pause/Menu), `R` (Restart while paused) | `Esc` / `R` | `Esc` / `R` |

---

## ❓ 6. Likely Q&A Questions & Ready-to-Use Answers

**Q1: "Why did you build this in HTML5 Canvas and JavaScript instead of Unity or Godot?"**
> **Answer:** *"Building it in vanilla HTML5 Canvas and JavaScript gave us 100% control over the rendering pipeline, physics, and audio synthesis with zero engine overhead. Because there are no heavy engine runtimes or external asset folders, the entire game compiles into a single 4.58 MB file and a 4.7 MB Windows `.exe` that boots instantly on any PC or browser offline."*

**Q2: "How do the graphics and music work without external sprite sheets or MP3 files?"**
> **Answer:** *"All characters, bosses, and visual effects are drawn procedurally at 60 FPS using HTML5 Canvas 2D vector geometry and gradients. For audio, we built `GemAudioEngine` on top of the Web Audio API, which synthesizes 13 background soundtracks and over 40 sound effects mathematically using sound oscillators and gain envelopes."*

**Q3: "How does the RPG stat system interact with the Spinel Hearts on the HUD?"**
> **Answer:** *"Every Gem and Fusion has lore-accurate stats for HP, Attack, Magic, Defense, Crit Chance, and Crit Damage. Physical attacks scale with Attack, while hard-light and elemental powers scale with Magic. On the HUD, each Spinel Heart acts as an HP buffer scaled by the character's HP and Defense — so a tank like Peridot or Bismuth loses heart life gradually (dimming the Spinel Gem before it turns black) and restores it when healed."*

**Q4: "How does the `.exe` file work on Windows?"**
> **Answer:** *"We wrote a native C# launcher (`CrystalGemsLauncher.cs`) compiled into a Windows `.exe`. It embeds the bundled game inside the executable, starts a private local loopback server on `127.0.0.1`, and opens Microsoft Edge or Chrome in borderless `--app` mode so it plays identically to a native desktop executable."*

**Q5: "How do you prevent players from memorizing the Story Mode puzzles?"**
> **Answer:** *"All 8 story puzzles use procedural RNG generation (`Math.random()`) on every run—randomizing corruption nodes, warp pad frequencies, Kindergarten injector depths, and trial symbols—while dynamically updating the on-screen visual cues and optional Hint box so every playthrough is fresh but fair."*

---

## 🎬 7. Suggested 3-Minute Live Demo Flow for Presentation Day

1. **0:00 – 0:30 | Launch & Intro Splash:** Double-click `Crystal Gems.exe` (or `Crystal-Gems.html`). Show the dark-grey *"Crystal Gems!"* fade-in intro splash, the living main menu background, and the Jukebox / Graphics settings (`Low / Medium / High` + FPS cap).
2. **0:30 – 1:15 | Character Select & Lore RPG Stats:** Click **Story Mode** or **Arcade Mode** → show the 10 Guardians and point out the **6 RPG Stat pills** (`HP, ATK, MAG, DEF, CRIT%, CDMG`) on the right preview pane (compare tanky **Peridot/Bismuth** vs magic-heavy **Lapis**).
3. **1:15 – 2:00 | Combat, Elemental Types & Spinel Heart Drain:** Enter Stage 1. Show normal combos, elemental `"SUPER EFFECTIVE!"` popups, and how taking a hit gradually dims the top-left **Spinel Heart** before healing restores it.
4. **2:00 – 2:30 | Story Puzzle or Boss Fight & Pink Overdrive:** Trigger **Pink Overdrive (`U`/`O`)** to show the anime portrait cut-in, or show a towering **Boss Fight** with its threat aura and unpredictable multi-projectile attacks.
5. **2:30 – 3:00 | 2-Player Co-Op Fusion & Revival:** Mention (or briefly show in 2P mode) **Canon Fusion (`V`)** into Stevonnie/Opal/Obsidian-tier fusions and the **18-second floating Gem revival** (and **Pink Connie** easter egg).
