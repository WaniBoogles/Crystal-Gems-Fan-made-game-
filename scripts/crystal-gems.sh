#!/usr/bin/env bash
# ==============================================================================
# Crystal Gems! - Direct Native Fullscreen Game Application Launcher
# ==============================================================================

GAME_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export DISPLAY="${DISPLAY:-:0}"

# Launch the direct native fullscreen GTK3 + WebKit2 application
if command -v python3 >/dev/null 2>&1 && [ -f "$GAME_DIR/crystal-gems-app.py" ]; then
  exec python3 "$GAME_DIR/crystal-gems-app.py" "$@"
fi

TARGET_HTML="$GAME_DIR/Crystal-Gems.html"
[ -f "$TARGET_HTML" ] || TARGET_HTML="$GAME_DIR/Steven Universe Game.html"
[ -f "$TARGET_HTML" ] || TARGET_HTML="$GAME_DIR/game.html"
FILE_URL="file://$TARGET_HTML"

if command -v firefox >/dev/null 2>&1; then
  exec firefox --kiosk "$FILE_URL"
elif command -v chromium >/dev/null 2>&1; then
  exec chromium --kiosk --autoplay-policy=no-user-gesture-required --app="$FILE_URL"
elif command -v google-chrome >/dev/null 2>&1; then
  exec google-chrome --kiosk --autoplay-policy=no-user-gesture-required --app="$FILE_URL"
else
  exec xdg-open "$TARGET_HTML"
fi
