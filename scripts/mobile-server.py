#!/usr/bin/env python3
"""
Crystal Gems! Mobile Server
Provides direct APK installation, mobile portal, offline HTML download, and static file serving.
"""

import http.server
import socketserver
import os
import urllib.parse
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class MobileGameHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. DIRECT ONE-TAP APK INSTALLATION
        if path in ('/apk', '/crystal-gems.apk', '/Crystal-Gems.apk', '/download-apk'):
            file_path = os.path.join(BASE_DIR, 'Crystal-Gems.apk')
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', 'attachment; filename="Crystal-Gems.apk"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, 'Crystal-Gems.apk not found')
                return

        # 2. Direct one-click download of the complete offline mobile HTML game
        if path in ('/download', '/crystal-gems', '/html'):
            file_path = os.path.join(BASE_DIR, 'Crystal-Gems-Mobile.html')
            if not os.path.exists(file_path):
                file_path = os.path.join(BASE_DIR, 'Steven-Universe-Mobile.html')
            if not os.path.exists(file_path):
                file_path = os.path.join(BASE_DIR, 'Crystal-Gems.html')
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Disposition', 'attachment; filename="Crystal-Gems-Mobile.html"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, 'Mobile bundle not found')
                return

        # 3. Direct download of the APK packaging ZIP
        if path in ('/apk-package', '/zip'):
            file_path = os.path.join(BASE_DIR, 'CrystalGems-APK-Package.zip')
            if not os.path.exists(file_path):
                file_path = os.path.join(BASE_DIR, 'StevenUniverse-APK-Package.zip')
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/zip')
                self.send_header('Content-Disposition', 'attachment; filename="CrystalGems-APK-Package.zip"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, 'APK package not found')
                return

        super().do_GET()

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path in ('/apk', '/crystal-gems.apk', '/Crystal-Gems.apk', '/download-apk'):
            file_path = os.path.join(BASE_DIR, 'Crystal-Gems.apk')
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', 'attachment; filename="Crystal-Gems.apk"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                return
        elif path in ('/download', '/crystal-gems', '/html'):
            file_path = os.path.join(BASE_DIR, 'Crystal-Gems-Mobile.html')
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Disposition', 'attachment; filename="Crystal-Gems-Mobile.html"')
                self.send_header('Content-Length', str(os.path.getsize(file_path)))
                self.end_headers()
                return
        super().do_HEAD()

socketserver.TCPServer.allow_reuse_address = True
httpd = None
for p in [PORT, 8081, 8082, 8888]:
    try:
        httpd = socketserver.TCPServer(('0.0.0.0', p), MobileGameHandler)
        PORT = p
        break
    except OSError:
        continue

if httpd:
    print(f"Crystal Gems! Mobile Server running on port {PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
