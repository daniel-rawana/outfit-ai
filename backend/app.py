from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  


# User routes
@app.route('/users/register', methods=['POST'])
def register_user():
    try:
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/users/login', methods=['POST'])
def login_user():
    try:
        return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Wardrobe routes
@app.route('/wardrobe', methods=['GET'])
def get_wardrobe():
    try:
        return jsonify({"items": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/wardrobe/items', methods=['POST'])
def add_clothing():
    try:
        return jsonify({"message": "Clothing item added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Outfit generation route
@app.route('/outfits/generate', methods=['POST'])
def generate_outfit():
    try:
        return jsonify({"outfit": {}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/outfits', methods=['GET'])
def get_outfits():
    try:
        return jsonify({"outfits": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)