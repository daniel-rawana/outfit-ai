from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({"message": "Flask backend is running!"})

if __name__ == '__main__':
    app.run(debug=True)

