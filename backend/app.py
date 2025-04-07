import os
from supabase import create_client, Client
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from clip_classifier import classify
from PIL import Image
import io
import base64

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
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
        # wardrobe logic (gets the entire wardrobe for the user) need more input from the ai/ml team in order to implement this
        # 1. Get user ID from auth token
        # 2. Fetch user's wardrobe from database
        # 3. Format items for response
        # 4. Return wardrobe items

        # return list of clothing items + classifications pulled from database
        wardrobe = []
        response = (
            supabase
            .table("clothing_images")
            .select("user_id, clothing_id, image_data, clothing_items(*)")
            .eq("user_id", user_id)
            .execute()
        )   

        
        


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

            # Insert the image with reference to lothing_items
            image_record = {
                "clothing_id": clothing_id,
                "image_data": imgData,
                "image_name": "",
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
        # outfit generation logic (generates an outfit for the user based on their preferences)
        # no idea what this will look like

        return jsonify({"outfit": {}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/outfits', methods=['GET'])
def get_outfits():
    try:
        # get saved outfit logic (gets all the outfits that the user has saved)
        # not sure if we'll be allowing users to save outfits

        return jsonify({"outfits": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)