import os
from supabase import create_client, Client
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from clip_classifier import classify
from PIL import Image
import io
import base64
import uuid
from clothing import Clothing
from outfit_generator import generate_ranked_outfits

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
print(url)
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if (Client):
    print("Connected")

app = Flask(__name__)
CORS(app)  


# User routes
@app.route('/users/register', methods=['POST'])
def register_user():
    try:
        # registration logic goes here (idk if we're gonna be allowing for user registration so this could be ignored entirely)
        # 1. get email and password from request
        # 2. validate email format and password strength
        # 3. check if email already exists
        # 4. hash the password
        # 5. save user to database
        # 6. generate auth token
        # 7. return success with token

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/users/login', methods=['POST'])
def login_user():
    try:
        # user login logic (again, this could be ignored entirely if we don't allow for user registration)
        # 1. Get email and password from request
        # 2. Find user by email in database
        # 3. Verify password matches
        # 4. Generate auth token
        # 5. Return success with token

        return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Wardrobe routes
@app.route('/wardrobe/fetch-user-items', methods=['GET'])
def get_wardrobe():
    try:
        
        user_id = 1

        # return list of clothing items + classifications pulled from database
        wardrobe = []

        response = (
            supabase
            .table("clothing_images")
            .select("user_id, clothing_id, image_url, clothing_items(*)")
            .eq("user_id", user_id)
            .execute()
        )   

        # format items for response 
        for row in response.data: 
            clothing_data = row["clothing_items"]
            wardrobe.append({
                "image": row["image_url"],
                "main_category": clothing_data.get("main_category", ""),
                "sub_category": clothing_data.get("sub_category", ""),
                "style": clothing_data.get("style", ""),
                "silhouette": clothing_data.get("silhouette", ""),
                "color": clothing_data.get("color", ""),
                "pattern": clothing_data.get("pattern", ""),
                "season": clothing_data.get("season", ""),
                "occasion": clothing_data.get("occasion", ""),
            })

        # printing purposes only
        print(f"Fetched {len(wardrobe)} items from database. \n" )

        return jsonify(wardrobe), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/wardrobe/classify-clothing', methods=['POST'])
