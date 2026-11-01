from PIL import Image

# Create multi-resolution icon from icon-512.png
img = Image.open('icon-512.png')
# Standard Windows icon sizes: 16, 24, 32, 48, 64, 128, 256
img.save('scratch/CrystalGems.ico', format='ICO', sizes=[(16,16), (24,24), (32,32), (48,48), (64,64), (128,128), (256,256)])
print('CrystalGems.ico generated successfully!')
