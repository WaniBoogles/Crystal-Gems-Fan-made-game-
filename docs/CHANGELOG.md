# Changelog

## 2025-11-01 — "Cut-in" revision

### Rebuilt — super-move portraits, Unleash-the-Light style
* New portrait art: expressive busts with open smiles, big highlighted eyes, blush, ink
  outlines, rim light, sparkles and a raised waving arm. Transparent cut-outs so the star
  burst reads behind them.
* Cut-in layout matches the reference: **partner A on the left, partner B on the right,
  mirrored**, each on a pulsing SU star burst, with the name card centred underneath.
  Overdrive by P1 fills the left slot, P2 the right; a fusion fills **both** with the two
  partners, and the fusion's own name is the title.
* Portraits are painted straight into a `<canvas>` in the cut-in (a data-URL `<img>` painted a
  frame late and showed up blank).

## 2025-11-01 — "Portraits" revision

### Added — painted super-move portraits
* The Overdrive and Fusion cut-ins no longer blow a 64px menu icon up to 340px (the
  "jumpscare"). Every character now has a proper **painted bust portrait** drawn with Canvas:
  coloured burst backdrop, shaded face, rim light, gem, and their signature features
  (Garnet's visor, Peridot's triangle and visor, Jasper's cheek stripes, Bismuth's rainbow
  dreads, Pearl's forehead gem, Rose's curls...).
* **All 19** are covered: the 10 guardians and the 9 fusions, each fusion blending both
  partners' palettes and gem colours (Stevonnie = Connie's hair on Steven's shirt, Malachite =
  Lapis' blue skin under Jasper's white mane, and so on).
* Portraits are cached as data URLs, so the cut-in stays instant.

### Changed — fusions share their kit
* A fusion's typing is now the **union of both partners' gem types**, so either partner's
  element gets STAB — Stevonnie can hit FAIRY and NORMAL with equal weight.
* In 2-player fusion both hotbars show the **same shared move set** instead of two different
  lists, because both players are driving one body.

## 2025-11-01 — "Polish" revision

### Removed
* **Fast Performance Mode** is gone from Settings — it only ever mattered on phones, and the
  button sat next to the screen-shake toggle confusingly. Settings keeps the shake switch.

### Animation
* **Running** kicks up a small dust puff at each footfall (every 0.16 s while grounded and moving).
* **Landing** now squashes the hero wide-and-low for a beat and springs back, with a dust burst —
  jumps finally have weight instead of snapping to the floor.
* **Dodge** leaves a three-frame cyan ghost trail behind the roll.

### Copy
* Rewrote the machine-sounding instruction lines: the jukebox hint now reads
  "Pick a track and it starts right away — it keeps playing through fights.", the controls
  paragraph is plain human instructions, and the graphics hint talks like a person
  ("Turn the shake off if the boss fights get too bumpy for you.").

## 2025-11-01 — "Hotfix" revision

### Fixed — the hero could not move (all modes)
* **Root cause:** removing the mobile settings row left an **unclosed `<div>`** in
  `settingsScreen`. Everything after it — the dialogue box, the boss-gate prompt, the Overdrive
  cut-in and the stage veil — was swallowed into the hidden settings modal. `dialogueActive`
  stayed `true` with an invisible box, so `update()` returned early every frame: the hero froze,
  enemies never spawned and the Overdrive portrait never appeared.
* Removed the orphan wrapper; all overlays are direct children of `#game-container` again and
  the document nesting balances to zero.

### Fixed — Overdrive shows its portrait again
* The cut-in artwork was in that hidden modal. It is visible again: portrait sweeps in from the
  left (mirrored from the right for P2), ~1.05 s, with slow motion instead of a freeze.

### Fixed — HUD avatar showed an emoji (🔧 for Peridot)
* The in-game avatar now uses each guardian's **portrait SVG** (same art as the menu) for both
  P1 and P2, instead of the roster emoji.

### Changed — pause keeps the game visible
* `.overlay-screen` is now translucent with a light blur, so pausing shows the **frozen game and
  its HUD behind the pause card** instead of a near-black wall. The pause menu itself is
  unchanged.

## 2025-11-01 — "Voice & Sound" revision

### Fixed — dialogue no longer puts lines in the wrong mouth
* All 45 story lines that resolved to "whoever the player picked" are now written for their
  **canonical speaker** (almost all of them Steven). Playing Lapis no longer makes Lapis say
  "I'm not Rose Quartz. I'm not Pink Diamond. I'm Steven."

