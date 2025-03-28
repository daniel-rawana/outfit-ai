import os
from supabase import create_client, Client
from dotenv import load_dotenv
from clip_classifier import classify
import base64
from PIL import Image
import io

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def add_image_with_items(image_path):
    try: 
        # Read image file as binary data
        with open(image_path, 'rb') as img_file:
            image_binary = img_file.read()

        # Convert binary data to Base64 String
        base64_encoded = base64.b64encode(image_binary).decode('utf-8')

        # Get image filename
        image_name = os.path.basename(image_path)

        # Classify image using CLIP
        categories = classify(image_path)

        # Execute insertion query of categories into the database
        items_response = supabase.table("clothing_items").insert(categories).execute()
        clothing_id = items_response.data[0]["id"]

        # Insert the image with reference to lothing_items
        image_record = {
            "clothing_id": clothing_id,
            "image_data": base64_encoded,
            "image_name": image_name,
            "user_id": 1 #FIXME: Implement user_id features
        }
        image_response = supabase.table("clothing_images").insert(image_record).execute()

        print("Succesfully inserted")
        return {
            "item_id": clothing_id,
            "image_id": image_response.data[0]["id"]
        }
    except Exception as e:
        print(f"Error inserting into database: {e}")
        return None

#FIXME: Implement function to decode images back to binary when retrieving them from the database
user_id = 1

def get_clothing_data(user_id):
    print("🚀 Fetching clothing_images with joined clothing_items...")

    response = (
        supabase
        .table("clothing_images")
        .select("user_id, clothing_id, image_data, clothing_items(*)")
        .eq("user_id", user_id)
        .execute()
    )

    for row in response.data:
        # Decode BYTEA hex
        hex_str = row["image_data"]
        if hex_str.startswith("\\x"):
            hex_str = hex_str[2:]
        binary_data = bytes.fromhex(hex_str)

        print("--- Combined Result ---")
        print(f"user_id: {row['user_id']}\nclothing_id: {row['clothing_id']}")
        print(f"image_data (first 20 bytes): {binary_data[:20]}")

        metadata = row.get("clothing_items")
        if metadata:
            print(f"main_category: {metadata['main_category']}\ncolor: {metadata['color']}\nseason: {metadata['season']}"
                  f"\nsub_category: {metadata['sub_category']}\npattern: {metadata['pattern']}\noccasion: {metadata['occasion']}"
                  f"\nsilhouette: {metadata['silhouette']}\nstyle: {metadata['style']}\n")
        else:
            print("⚠️ No metadata found for this image.")
        print()

    return response.data

if __name__ == "__main__":
    get_clothing_data(user_id)






