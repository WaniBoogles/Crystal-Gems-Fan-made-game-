# Changelog

## 2025-11-01 — "Story" revision

### Added — story mode with Stardew-style dialogue
* `STORY_SCRIPT`: **50 hand-written beats** (4 per episode + a boss intro), each rooted in the
  season that episode adapts — Centipeetles on the boardwalk, Amethyst's Kindergarten, Peridot's
  Cluster warning, Bismuth and the Breaking Point, Jasper under the ice, the Human Zoo, Topaz and
  Aquamarine, the Off-Colors, White Diamond.
* Dialogue box with the character's main-menu portrait, nameplate, typed line and a continue
  hint. Advance with click / Space / Enter, or wait 7 seconds. The fight is paused while it plays.
* `party` / `partner` speakers resolve to the guardians you actually picked.

### Added — portrait cut-ins (hitstop super-move intro)
* Overdrive now freezes the game for ~1.9 s and plays a full-screen portrait cut-in: hero
  portrait sweeps in from the left (P1) or mirrored from the right (P2), rotating light rays,
  speed lines, name in display type, quote line and a white flash.
* Fusions get a cut-in card with the fusion crest, name and weapon line.
* Damage, projectiles and timers are all paused during the sequence.

### Added — transitions & boss drama
* Wave clear now plays a **run-off-right** exit, a blurred fade to black, then the guardians
  enter from the left before the next wave spawns. Episode clear does the same before the next
  map fades in.
* Bosses below 30% HP pulse with a light-bleed aura and rising embers, and the whole arena
  trembles harder as their health drops.

### Changed — canon accuracy
* Pearl's `Spear Laser` → **Holo-Spear Volley** (hard-light holography is her canon gimmick;
  she has never fired a laser).
* Amethyst's `Violet Geysers` → **Whip Quake** (whip work + shapeshifting, not energy geysers).
* Connie's `Sword Flying Arc` → **Sword Dash Slash** and `Shadow Step Dash` → **Tactical Parry**
  (she was trained by Pearl; no energy projection in canon).

### Added — Docker
* `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docs/DOCKER.md`: the single-file build
  served by nginx:alpine on port 8080, identical on Windows, macOS and Linux.

## 2025-11-01 — "Widescreen" revision

Fixes the two things that were still off in the desktop window, plus another art pass.

### Fixed — the whole stage now scales, everywhere
* The game is authored at a fixed **1280×720** and `#game-container` is scaled as one unit
  (`transform: translate(-50%,-50%) scale(...)`, recomputed on resize/fullscreen/orientation).
  The browser build is now pixel-identical to the native window at any size — no more letterboxed
  viewport with the HUD poking outside it.
* Centring no longer uses flex `margin:auto` (which pinned the oversized stage to the top and
  clipped the hotbar when the window was shorter than 720px).
* **2-player HUD fixed**: `.hud-overlay` is a 3-column grid (P1 | centre | P2) with the quick-action
  pill on a second row. Previously P1 + centre + actions + P2 = ~1350px inside a 1252px bar, so the
  P2 panel was cut off at the right edge even in fullscreen.

### Fixed — the music player was unreadable in the native window
* Native `<select>` widgets are painted by WebKitGTK and ignored the dark theme, so the jukebox
  rendered white-on-white. All three BGM pickers are now a **custom themed dropdown**
  (`enhanceSelect()`), keeping the `<select>` in the DOM for its value/`change` API while hiding it
  behind a styled button + list. Identical in Firefox, Chromium and the GTK shell.

### Fixed — desktop shortcut icon
* `Crystal Gems!.desktop` pointed at a `crystal-gems.png` that no longer exists at the repo root, so
  Nemo showed a generic text-file icon. The shortcut now uses the pink star icon
  (`assets/images/crystal-gems.png`), and a copy was installed to `~/Desktop` and
  `~/.local/share/applications`.

### Art
* **Pearl**: rebuilt hair as her canon short back-swept bob with a forehead curl (was a long conical
  fin), and slimmed the spear from a gold-wrapped lance to an elegant shaft with a smaller
  leaf-shaped head.
* **Lapis**: water wings are now three tapered, veined hydro blades per side with a bright leading
  edge (were two flat balloons); skin is soft periwinkle instead of neon cyan.
* **Monsters redrawn**: `blade_quartz` (hunched quartz with a crystal blade arm and chest gem),
  `cluster` (knotted mound of limbs, gems and mismatched eyes), `forge_automaton` (iron body with a
  glowing furnace and piston arms), `robonoid_scout` (floating drone with a glass eye and antenna),
  `ice_monster` (crystalline beast with jagged shoulders), `winged_centipeetle` (two pairs of veined
  wings), `volcanic_firebird` (an actual bird silhouette instead of a triangle).
