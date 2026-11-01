# 💎 Crystal Gems! — Action Battler

> *"We are the Crystal Gems, we'll always save the day!"*

A fan-made 2D arcade action brawler set in **Steven Universe** (Rebecca Sugar / Cartoon Network).
Built from scratch in **vanilla HTML5 Canvas + CSS + Web Audio** — no game engine, no framework,
no external image files in the game code: every hero, corruption, boss and effect is drawn with
Canvas paths.

* **22,128 lines** of hand-written game code (`src/`)
* **10 playable guardians**, **9 canonical fusions**, **10 episodes**, **10 bosses**
* **11 gem types** with a real Pokémon-style matchup engine
* **Scripted story mode** — 50 dialogue beats, one per wave and boss, following the show's arc
* **Super-move portrait cut-ins** with hitstop for Overdrive and every fusion
* **5 difficulty tiers** — from a story-mode stroll to *DIAMOND*
* **Zero dependencies** — the whole game is one 2.2 MB HTML file

---

## ▶ Play it

### 🐧 Linux Mint / Ubuntu / Debian (recommended)

```bash
./crystal-gems.sh
```

A native GTK3 + WebKit2 window opens fullscreen at 60 fps. `./crystal-gems.sh --check` prints
which backend will be used. `./crystal-gems.sh --windowed` runs it in a 1280×800 window.

You can also double-click **`Crystal Gems!.desktop`** (already executable and marked trusted by
Nemo/Cinnamon), or just open **`Crystal-Gems.html`** in any browser.

### 🪟 Windows
Double-click **`build/Crystal Gems.exe`** — a launcher that embeds the game and opens it in a
clean Edge/Chrome app window. Or open `Crystal-Gems.html` directly.

### 🍎 macOS / anything else
Open **`Crystal-Gems.html`** in Chrome, Edge, Firefox, Safari or Brave. 100 % offline after load
(fonts fall back to system faces when offline).

The stage is authored at 1280×720 and **scaled as a single unit**, so the browser, the native
window and a 4K fullscreen all show the same layout — HUD included — at every window size.

> Android/APK packaging was removed in this revision — the project is PC-focused now. The old
> packaging notes live in `dev-history/`.

---

## 📖 Story & dialogue

Every wave and every boss opens with a **Stardew-style dialogue box**: the speaker's portrait
from the main menu, their nameplate, and a line about what the Crystal Gems are actually going
through in that part of the story. The ten episodes track Seasons 1–5, so the writing follows
the show:

| Episode | Arc | What the cast is dealing with |
| :--- | :--- | :--- |
| 1 | *Gem Glow* era | Centipeetles on the boardwalk; Steven wants to prove himself |
| 2 | *Serious Steven* | A cracked Galaxy Warp and Blade Quartzes who don't remember the war |
| 3 | *On the Run* | Amethyst's Kindergarten and the gems that never made it out |
| 4 | *Gem Drill* | Peridot warns that the Cluster is about to hatch inside the Earth |
| 5 | *Bismuth* | The forge, Rose's sword, and the Breaking Point nobody wants to discuss |
| 6 | *Earthlings / Alone at Sea* | Jasper under the ice; Lapis facing what Malachite was |
| 7 | *Gem Heist / That Will Be All* | The Human Zoo, the Zoomans, and Blue Agate's wardens |
| 8 | *Stuck Together / The Trial* | Topaz, Aquamarine, and humans being taken off the beach |
| 9 | *Off Colors* | The Homeworld courtroom, the Off-Colors, the Robonoid Hunter |
| 10 | *Change Your Mind* | White Diamond, and Steven finally saying who he is |

`party` and `partner` lines resolve to whichever guardians you picked, so the banter stays in
character for any roster. Advance a line with **click / Space / Enter** (it also auto-advances
after 7 seconds so it never blocks a run).

Between waves the guardians **run off the right side of the stage**, the screen blurs to black,
and the next wave loads with them entering from the left. Clearing an episode does the same
thing before the next map fades in.

---

## ⚡ Super-move cut-ins

Activating **Pink Overdrive** freezes the fight and plays a portrait cut-in: the hero's menu
portrait sweeps in from the left (P1) or mirrored from the right (P2-CPU/2P), with rotating
light rays, speed lines, their name in display type, and a white flash before the buff lands.
Fusions get the same treatment with the fusion's crest and weapon line. The whole sequence is
~1.9 seconds and pauses enemies, projectiles and timers while it plays.

---

## 🕹️ Controls

