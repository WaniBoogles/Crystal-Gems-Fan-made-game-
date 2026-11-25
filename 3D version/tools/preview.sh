#!/usr/bin/env bash
# ==============================================================================
# Crystal Gems! — headless preview / smoke test
#
# Boots the game, starts a stage, spawns a few enemies and captures a PNG so
# gameplay, HUD and character art can be verified without a display.
#
#   tools/preview.sh [hero] [out.png] [difficulty]
#   tools/preview.sh garnet /tmp/garnet.png extreme
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HERO="${1:-garnet}"
OUT="${2:-/tmp/crystal-gems-preview.png}"
DIFF="${3:-hard}"
PORT="${PREVIEW_PORT:-8899}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"; [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null || true' EXIT

# Mirror the source tree so every relative asset resolves exactly as it does in-game.
ln -s "$ROOT/src/game.css" "$WORK/game.css"
ln -s "$ROOT/src/game.js" "$WORK/game.js"
for f in "$ROOT"/assets/images/*; do ln -s "$f" "$WORK/$(basename "$f")"; done

WIDTH="${PREVIEW_WIDTH:-1280}"
HEIGHT="${PREVIEW_HEIGHT:-720}"

python3 - "$ROOT/src/game.html" "$WORK/game.html" "$HERO" "$DIFF" "$WIDTH" "$HEIGHT" <<'PY'
import sys
src, dst, hero, diff, width, height = sys.argv[1:7]
html = open(src, encoding='utf-8').read()
harness = f'''
<script>
// ---- headless preview harness (temporary file, never shipped) ----
window.addEventListener('load', () => {{
  (() => {{
    try {{
      const g = window.game;
      g.difficulty = {diff!r};
      g.gameMode = 'story';
      g.startNewGame('story');
      g.selectedCharP1 = {hero!r};
      g.player.switchCharacter({hero!r}, g.audio, g.particles);
      const ts = document.getElementById('titleScreen'); if (ts) ts.remove();
      g.stageIndex = 1;
      g.enemyManager.reset(1, DIFFICULTY_CONFIG[{diff!r}], g.pickups);
      // A spread of defensive typings so matchup feedback is visible.
      g.enemyManager.spawnEnemy('centipeetle', 760);
      g.enemyManager.spawnEnemy('blade_quartz', 880);
      g.enemyManager.spawnEnemy('ice_monster', 1010);
      g.enemyManager.spawnEnemy('forge_automaton', 1140);
      g.player.x = 640; g.cameraX = 0;
      // Land hits from every slot so damage numbers / status tags render.
      g.player.executeAttackJ(g.audio, g.particles, g.projectiles);
      g.tagPlayerProjectiles(g.player);
      g.player.executeSpecialK(g.audio, g.particles, g.projectiles);
      g.tagPlayerProjectiles(g.player);
      g.player.executeSkillL(g.audio, g.particles, g.pickups, g.projectiles);
      g.tagPlayerProjectiles(g.player);
      for (let i = 0; i < 40; i++) {{ g.update(1/60); }}
      g.updateHUD();
      g.updateActionBar();
      g.render();
    }} catch (e) {{
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#7f1d1d;color:#fff;font:16px monospace;padding:24px;white-space:pre-wrap';
      box.textContent = 'PREVIEW ERROR\\n' + (e && e.stack || e);
      document.documentElement.appendChild(box);
    }}
  }})();
}});
</script>
'''
html = html.replace('</body>', harness + '\n</body>')
open(dst, 'w', encoding='utf-8').write(html)
PY

( cd "$WORK" && exec python3 -m http.server "$PORT" >/dev/null 2>&1 ) &
SERVER_PID=$!
sleep 1.2

PROFILE="$(mktemp -d)"
rm -f "$OUT"
firefox --headless --profile "$PROFILE" --no-remote \
  --window-size="${WIDTH},${HEIGHT}" --screenshot "$OUT" \
  "http://127.0.0.1:${PORT}/game.html" >/dev/null 2>&1 || true
rm -rf "$PROFILE"

if [ -f "$OUT" ]; then
  echo "Preview written: $OUT ($(du -h "$OUT" | cut -f1))"
else
  echo "Preview failed — is firefox installed?" >&2
  exit 1
fi