### Changed — HUD controls
* The quick-action pill now contains **only the pause button** (mobile / sound / screenshot
  removed). It sits at the **top-right** in 1-player and returns to the **centre** in 2-player.
* Settings modal: the "CONTROLS & DISPLAY / Mobile Controls" row is gone.

### Fixed — every episode now has its own soundtrack
* `playStageMusic()` asked for `stage_8` and `boss_N` profiles that never existed, so those
  fights fell back to the menu theme — and the saved jukebox track silently overrode **every**
  level.
* Added an explicit episode → track map plus a new `stage_8` (Homeworld, imperial march), and
  retuned each theme to its setting: Kindergarten 92 BPM hollow, Cluster 76 BPM heavy, Forge
  124 BPM industrial, Frozen North 84 BPM glassy, Trial 140 BPM tense, Finale 156 BPM epic.
* Boss fights now use the episode's theme at boss tempo instead of the menu track.
* The jukebox only overrides level music when **you** pick a track; otherwise the level's own
  atmosphere plays.

## 2025-11-01 — "Flow" revision

### Changed — waves no longer walk you off screen
* Clearing waves 1–3 now flows **straight into the next wave in place**: the dialogue plays,
  the next wave spawns, nobody is moved. The auto walk-right transition between waves is gone.
* **Boss gate:** after the last wave, the boss waits at the right edge. The player walks there
  **manually** — so they can farm bubbles, hearts and Overdrive charge first. Entering the arena
  runs the fade-to-black + walk-in, then the boss dialogue.
* New indicators for the gate: a pulsing in-world **"BOSS AHEAD" arrow** at the stage edge, a
  full-width banner, and a bottom-right prompt explaining why you'd want to walk there.
* Episode completion still fades to black and starts the next map.

### Changed — Overdrive is 1 second and slow-motion
* The portrait cut-in is now **~1.05 s** (fusion 1.0 s) instead of 1.9 s.
* The world no longer freezes: it runs at **22% speed** during the cut-in (slow motion), so the
  fight keeps flowing and the buff lands immediately after.

### Fixed — dialogue showed through the pause menu
* Dialogue and cut-in overlays are now in-game only: they hide on pause/title and come back on
  resume. The boss-gate prompt follows the same rule.

### Changed — dialogue
* Every beat is now **2–4 lines** with actual energy — banter, panic, jokes and the emotional
  beats the scene deserves (Peridot's dread, Lapis facing Malachite, Bismuth vs Pearl, Connie's
  enthusiasm, the finale).
* Lines stay with the cast who are actually present in that part of the story.

### Added — mode options
* **STORY: ON/OFF** toggle in the lobby (persisted). OFF = pure arcade: no dialogue, boss gate
  auto-opens after a short beat.
* **EPISODES** button + modal: jump into any of the 10 episodes from the main menu with your
  current guardian, player mode and difficulty — no need to replay from Episode 1.

## 2025-11-01 — "Control fixes" revision

Three reported bugs, plus the desktop wrapper that caused the worst of them.

### Fixed — pause was quitting the desktop app
* The GTK launcher bound **Escape to `Gtk.main_quit()`**, so the pause key closed the window
  instead of opening the pause menu. Escape now belongs to the game; **F11** toggles fullscreen
  and **Ctrl+Q** quits. The WebView also grabs keyboard focus on load.
* Pausing (Escape or the ⏸ button) now also releases every held key, so nothing stays pressed
  while the menu is open.

### Fixed — music dropped every time a key was pressed
* `onAudioRunning()` called `fadeInMusic()`, which ramps from 0.0001 — and the keydown handler
  called `audio.init()` on **every** keypress, so the whole soundtrack was re-ducked to near
  silence dozens of times a second while moving.
* The fade now runs exactly once per session; later wake-ups just restore the slider volume.
  `init()` is only called when the audio context is missing or suspended.
* Menu music: returning from a run to the title screen resumes the context and restarts the
  lobby track, and a boot-time helper retries the lobby track on the first click/keypress
  (browser autoplay rules still require that first gesture; the native window usually starts
  on its own).

### Fixed — the hero kept walking after the keys were released
* Missing `keyup` events (window blur, Alt-Tab, tab hide, lost focus in the desktop wrapper)
  left `keysP1.right/left` stuck true forever.
* Added `releaseAllInputs()` on `blur`, `visibilitychange`, pointer cancel, pause, resume, menu
  return and every new game, plus a modifier-key guard. Verified: hold D, fire `blur`, let go →
  drift is now exactly 0.00 px over 1.5 s.

### Rebuilt
* `Crystal-Gems.html` and `build/Crystal Gems.exe` regenerated from the fixed source.

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