* New `tools/monster-sheet.html` renders the basic corruptions at ×2.6 for review.

### Tooling / docs
* `tools/preview.sh` still renders the game headlessly; screenshots in `docs/` refreshed.
* Bundle rebuilt (2.17 MB), 126 type tests still green.

## 2025-11-01 — "Gem Types" revision

A systems + polish pass focused on the PC build.

### Added — Pokémon-style gem typing
* Full 11-type matchup chart (the real Pokémon chart restricted to the cast's types) with
  **2× / 0.5× / 0×** multipliers, dual-type stacking (up to 4×), and **STAB +20 %**.
* Every move slot (`J`/`K`/`L`, including all 9 fusions) now carries an element, defined in
  `HERO_MOVE_TYPES` / `FUSION_MOVE_TYPES`.
* Projectiles inherit the element of the move that fired them (`PROJECTILE_TYPE_ELEMENTS`
  plus automatic tagging each frame).
* Ten on-hit riders: stagger, daze, charm, armour crack, overload stun, soak, scorch,
  corrupt, shatter, launch — with floating status labels.
* In-game feedback: coloured type tag on every hotbar slot, floating
  **SUPER EFFECTIVE! / RESISTED… / IMMUNE!** verdicts, type-coloured damage numbers.
* 126 unit tests (`node tools/test-types.js`) covering the chart, roster, fusions and enemies.

### Added — difficulty that actually escalates
* New tier **💎 DIAMOND** (2 hearts, 2.5× HP, no drops, no heal between episodes).
* Rebalanced **HARD** and **EXTREME** upward: ×1.40/×1.90 HP, 4 simultaneous attackers,
  telegraphs cut to 0.72/0.48, **+1/+2 extra enemies per wave**, boss HP ×1.20/×1.45,
  elite chance 18 %/34 %, enemy cooldowns ×0.88/×0.74, knockback resistance 15 %/30 %.
* Stage-clear healing is now per-tier (`stageHeal`): full on EASY/MEDIUM, +1 on HARD/EXTREME,
  none on DIAMOND.
* The dead **difficulty modal is now functional** (5 cards, live highlight, confirm) and the
  lobby pill quick-cycles through all five tiers.

### Changed — art accuracy
* **Garnet** redrawn to her canon silhouette: rounded-cube afro that wraps the skull (was a
  floating slab), deep umber skin, dark visor with magenta rim light and a subtle glint
  (was a red→blue gradient), unified maroon bodysuit legs (were crimson + navy), gold-rimmed
  chest star, gauntlets scaled down to canon proportion.
* **Steven**: shirt corrected from pink to his coral-red tee; the navel gem is now a faceted
  pentagon instead of a star.
* **Pearl**: swept hair shortened so it reads as hair rather than a fin.
* Added `tools/character-sheet.html`, a 3.4× character sheet for reviewing all ten heroes.

### Fixed
* **Linux launcher works again.** New root `crystal-gems.sh` resolves the game relative to
  itself, prefers a native GTK3 + WebKit2 fullscreen window, falls back to Firefox/Chromium,
  and has `--check` / `--windowed` modes. `Crystal Gems!.desktop` now points at it, points at a
  real icon, and is executable + marked trusted.
* **`src/` runs standalone** — CSS and HTML now reference `../assets/images/…` instead of
  files that only ever existed in the packaged folder.
* Removed the orphaned `sw.js` (it precached six files that did not exist) and `manifest.json`.
* Windows exe rebuilt from the current source (embeds the new bundle).

### Removed — mobile packaging
* `Crystal-Gems.apk`, `CrystalGems-APK-Package.zip`, `StevenUniverse-APK-Package.zip`,
  both mobile HTML builds, `index.html` (APK download hub), `qr-code.png`,
  `manifest.json`, `sw.js`, `scripts/mobile-server.py`, `scripts/start-mobile-server.sh`.
* Mobile touch code stays in `game.js` (inert on desktop) so an Android build can return later.

### Housekeeping
* Single source of truth: the duplicate `Steven Universe/freebuff/` tree is gone; the 261-file
  Wine prefix (`scratch/wine/`, ~10 MB) is gone; test `.exe` files are gone.
* **Before:** 352 tracked files, 5 copies of the game, 3 APK artefacts.
  **After:** `src/` + one generated bundle + one exe.
* `BG Image/` → `assets/source-art/`; patcher scripts, v1 sources and legacy zips →
  `dev-history/`; launcher source → `tools/windows-launcher/`.
* New `tools/build.py` builds the single-file bundle reproducibly and validates that no
  external asset leaked in.

### Known issues
* A GitHub personal access token is still embedded in `.git/config` (the `origin` remote URL).
  **Rotate it and switch to SSH.**
* The build still links Google Fonts; offline it falls back to system fonts (no crash).
