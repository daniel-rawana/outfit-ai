from PIL import Image

#RESOLUTION
image_path = "testing\image.jpg" 
img = Image.open(image_path)

width, height = img.size
print(f"Image Resolution: {width}x{height} pixels")



#
import cv2
import numpy as np
from PIL import Image

def check_sharpness(image_path, threshold=100):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()        #Sharpness measure
    print(f"Sharpness Score: {laplacian_var}")

    if laplacian_var < threshold:                           # Determine if the image is blurry
        print("❌ Image is blurry")
    else:
        print("✅ Image is sharp")

# Test on an image
image_path = "testing\image.jpg" 
check_sharpness(image_path)
