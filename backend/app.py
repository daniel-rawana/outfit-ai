from flask import Flask, jsonify, request
from flask_cors import CORS
from clip_classifier import classify

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
@app.route('/wardrobe', methods=['GET'])
def get_wardrobe():
    try:
        # wardrobe logic (gets the entire wardrobe for the user) need more input from the ai/ml team in order to implement this
        # 1. Get user ID from auth token
        # 2. Fetch user's wardrobe from database
        # 3. Format items for response
        # 4. Return wardrobe items

        return jsonify({"items": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/wardrobe/items', methods=['POST'])
def add_clothing():
    try:
        # add clothing logic (adds a single clothing item to the user's wardrobe)
        # 1. Get user ID from auth token
        # 2. Get clothing data from request
        # 3. Handle image upload if present (depending on what the ai/ml team does, we could allow a user to choose a clothing item from the database,
        #                                   in addition to uploading their own)
        # 4. Save clothing item to database
        # 5. Return success with item details

        image_files = request.files.getlist('images')
        classifications = []

        for image in image_files:
            classifications.append(classify(image))

        return jsonify({"message": classifications}), 201
    except Exception as e:
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