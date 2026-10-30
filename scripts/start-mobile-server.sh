#!/usr/bin/env bash
# ==============================================================================
# CRYSTAL GEMS! — MOBILE SERVER & QR CODE LAUNCHER
# Run this on Linux Mint to install the game directly on your Android / Xiaomi phone!
# ==============================================================================

# Ensure script runs from its directory regardless of where it is invoked
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR" || exit 1

PORT=8080
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -z "$IP" ]; then
  IP="127.0.0.1"
fi

PORTAL_URL="http://${IP}:${PORT}/"
APK_URL="http://${IP}:${PORT}/crystal-gems.apk"
DOWNLOAD_URL="http://${IP}:${PORT}/download"

echo ""
echo "============================================================================"
echo "  🌟 CRYSTAL GEMS! — DIRECT APK INSTALLER & MOBILE PORTAL 🌟"
echo "============================================================================"
echo ""
echo "  📱 SCAN TO OPEN MOBILE INSTALLER & DOWNLOAD APK TO PHONE:"
echo ""

python3 -c "
import sys
try:
    import qrcode
    # 1. Print terminal ASCII QR code
    qr = qrcode.QRCode(border=1)
    qr.add_data('$PORTAL_URL')
    qr.print_ascii(invert=True)

    # 2. Save high-resolution PNG image file
    qr_img = qrcode.QRCode(border=2, box_size=10)
    qr_img.add_data('$PORTAL_URL')
    img = qr_img.make_image(fill_color='black', back_color='white')
    img.save('qr-code.png')
except Exception as e:
    pass
"

echo ""
echo "  🔗 MOBILE PORTAL URL:"
echo "     $PORTAL_URL"
echo ""
echo "  📲 DIRECT APK DOWNLOAD URL:"
echo "     $APK_URL"
echo ""
echo "  📷 QR Code Image: Saved to 'qr-code.png' in this folder!"
echo ""
echo "----------------------------------------------------------------------------"
echo "  ⭐ HOW TO INSTALL DIRECT APK ON YOUR PHONE:"
echo "----------------------------------------------------------------------------"
echo "  1. Scan the QR code or open the link on your Xiaomi / Android phone."
echo "  2. Tap 📲 'INSTALL APK (CRYSTAL-GEMS.APK)'."
echo "     -> Crystal-Gems.apk downloads directly to your phone!"
echo "  3. Tap the downloaded file in your notification bar or File Manager ➔ Downloads."
echo "  4. Tap 'Install'. (Allow 'Install unknown apps' if prompted by Xiaomi/MIUI)."
echo "  5. Crystal Gems! is now installed as a native app on your phone home screen!"
echo "  6. YOU CAN NOW TURN OFF THIS PC TERMINAL! The game runs completely offline."
echo "============================================================================"
echo "  Serving installer on port $PORT... Press Ctrl+C when done downloading."
echo "============================================================================"
echo ""

python3 mobile-server.py $PORT