def classify_clothing():
    try:
        # add clothing logic (adds a single clothing item to the user's wardrobe)
        # 1. Get user ID from auth token
        # 2. Get clothing data from request
        # 3. Handle image upload if present (depending on what the ai/ml team does, we could allow a user to choose a clothing item from the database,
        #                                   in addition to uploading their own)
        # 4. Return success with clothing classifications

        images = request.get_json().get("images", []) # base64 images
        classifications = []

        for base64_string in images:
            image_bytes = base64.b64decode(base64_string)
            image = Image.open(io.BytesIO(image_bytes))

            classification = classify(image)
            classification['image'] = base64_string
            classifications.append(classification)

        # printing purposes only
        print("ITEM CLASSIFICATIONS:\n")
        for index, classification in enumerate(classifications):
            classification_copy = classification.copy()
            classification_copy.pop('image', None)
            print(f"Item {index}:\n")
            print(classification_copy)
            print("\n")

        return jsonify({"message": classifications}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/wardrobe/update-classifications', methods=['POST'])
def update_classifications():
    # Update clothing classifications for existing items in database
    try:
        items = request.get_json()

        #update classifications in database

        # printing purposes only
        print("UPDATED ITEMS:\n")
        for index, classification in enumerate(items):
            classification_copy = classification.copy()
            classification_copy.pop('image', None)
            print(f"Item {index}:\n")
            print(classification_copy)
            print("\n")

        return jsonify(items), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/wardrobe/save-clothing-items', methods=['POST'])
def save_clothing_items():
    # Save new items and their classifications to database
    try:
        newItems = request.get_json()

        # save new clothing items and their classifications in database

        # printing purposes only
        print("NEW ITEMS:\n")
        for index, classification in enumerate(newItems):
            classification_copy = classification.copy()
            imgData = classification_copy.pop('image', None)
            print(f"Item {index}:\n")
            print(classification_copy)
            print("\n")

            items_response = supabase.table("clothing_items").insert(classification_copy).execute()
            clothing_id = items_response.data[0]["id"]

            # Convert base64 to binary for storage upload
            if "," in imgData:
                imgData = imgData.split(",")[1]

            image_bytes = base64.b64decode(imgData)

            # create a unique filename
            file_name = f"clothing_{clothing_id}_{uuid.uuid4()}.jpg"
            file_path = f"user_clothes/user_1/{file_name}" # FIXME: Using user_id 1 for now 

            # upload to Supabase Storage
            storage_response = supabase.storage.from_("images").upload(
                file_path,
                image_bytes
            )

            # get the public url 
            image_url = supabase.storage.from_("images").get_public_url(file_path)

            # Insert the image with reference to lothing_items
            image_record = {
                "clothing_id": clothing_id,
                "image_url": image_url,
                "image_name": file_name,
                "user_id": 1 #FIXME: Implement user_id features
            }
            image_response = supabase.table("clothing_images").insert(image_record).execute()
            print(image_response.data[0]["id"])
            print("Success!")

        return jsonify(newItems), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 400

# Outfit generation route
@app.route('/outfits/generate', methods=['POST'])
def generate_outfit():
    try:
        request_data = request.get_json()
        print("GENERATE OUTFIT REQUEST:\n")
        print(request_data)
        print("\n")

        user_id = 1

        response = (
            supabase
            .table("clothing_images")
            .select("user_id, clothing_id, image_url, clothing_items(*)")
            .eq("user_id", user_id)
            .execute()
        )

        clothing_list = []

        for row in response.data:
            metadata = row.get("clothing_items")

            if metadata:
                clothing_list.append(Clothing(
                    row["image_url"], metadata['main_category'], metadata['sub_category'], metadata['style'], metadata['silhouette'],
                    metadata['color'], metadata['pattern'], metadata['season'], metadata['occasion'], row['clothing_id']
                ))
            else:
                print("No metadata found for this image")

        generated_outfits = generate_ranked_outfits(clothing_list, request_data) 

        # printing purposes only
        print("GENERATED OUTFITS:\n")
        for index, outfit in enumerate(generated_outfits):
            print(f"Outfit {index}:\n")
            print(f"Top: {outfit['top']} | Bottom: {outfit['bottom']} | Footwear: {outfit['footwear']} | Score: {outfit['score']}")
            print("\n")

        # Format outfits for frontend
        formatted_outfits = []

        for outfit in generated_outfits:
            formatted_outfit = []       

            # Process each clothing item in the outfit 
            for category, clothing_item in outfit.items():
                if category == "score":
                    continue

                if clothing_item:
                    formatted_outfit.append({
                        "id": clothing_item.id,
                        "image": clothing_item.image_url,
                        "category": category,
                        "main_category": clothing_item.main_category,
                        "sub_category": clothing_item.sub_category,
                        "color": clothing_item.color
                    })

            if formatted_outfit:
                formatted_outfits.append(formatted_outfit)

        return jsonify({"outfit": formatted_outfits}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/outfits', methods=['GET'])
def get_outfits():
    try:
        # get saved outfit logic (gets all the outfits that the user has saved)
        # not sure if we'll be allowing users to save outfits
        
        outfits = []  # This would be populated from the database
        
        # printing purposes only
        print("FETCHED SAVED OUTFITS:\n")
        for index, outfit in enumerate(outfits):
            print(f"Outfit {index}:\n")
            print(outfit)
            print("\n")

        return jsonify({"outfits": outfits}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/outfits/saved', methods=['GET'])
def get_saved_outfits():
    try:
        user_id = 1  # FIXME: Replace with real user ID if login logic is added
        print(f"[INFO] Fetching saved outfits for user_id: {user_id}")

        # Fetch saved outfits for the user
        outfits_response = (
            supabase
            .table("saved_outfits")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        saved_outfits = outfits_response.data
        print(f"[DEBUG] Found {len(saved_outfits)} saved outfits.")

        all_outfits = []

        for outfit in saved_outfits:
            outfit_id = outfit["id"]
            print(f"[INFO] Processing outfit ID: {outfit_id} | Name: {outfit.get('outfit_name')}")

            # Fetch clothing item IDs for this outfit
            items_response = (
                supabase
                .table("outfit_items")
                .select("clothing_item_id")
                .eq("outfit_id", outfit_id)
                .execute()
            )

            clothing_ids = [item["clothing_item_id"] for item in items_response.data]
            print(f"[DEBUG] Outfit {outfit_id} has clothing item IDs: {clothing_ids}")

            # Fetch full clothing item data including image and metadata
            if clothing_ids:
                clothing_response = (
                    supabase
                    .table("clothing_images")
                    .select("clothing_id, image_url, clothing_items(*)")
                    .in_("clothing_id", clothing_ids)
                    .execute()
                )

                clothing_items = []
                for row in clothing_response.data:
                    metadata = row.get("clothing_items", {})
                    clothing_items.append({
                        "id": row["clothing_id"],
                        "image": row["image_url"],
                        "main_category": metadata.get("main_category", ""),
                        "sub_category": metadata.get("sub_category", ""),
                        "color": metadata.get("color", ""),
                        "style": metadata.get("style", ""),
                        "occasion": metadata.get("occasion", ""),
                        "season": metadata.get("season", ""),
                        "silhouette": metadata.get("silhouette", ""),
                        "pattern": metadata.get("pattern", "")
                    })

                print(f"[DEBUG] Fetched {len(clothing_items)} clothing items for outfit ID {outfit_id}")

                all_outfits.append({
                    "id": outfit_id,
                    "name": outfit.get("outfit_name", ""),
                    "items": clothing_items
                })

        print("[SUCCESS] Returning all saved outfits.")
        return jsonify({"outfits": all_outfits}), 200

    except Exception as e:
        print(f"[ERROR] Failed to fetch saved outfits: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/outfits/save', methods=['POST'])
def save_outfit():
    try:
        data = request.get_json()
        outfit_items = data.get("outfit", [])
        outfit_name = data.get("outfit_name", "Untitled Outfit")
        user_id = 1  # TODO: Replace with real user ID when auth is added

        print(f"[INFO] Saving outfit: {outfit_name} with {len(outfit_items)} items.")

        # Insert into saved_outfits table
        outfit_response = supabase.table("saved_outfits").insert({
            "user_id": user_id,
            "outfit_name": outfit_name
        }).execute()

        saved_outfit_id = outfit_response.data[0]["id"]
        print(f"[DEBUG] New outfit ID: {saved_outfit_id}")

        # Insert each clothing item into outfit_items table
        for item in outfit_items:
            clothing_id = item.get("id")
            if clothing_id:
                supabase.table("outfit_items").insert({
                    "outfit_id": saved_outfit_id,
                    "clothing_item_id": clothing_id
                }).execute()
                print(f"[DEBUG] Linked clothing ID {clothing_id} to outfit {saved_outfit_id}")

        print("[SUCCESS] Outfit saved successfully.")
        return jsonify({"message": "Outfit saved successfully"}), 201

    except Exception as e:
        print(f"[ERROR] Failed to save outfit: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)