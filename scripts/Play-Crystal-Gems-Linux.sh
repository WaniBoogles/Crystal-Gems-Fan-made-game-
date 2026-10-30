#!/usr/bin/env bash
# ==============================================================================
# Crystal Gems! - 1-Click Standalone Desktop Launcher for Linux Mint & Ubuntu
# Plays soundtrack automatically on launch with 0 clicks required!
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_HTML="$DIR/Crystal-Gems.html"
[ -f "$TARGET_HTML" ] || TARGET_HTML="$DIR/Crystal-Gems-Mobile.html"
[ -f "$TARGET_HTML" ] || TARGET_HTML="$DIR/game.html"
FILE_URL="file://$TARGET_HTML"

export DISPLAY="${DISPLAY:-:0}"

# Priority 1: Native GTK3 + WebKit2 with 100% Zero-Click Autoplay Enabled!
if command -v python3 >/dev/null 2>&1; then
  python3 -c "
import gi, sys, os
try:
    gi.require_version('Gtk', '3.0')
    gi.require_version('WebKit2', '4.1')
    from gi.repository import Gtk, WebKit2, GdkPixbuf
    w = Gtk.Window(title='Crystal Gems!')
    w.set_default_size(1280, 800)
    w.set_position(Gtk.WindowPosition.CENTER)
    for icon_name in ['crystal-gems.png', 'icon-512.png', 'icon-192.png']:
        ip = os.path.join('$DIR', icon_name)
        if os.path.exists(ip):
            try:
                w.set_icon_from_file(ip)
                break
            except Exception: pass
    wv = WebKit2.WebView()
    s = wv.get_settings()
    s.set_media_playback_requires_user_gesture(False)
    s.set_media_playback_allows_inline(True)
    s.set_enable_webgl(True)
    s.set_enable_accelerated_2d_canvas(True)
    s.set_allow_file_access_from_file_urls(True)
    s.set_allow_universal_access_from_file_urls(True)
    w.add(wv)
    w.fullscreen()
    w.connect('destroy', Gtk.main_quit)
    wv.connect('close', lambda *args: Gtk.main_quit())
    wv.connect('context-menu', lambda *args: True)
    wv.load_uri('$FILE_URL')
    w.show_all()
    Gtk.main()
except Exception as e:
    sys.exit(1)
" && exit 0
fi

# Priority 2: Chromium / Chrome / Brave with 100% Zero-Click Autoplay flag
for b in chromium-browser chromium google-chrome google-chrome-stable brave-browser; do
  if command -v "$b" >/dev/null 2>&1; then
    exec "$b" --autoplay-policy=no-user-gesture-required --app="$FILE_URL"
  fi
done

# Priority 3: Fallback xdg-open
exec xdg-open "$TARGET_HTML"
