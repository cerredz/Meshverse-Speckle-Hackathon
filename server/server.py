from flask import Flask, send_file, request, jsonify, Response, url_for
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os
import json
import string
import random

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection string from environment variable
mongo_uri = os.getenv('MONGODB_CONNECTION_STRING')
mongoClient = MongoClient(mongo_uri)
db = mongoClient.get_database()
urls_collection = db["urls"]
users_collection = db["users"]

def generate_random_string(length=12):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

# returns the 3d meshes filename
@app.route("/get/urls", methods=["GET"])
def get_urls():
    urls = [url_doc['url'] for url_doc in urls_collection.find({}, {'url': 1})]
    return jsonify({"urls":urls})

# returns the total users signed up
@app.route("/get/users/size", methods=["GET"])
def get_users_size():
    total_users =  users_collection.count_documents({})
    return jsonify({'users': total_users})

# returns the total 3d meshes generated
@app.route("/get/urls/size", methods=["GET"])
def get_urls_size():
    total_urls =  urls_collection.count_documents({})
    return jsonify({'urls': total_urls})
    
# check if the passed in email exists in the database, if not we create a new user with the passed in email
@app.route("/check/user", methods=["POST"])
def check_user():
    data = request.get_json()
    email = data.get('email')
    image = data.get('image')
    print(data)

    if email:
        existing_user = users_collection.find_one({"email": email})
        print(existing_user)
        if existing_user:
            existing_user['_id'] = str(existing_user['_id'])
            # User exists, return the user data
            return jsonify(existing_user), 200

        else:
            new_user = {
                "email": email,
                "username": email.split("@")[0], 
                "image": image, 
                "files": []  
            }
            new_user_id = users_collection.insert_one(new_user).inserted_id
            new_user['_id'] = str(new_user_id)  # Convert ObjectId to string
            print("Created new user", new_user)
            return jsonify(new_user), 201
    else:
        return jsonify({"message": "No email provided"}), 400
    
@app.route("/get/user/<string:username>", methods=["GET"])
def get_user(username: str):
    user = users_collection.find_one({"username": username})

    if user:
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    else:
        return jsonify({"message": "could not find user with username " +  username}), 404