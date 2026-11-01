#!/usr/bin/env bash
# ==============================================================================
#  Crystal Gems! — one-click PC launcher (Linux Mint / Ubuntu / Debian)
#
#  Plays the single-file build in a native GTK3 + WebKit2 window (fullscreen,
#  hardware accelerated, audio allowed without a click). Falls back to Firefox
#  or Chromium kiosk mode, then to the default browser.
#
#  Usage:
#     ./crystal-gems.sh            launch
#     ./crystal-gems.sh --windowed launch in a 1280x800 window
#     ./crystal-gems.sh --check    verify paths & dependencies without launching
# ==============================================================================
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---- Resolve the game file ---------------------------------------------------
HTML=""
for candidate in "$DIR/Crystal-Gems.html" "$DIR/src/game.html"; do
  if [ -f "$candidate" ]; then HTML="$candidate"; break; fi
done

MODE="fullscreen"
for arg in "$@"; do
  case "$arg" in
    --windowed) MODE="windowed" ;;
    --fullscreen) MODE="fullscreen" ;;
    --check) MODE="check" ;;
    -h|--help)
      sed -n '2,16p' "$0" | sed 's/^#  \{0,1\}//'
      exit 0
      ;;
  esac
done

if [ -z "$HTML" ]; then
  echo "✖ Crystal-Gems.html not found." >&2
  echo "  Build it first:  python3 tools/build.py" >&2
  exit 1
fi

# ---- Diagnostics mode --------------------------------------------------------
GTK_STATUS="unavailable"
if python3 - <<'PY' >/dev/null 2>&1
import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.1')
from gi.repository import Gtk, WebKit2
PY
then GTK_STATUS="available"; fi

if [ "$MODE" = "check" ]; then
  echo "Crystal Gems! launcher check"
  echo "  project dir : $DIR"
  echo "  game file   : $HTML"
  echo "  build size  : $(du -h "$HTML" | cut -f1)"
  echo "  native GTK3 + WebKit2 : $GTK_STATUS"
  echo "  firefox     : $(command -v firefox || echo 'not installed')"
  echo "  chromium    : $(command -v chromium || command -v chromium-browser || command -v google-chrome || echo 'not installed')"
  echo "  backend     : $( [ "$GTK_STATUS" = available ] && echo 'native WebKit2 window' || echo 'browser kiosk fallback' )"
  exit 0
fi

# ---- Preferred backend: native WebKit2 window --------------------------------
if [ "$GTK_STATUS" = available ]; then
  python3 - "$HTML" "$MODE" <<'PY'
import os, sys
import gi

gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.1')
from gi.repository import Gtk, Gdk, WebKit2, GdkPixbuf

html_path, mode = sys.argv[1], sys.argv[2]
icon_path = os.path.join(os.path.dirname(html_path), 'assets', 'images', 'crystal-gems.png')

class CrystalGemsWindow(Gtk.Window):
    def __init__(self):
        super().__init__(title="Crystal Gems!")
        self.set_wmclass("CrystalGems", "Crystal Gems!")
        self.set_role("game")

        if os.path.exists(icon_path):
            try:
                pixbuf = GdkPixbuf.Pixbuf.new_from_file(icon_path)
                self.set_icon(pixbuf)
                Gtk.Window.set_default_icon(pixbuf)
            except Exception:
                pass

        rgba = Gdk.RGBA()
        rgba.parse("#0f0a1c")
        self.override_background_color(Gtk.StateFlags.NORMAL, rgba)

        self.webview = WebKit2.WebView()
        self.webview.override_background_color(Gtk.StateFlags.NORMAL, rgba)

        settings = self.webview.get_settings()
        for setter, value in (
            ("set_enable_webgl", True),
            ("set_enable_accelerated_2d_canvas", True),
            ("set_enable_javascript", True),
            ("set_allow_file_access_from_file_urls", True),
            ("set_allow_universal_access_from_file_urls", True),
            ("set_media_playback_requires_user_gesture", False),
            ("set_media_playback_allows_inline", True),
        ):
            try:
                getattr(settings, setter)(value)
            except Exception:
                pass

        self.webview.connect("close", lambda *_: Gtk.main_quit())
        self.add(self.webview)
        self.connect("destroy", Gtk.main_quit)

        if mode == "fullscreen":
            self.fullscreen()
        else:
            self.set_default_size(1280, 800)
            self.set_position(Gtk.WindowPosition.CENTER)

        self.show_all()
        self.webview.load_uri("file://" + html_path)
        # Keyboard focus on the page, not the window chrome.
        self.webview.grab_focus()

    def on_key_press(self, _widget, event):
        # Esc belongs to the GAME (it opens the pause menu), so it must never quit the
        # window — that was the "pause closes the game" bug in the desktop launcher.
        ctrl = bool(event.state & Gdk.ModifierType.CONTROL_MASK)
        if event.keyval == Gdk.KEY_F11:
            if self.get_window() and self.get_window().get_state() & Gdk.WindowState.FULLSCREEN:
                self.unfullscreen()
            else:
                self.fullscreen()
            return True
        if ctrl and event.keyval in (Gdk.KEY_q, Gdk.KEY_Q, Gdk.KEY_w, Gdk.KEY_W):
            Gtk.main_quit()
            return True
        return False

window = CrystalGemsWindow()
window.connect("key-press-event", window.on_key_press)
Gtk.main()
PY
  exit $?
fi

# ---- Fallback: browser kiosk / app mode --------------------------------------
FILE_URL="file://$HTML"
if command -v firefox >/dev/null 2>&1; then
  echo "▶ Launching Crystal Gems! in Firefox kiosk mode…"
  exec firefox --kiosk "$FILE_URL"
fi
if command -v chromium >/dev/null 2>&1; then
  exec chromium --app="$FILE_URL" --start-fullscreen --autoplay-policy=no-user-gesture-required
fi
if command -v google-chrome >/dev/null 2>&1; then
  exec google-chrome --app="$FILE_URL" --start-fullscreen --autoplay-policy=no-user-gesture-required
fi

echo "▶ Opening Crystal Gems! in your default browser…"
exec xdg-open "$FILE_URL"
