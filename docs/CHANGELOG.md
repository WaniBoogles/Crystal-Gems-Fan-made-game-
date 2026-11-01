# Changelog

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