| Action | 1P | 2P — Player 1 | 2P — Player 2 |
| :--- | :--- | :--- | :--- |
| Move | `A` / `D` | `A` / `D` | `←` / `→` |
| Jump / double jump | `W` / `Space` | `W` | `↑` |
| Guard shield | `S` | `S` | `↓` |
| Primary combo `[J]` | `J` | `F` | `J` |
| Special `[K]` | `K` | `G` | `K` |
| Signature skill `[L]` | `L` | `H` | `L` |
| Dodge dash (i-frames) | `I` | `E` | `I` |
| Pink Overdrive | `U` / `O` | `R` | `O` |
| Tag-Team Fusion | — | `V` | — |
| Pause | `Esc` | `Esc` | `Esc` |

---

## 🔮 Gem Typing (new)

Each of a guardian's three moves channels an **element**, shown as a coloured tag on every
hotbar slot (`FAIRY`, `ELECTR`, `WATER`, …). The chart is the authentic Pokémon chart restricted
to the 11 types the Steven Universe cast uses.

| Type | Super effective against | Resisted by | On-hit rider |
| :--- | :--- | :--- | :--- |
| **FIGHT** | STEEL, DARK, NORMAL | FLYING, PSYCHIC, FAIRY | Staggers (interrupts wind-ups) |
| **PSYCHIC** | FIGHT | STEEL, PSYCHIC · **immune: DARK** | Dazes (scrambles attacks) |
| **FAIRY** | FIGHT, DARK, DRAGON | STEEL | Charms (slower attacks) |
| **STEEL** | FAIRY | STEEL, WATER, ELECTR, FIRE | Cracks armour (+18 % damage taken) |
| **ELECTR** | WATER, FLYING | DRAGON, ELECTR | Overloads (0.9 s stun) |
| **WATER** | FIRE | WATER, DRAGON | Soaks (28 % slow) |
| **FIRE** | STEEL | WATER, FIRE, DRAGON | Scorches (3 % max HP/s) |
| **DARK** | PSYCHIC | FIGHT, DARK, FAIRY | Corrupts (+10 % damage taken) |
| **DRAGON** | DRAGON | STEEL · **immune: FAIRY** | Shatters (+25 % damage taken) |
| **FLYING** | FIGHT | STEEL, ELECTR | Launches (extra knockback) |
| **NORMAL** | — | STEEL | — (reliable, no rider) |

* **Super effective** = 2× damage and a floating "SUPER EFFECTIVE!" tag; resisted = 0.5×;
  dual-typed enemies multiply (FAIRY vs DARK+DRAGON = 4×).
* **STAB**: using a move that matches the guardian's own typing adds **+20 %**.
* Hero typings (from the show): Steven `FAIRY/PSYCHIC`, Garnet `FIGHT/PSYCHIC`,
  Amethyst `FIGHT/DARK`, Pearl `PSYCHIC/FIGHT`, Bismuth `STEEL/FIGHT`, Peridot `STEEL/ELECTR`,
  Lapis `WATER/FLYING`, Rose `FIGHT/FAIRY`, Connie `NORMAL/FIGHT`, Jasper `FIGHT/DRAGON`.

---

## ⚔️ Difficulty

| Tier | Hearts | Enemy HP | Speed | Telegraph | Attackers | Snacks | Reinforcements | Heal between episodes |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| 🟢 EASY | 7 | ×0.70 | ×0.85 | ×1.55 | 1 | 50 % | +0 | full |
| 🟡 MEDIUM | 5 | ×1.00 | ×1.00 | ×1.00 | 2 | 34 % | +0 | full |
| 🟠 HARD | 4 | ×1.40 | ×1.18 | ×0.72 | 3 | 20 % | +1 / wave | +1 heart |
| 🔴 EXTREME | 3 | ×1.90 | ×1.40 | ×0.48 | 4 | 9 % | +2 / wave | +1 heart |
| 💎 DIAMOND | 2 | ×2.50 | ×1.55 | ×0.36 | 4 | 3 % | +3 / wave | **none** |

Bosses scale too (×0.90 → ×1.80), elites become common (6 % → 55 %), enemy attack cooldowns
drop to 62 %, and from HARD upward corruptions resist knockback (15 % → 45 %), so you can no
longer juggle the whole arena. EXTREME now means extreme.

---

## 💎 Roster

