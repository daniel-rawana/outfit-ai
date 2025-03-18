import os
from supabase import create_client, Client
from dotenv import load_dotenv
from clip_classifier import classify
import base64

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




