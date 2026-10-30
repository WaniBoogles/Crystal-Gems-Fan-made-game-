#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
Crystal Gems! - Direct Native Fullscreen Game Application for Linux Mint
==============================================================================
A standalone desktop application powered by native GTK3 and WebKit2.
Opens directly into full screen with no browser UI, tabs, or address bars.
"""

import os
import sys

# Ensure DISPLAY is set for desktop execution
if "DISPLAY" not in os.environ and "WAYLAND_DISPLAY" not in os.environ:
    os.environ["DISPLAY"] = ":0"

GAME_DIR = os.path.dirname(os.path.abspath(__file__))
ICON_PATH = os.path.join(GAME_DIR, "crystal-gems.png")
HTML_PATH = os.path.join(GAME_DIR, "Crystal-Gems.html")
if not os.path.exists(HTML_PATH):
    HTML_PATH = os.path.join(GAME_DIR, "Steven Universe Game.html")
if not os.path.exists(HTML_PATH):
    HTML_PATH = os.path.join(GAME_DIR, "game.html")

def run_native_gtk_app():
    import gi
    gi.require_version('Gtk', '3.0')
    gi.require_version('WebKit2', '4.1')
    from gi.repository import Gtk, WebKit2, Gdk, GdkPixbuf, GLib

    if not Gtk.init_check()[0]:
        raise RuntimeError("Gtk could not initialize display.")

    class CrystalGemsApp(Gtk.Window):
        def __init__(self):
            super().__init__(title="Crystal Gems!")
            self.set_wmclass("CrystalGems", "Crystal Gems!")
            self.set_role("game")
            self.is_fullscreen = True

            # Set Window Icon
            if os.path.exists(ICON_PATH):
                try:
                    pixbuf = GdkPixbuf.Pixbuf.new_from_file(ICON_PATH)
                    self.set_icon(pixbuf)
                    Gtk.Window.set_default_icon(pixbuf)
                except Exception as e:
                    print("Icon load error:", e)

            # Background color (Dark Beach City Purple #0f0a1c)
            rgba = Gdk.RGBA()
            rgba.parse("#0f0a1c")
            self.override_background_color(Gtk.StateFlags.NORMAL, rgba)

            # WebKit WebView
            self.webview = WebKit2.WebView()
            self.webview.override_background_color(Gtk.StateFlags.NORMAL, rgba)

            # Connect WebView close signal so window.close() exits app cleanly
            self.webview.connect("close", lambda *args: Gtk.main_quit())

            # Hardware Acceleration & Gaming Settings
            settings = self.webview.get_settings()
            settings.set_enable_webgl(True)
            settings.set_enable_accelerated_2d_canvas(True)
            settings.set_enable_smooth_scrolling(True)
            settings.set_enable_media_stream(True)
            settings.set_enable_mediasource(True)
            settings.set_enable_javascript(True)
            settings.set_enable_page_cache(True)
            settings.set_javascript_can_access_clipboard(True)
            settings.set_allow_file_access_from_file_urls(True)
            settings.set_allow_universal_access_from_file_urls(True)
            try:
                settings.set_media_playback_requires_user_gesture(False)
                settings.set_media_playback_allows_inline(True)
            except Exception:
                pass

            # Suppress browser right-click context menu (Pure native game feel)
            self.webview.connect("context-menu", lambda *args: True)

            # Key press handling for Fullscreen toggles
            self.connect("key-press-event", self.on_key_press)
            self.connect("destroy", Gtk.main_quit)

            self.add(self.webview)

            # Initial Window Size (for windowed mode) & Fullscreen
            self.set_default_size(1280, 800)
            self.set_position(Gtk.WindowPosition.CENTER)

            # DIRECT FULLSCREEN ON STARTUP
            self.fullscreen()

            # Load the local game
            file_uri = "file://" + os.path.abspath(HTML_PATH)
            self.webview.load_uri(file_uri)

        def on_key_press(self, widget, event):
            # F11 or Alt+Enter toggles Fullscreen
            keyval = event.keyval
            state = event.state

            if keyval == Gdk.KEY_F11 or (keyval == Gdk.KEY_Return and (state & Gdk.ModifierType.MOD1_MASK)):
                if self.is_fullscreen:
                    self.unfullscreen()
                    self.is_fullscreen = False
                else:
                    self.fullscreen()
                    self.is_fullscreen = True
                return True

            # Ctrl+Q quits
            if (keyval in (Gdk.KEY_q, Gdk.KEY_Q)) and (state & Gdk.ModifierType.CONTROL_MASK):
                Gtk.main_quit()
                return True

            return False

    app = CrystalGemsApp()
    app.show_all()
    Gtk.main()

def run_kiosk_fallback():
    """Fallback to kiosk/app fullscreen if GTK fails"""
    import subprocess, shutil
    file_url = "file://" + os.path.abspath(HTML_PATH)

    # 1. Chrome / Chromium in kiosk fullscreen
    for b in ["google-chrome", "google-chrome-stable", "chromium-browser", "chromium", "brave-browser"]:
        path = shutil.which(b)
        if path:
            subprocess.run([path, "--kiosk", "--app=" + file_url, "--autoplay-policy=no-user-gesture-required", "--user-data-dir=" + os.path.expanduser("~/.config/crystal-gems-profile")])
            return

    # 2. Firefox in kiosk fullscreen
    fx = shutil.which("firefox")
    if fx:
        subprocess.run([fx, "--kiosk", file_url])
        return

    # 3. Default handler
    xdg = shutil.which("xdg-open")
    if xdg:
        subprocess.run([xdg, HTML_PATH])

if __name__ == "__main__":
    try:
        run_native_gtk_app()
    except Exception as e:
        print("Native GTK launch encountered an issue:", e)
        print("Switching to Kiosk fallback mode...")
        run_kiosk_fallback()