| Hero | Weapon | Signature skill | Move types |
| :--- | :--- | :--- | :--- |
| ⭐ **Steven** | Rose's shield | Bubble + healing saliva (+1 heart) | `FAIRY / FAIRY / PSYCHIC` |
| 🥊 **Garnet** | Spiked gauntlets | Electrokinetic gauntlet slam | `FIGHT / FIGHT / ELECTR` |
| 🟣 **Amethyst** | Dual whips | Violet energy geysers | `FIGHT / FIGHT / DARK` |
| 🗡️ **Pearl** | Spear | Holo-Pearl duelist clone | `FIGHT / STEEL / PSYCHIC` |
| 🔨 **Bismuth** | Forge hammer | Molten breaking-point slam | `STEEL / STEEL / FIRE` |
| 🛸 **Peridot** | Ferrokinesis | Flask robonoid + EMP vortex | `STEEL / ELECTR / STEEL` |
| 💧 **Lapis** | Hydrokinesis | Oceanic tidal wave | `WATER / WATER / FLYING` |
| 🌹 **Rose Quartz** | Broadsword | Healing tears | `FIGHT / FAIRY / FAIRY` |
| ⚔️ **Connie** | Rose's sword | Tactical roll & parry | `NORMAL / FIGHT / NORMAL` |
| 🔶 **Jasper** | Crash helmet | Ground spire shatter | `FIGHT / DRAGON / FIGHT` |

**9 fusions** (2-player tag-team, `V` at 100 % harmony): Stevonnie, Smoky Quartz,
Rainbow Quartz 2.0, Sunstone, Sugilite, Sardonyx, Opal, Malachite, Rainbow Quartz (Classic).

**10 episodes:** Beach City Boardwalk → Galaxy Warp & Spire → Prime Kindergarten → the Cluster →
Bismuth's Forge → the Frozen North & Jasper → Pink Diamond's Space Zoo → Homeworld Abduction
Shore → Homeworld Trial & Off-Colors → *Change Your Mind* (White Diamond, Era 3).

---

## 📁 Project layout

```
Crystal-Gems.html          ← the game, single-file build (generated)
crystal-gems.sh            ← Linux launcher (native WebKit2, browser fallback)
Crystal Gems!.desktop      ← desktop shortcut
README.md
assets/
  images/                  ← 7 lobby landscapes + icons
  icons/                   ← .ico files
  source-art/              ← original downloaded reference art
build/
  Crystal Gems.exe         ← Windows launcher with the game embedded
docs/
  HOW-TO-PLAY.txt          ← player quick reference
  CODE-MAP.md              ← architecture & provenance notes
  CHANGELOG.md             ← what changed in this revision
src/
  game.html                ← markup & screens (1,180 lines)
  game.css                 ← HUD, menus, responsive layout (3,221 lines)
  game.js                  ← engine, heroes, enemies, audio (17,576 lines)
tools/
  build.py                 ← bundle src/ → Crystal-Gems.html
  preview.sh               ← headless gameplay screenshot / smoke test
  test-types.js            ← 126 unit tests for the matchup engine
  character-sheet.html     ← dev view of all 10 heroes at 3.4× zoom
  monster-sheet.html       ← dev view of the basic corruptions at 2.6× zoom
  windows-launcher/        ← C# source for build/Crystal Gems.exe
dev-history/               ← archived patchers, v1 sources, legacy builds
```

---

## 🐳 Docker (Windows / macOS / Linux)

```bash
docker compose up --build      # then open http://localhost:8080
# or
docker build -t crystal-gems . && docker run --rm -p 8080:80 crystal-gems
```

The image is `nginx:alpine` plus the single-file build, so it behaves identically on any host
with Docker. It serves the game; it does not (and cannot) speed the game up — the game runs in
your browser. Details: [docs/DOCKER.md](docs/DOCKER.md).

---

## 🛠️ Development

```bash
python3 tools/build.py          # rebuild the single-file game
node tools/test-types.js        # run the type-engine unit tests
./tools/preview.sh garnet       # headless screenshot (hero, out path, difficulty)
python3 -m http.server 8080     # then open /src/game.html while editing
mcs -target:winexe -out:"build/Crystal Gems.exe" \
    -resource:Crystal-Gems.html,CrystalGems.html \
    -win32icon:assets/icons/CrystalGems.ico \
    tools/windows-launcher/CrystalGemsLauncher.cs    # rebuild the Windows exe
```

Edit **`src/`**, never `Crystal-Gems.html` — it is generated. The seven lobby landscapes are
inlined as base64 by the build, so the shipped file has no external assets.

---

## ⚖️ Legal

A non-commercial fan project. *Steven Universe* and all characters are © Cartoon Network /
Rebecca Sugar. Not affiliated with or endorsed by Cartoon Network. Please don't sell it.
