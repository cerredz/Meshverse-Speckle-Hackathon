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
import trimesh
from specklepy.api.client import SpeckleClient
from specklepy.transports.server import ServerTransport
from specklepy.objects import Base
from specklepy.objects.geometry import Mesh
from specklepy.api import operations
from typing import Any, Dict
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

@app.route("/add/speckle/<string:url>/<string:auth_token>/<string:stream_id>/string:<stream_name>/")
def send(url: str, auth_token: str, stream_id: str=None, stream_name: str=None) -> None:
    client = SpeckleClient(host="https://speckle.xyz")
    client.authenticate_with_token(auth_token)
    if stream_id == None:
        stream_id = client.stream.create(name=stream_name)
    transport = ServerTransport(client=client, stream_id=stream_id)

    mesh = trimesh.load(url, file_type='obj')
    verts = mesh.vertices
    faces = mesh.faces
    if hasattr(mesh.visual, 'vertex_colors') and mesh.visual.vertex_colors is not None:
        colors = mesh.visual.vertex_colors[:, :3]
    def rgb_to_int(red, green, blue):
        return (red << 16) | (green << 8) | blue
    verts = verts.flatten().tolist()
    faces = faces.flatten().tolist()
    faces_appended = []
    for i in range(0, len(faces), 3):
        faces_appended.append(0)      
        faces_appended.extend(faces[i:i+3])
    faces = faces_appended
    colors = [int(rgb_to_int(c[0],c[1],c[2])) for c in colors]

    mesh_base = Mesh()
    mesh_base['vertices'] = verts
    mesh_base['faces'] = faces
    mesh_base['colors'] = colors
    base = Base()
    base['@displayValue'] = mesh_base

    hash = operations.send(base=base, transports=[transport])
    commid_id = client.commit.create(
        stream_id=stream_id, 
        object_id=hash, 
        message="3d Mesh added to Speckle",
    )

@app.route("/add/speckle/<string:auth_token>/<string:stream_id>")
def receive(auth_token: str, stream_id: str) -> Dict[str, Any]:
    data = {}
    client = SpeckleClient(host="https://speckle.xyz")
    client.authenticate_with_token(auth_token)
    transport = ServerTransport(client=client, stream_id=stream_id)
    stream = client.stream.get(stream_id)

    temp = {}
    temp['stream_id'] = stream_id
    temp['stream_name'] = stream.name
    temp['stream_owner'] = stream.collaborators[0].name
    temp['description'] = stream.description
    data['stream_info'] = temp
    
    temp = {}
    branches = client.branch.list(stream_id)
    for branch in branches:
        b = {}
        b['branch_id'] = branch.id
        b['branch_name'] = branch.name
        b['branch_description'] = branch.description
        b['num_commits'] = branch.commits.totalCount
        for commit in branch.commits.items:
            c = {}
            c['commit_id'] = commit.id
            c['commit_author'] = commit.authorName
            c['commit_time'] = str(commit.createdAt)
            b[f'commit-{commit.id}'] = c
        temp[f'branch-{branch.name}'] = b  
    data['branch_info'] = temp

    temp = {}
    obj_id = branches[0].commits.items[0].referencedObject
    base = operations.receive(obj_id=obj_id, remote_transport=transport)
    temp['object_id'] = base.id
    mesh = base['@displayValue']
    temp['num_vertices'] = len(mesh.vertices)
    temp['num_faces'] = len(mesh.faces)
    temp['num_colors'] = len(mesh.colors) 
    data['current_object_info'] = temp
    return json.dumps(data, indent=2)

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