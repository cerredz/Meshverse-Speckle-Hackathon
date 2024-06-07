from flask import Flask, send_file, request, jsonify, Response, url_for
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from gradio_client import Client
import gradio, gradio_client
import os
import json
import string
import random
import cv2 as cv
import shutil
client = Client("TencentARC/InstantMesh") 

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

def adjust_path(s: str, name: str) -> str:
    temp = ''
    for t in s.split('\\'):
        if len(t) > 35:
            temp = t
    result =  s.replace(temp, name)
    os.makedirs(os.path.dirname(result), exist_ok=True)
    os.rename(s, result)
    shutil.rmtree(s[:(s.find(temp)+len(temp))])
    return result

def generate_mesh(img_url: str=None, url: str=None,email: str=None) -> None:
    if img_url is None:
        cap = cv.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            cv.imshow('Camera', frame)
            key = cv.waitKey(1)   
            if key % 256 == 32:  
                img_url = 'captured_image.jpg'
                cv.imwrite(img_url, frame)
                print(f"Image saved to {img_url}")
            elif key % 256 == ord('q'):
                break
        cap.release()
        cv.destroyAllWindows()

    result1 = client.predict(
      input_image = gradio_client.file(img_url),
      do_remove_background=True,
      api_name="/preprocess"
    )
    print("Stage 1 Complete | Generated Segmented Image")

    result2 = client.predict(
      input_image= gradio_client.file(result1),
      sample_steps=75,
      sample_seed=42,
      api_name="/generate_mvs"
    )
    print("Stage 2 Complete | Generated Multi-View Image")

    result3 = client.predict(
            api_name="/make3d"
    )
    print("Stage 3 Complete | Generated 3D Mesh-Image")

    urls_collection.insert_one({"url": url})
    user = users_collection.find_one_and_update(
        {"email": email},
        {"$addToSet": {"files": url}},
        upsert=True
    )
    print(email)
    print(url)
    return "Generated Images Successfully"

@app.route("/gen2d/<string:url>", methods=["POST"])
def create_2d(url: str) -> int:
    code = generate_mesh(url)
    if code == None:
        return 1
    return code

@app.route("/genLive", methods=["POST"])
def create_live() -> None:
    code = generate_mesh()
    if code == None:
        return 1
    return code

@app.route("/generated_colored_mesh/<path:url>")
def serve_colored_image(url: str) -> Response:
    return send_file(f"")

@app.route("/generated_gray_mesh/<path:url>")
def serve_gray_image(url: str) -> Response:
    return send_file(f"")

@app.route("/generated_mvs/<path:url>")
def serve_mvs(url: str) -> Response:
    return send_file(f"")

@app.route("/generated_segmented/<path:url>")
def serve_segmented(url: str) -> Response:
    return send_file(f"")

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
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)