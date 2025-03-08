import pandas as pd
import os
import zipfile
from PIL import Image
from io import BytesIO



# Dataset
metadata_path = "/kaggle/input/fashion-product-images-dataset/fashion-dataset/styles.csv"
df = pd.read_csv(metadata_path, on_bad_lines="skip")

# Categories to filter
allowed_categories = ["Apparel", "Footwear"]
excluded_subcategories = ['Innerwear', 'Saree', 'Loungewear and Nightwear', 'Apparel Set']

# Filter
df_filtered = df[df["masterCategory"].isin(allowed_categories) & ~df["subCategory"].isin(excluded_subcategories)]

print(f"Filtered dataset contains {len(df_filtered)} items.")

# Images
image_folder = "/kaggle/input/fashion-product-images-dataset/fashion-dataset/images/"

# Define limits and target
image_limit = 1500  
images_per_zip = 500  
target_width = 1024  


valid_images = 0  
zip_counter = 1 
zipf = None  

# Process images and create multiple ZIPs
for index, row in df_filtered.iterrows():
    if valid_images >= image_limit:
        break  

    # Create a new zip file every 500 images
    if valid_images % images_per_zip == 0:
        if zipf:
            zipf.close()  
        zip_filename = f'/kaggle/working/filtered_img_dataset_{zip_counter}.zip'  # Define zip file name
        zipf = zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED)  # Create a new zip file
        zip_counter += 1  

    img_filename_base = f"{row['id']}"  
    img_found = False  

    
    for ext in ['.jpg', '.jpeg', '.png']:       # Check extensions (.jpg, .jpeg, .png)
        img_filename = img_filename_base + ext
        img_path = os.path.join(image_folder, img_filename)
        
        # If image found, resize and add to the ZIP file
        if os.path.exists(img_path):
            try:
                img = Image.open(img_path)

                width, height = img.size        # Maintain aspect ratio
                target_height = int(target_width * height / width)  

                # Resize image
                img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

                # Save the resized image as JPEG into a BytesIO object
                img_byte_arr = BytesIO()
                img_resized.save(img_byte_arr, format='JPEG', quality=85)  
                img_byte_arr.seek(0) 

                # Add resized image to the ZIP file
                zipf.writestr(img_filename, img_byte_arr.read())
                valid_images += 1  
                img_found = True  
                break  

            except Exception as e:
                print(f"Error processing image {img_filename}: {e}")

    if not img_found:
        print(f"Image not found: {img_filename_base} (Checked extensions: ['.jpg', '.jpeg', '.png'])")

    # To verify how many images we have added
    if valid_images % images_per_zip == 0:
        print(f"Created ZIP file {zip_counter - 1} with {valid_images} images.")

# Close the last zip file if it's still open
if zipf:
    zipf.close()

print(f"Created {zip_counter - 1} zip files with a total of {valid_images} valid images.")  # To verify
