from flask import Flask, send_file, request, jsonify, Response, url_for
from flask_cors import CORS
from threading import Thread
from sentence_transformers import SentenceTransformer, util
from gradio_client import Client
import shutil
import cv2 as cv
import gradio, gradio_client
from dotenv import load_dotenv
from pymongo import MongoClient
import os
import json
import string
import random
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
    
    temp = img_url
    camera = False
    if img_url is None:
        cap = cv.VideoCapture(0)
        camera = True
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return None

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to capture image.")
                break

            cv.imshow('Camera', frame)
            key = cv.waitKey(1)   
            if key % 256 == 32:  
                img_url = generate_random_string() + '.png'
                temp = img_url
                relative_url = "./images/" + img_url
                cv.imwrite(relative_url, frame)
                img_url = relative_url
                print(f"Image saved to {relative_url}")
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
    
    #adjust_path(result1, "output_segmented")
    #adjust_path(result2, "output_mvs")
    #adjust_path(result3[0], "output_grayscale_mesh")
    #adjust_path(result3[1], "output_colored_mesh")
    img_url = temp
    shutil.move(result1, r"../client/public/Images/meshes/segmented.png")
    shutil.move(result2, r"../client/public/Images/meshes/mvs.png")
    shutil.move(result3[0], r"../client/public/Images/meshes/gray_mesh.obj")
    shutil.move(result3[1], r"../client/public/Images/meshes/color_mesh.glb")
    if camera:
        shutil.copy(r"../client/public/Images/meshes/color_mesh.glb", r"../client/public/Images/collection/" + img_url + r".glb")
        shutil.copy(r"../client/public/Images/meshes/gray_mesh.obj", r"../client/public/Images/collection/" + img_url + r".obj")
    else:
        shutil.copy(r"../client/public/Images/meshes/color_mesh.glb", r"../client/public/Images/collection/" + url + r".glb")
        shutil.copy(r"../client/public/Images/meshes/gray_mesh.obj", r"../client/public/Images/collection/" + url + r".obj")

    urls_collection.insert_one({"url": url})
    user = users_collection.find_one_and_update(
        {"email": email},
        {"$addToSet": {"files": url}},
        upsert=True
    )
    print(email)
    print(url)
    return jsonify({'img_url': img_url, 'url': url})
    
load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Successfully connected"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return 'No file part', 400
    file = request.files['image']
    #print(file)
    if file.filename == '':
        return 'No selected file', 400
    
    # Generate a random string for the file name
    random_string = generate_random_string()
    file_extension = os.path.splitext(file.filename)[1]
    random_filename = random_string + file_extension

    # Save or process the file
    upload_folder = os.path.join(app.root_path, 'images')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, random_filename)
    #print(file_path)
    file.save(file_path)
    if file_extension.lower() == ".obj":
        shutil.copy(file_path, r"../client/public/Images/meshes/" + random_filename)
    else:
        shutil.copy(file_path, r"../client/public/Images/user/" + random_filename)
    return jsonify({'message': 'File uploaded successfully', 'file_name': random_filename})


@app.route("/gen2d/<string:url>/<string:email>", methods=["POST"])
def create_2d(url: str, email: str) -> int:
    relativeUrl = "./images/" + url.replace("-", " ")
    #print(url)
    code = generate_mesh(relativeUrl, url, email)
    print("Entered Function")
    if code == None:
        return 1
    return code

@app.route("/genLive/<string:email>", methods=["POST"])
def create_live(email) -> None:
    code = generate_mesh(email=email)
    if code == None:
        return 1
    return code


@app.route("/get/<string:filename>")
def getImage(filename: str) -> Response:
    return send_file(f"images/{filename}")

@app.route("/add/speckle/<string:url>/<string:auth_token>/<string:stream_name>", methods=["POST"])
def send(url: str, auth_token: str, stream_id: str=None, stream_name: str=None) -> None:
    print("auth token" + auth_token)
    print("stream name" + stream_name)
    client = SpeckleClient(host="https://speckle.xyz")
    client.authenticate_with_token(auth_token)
    if stream_id == None:
        stream_id = client.stream.create(name=stream_name)
    transport = ServerTransport(client=client, stream_id=stream_id)
    relativeUrl = "./images/" + url.replace("-", " ")

    mesh = trimesh.load(relativeUrl, file_type='obj')
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
    return jsonify({'stream_id': stream_id, 'stream_name': stream_name }), 200

@app.route("/get/speckle/<string:auth_token>/<string:stream_id>", methods=["GET"])
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

@app.route("/generated_colored_mesh/<path:url>")
def serve_colored_image(url: str) -> Response:
    return send_file(f"meshes/color_mesh.glb")

@app.route("/generated_gray_mesh/<path:url>")
def serve_gray_image(url: str) -> Response:
    return send_file(f"meshes/segmented/gray_mesh.glb")

@app.route("/generated_mvs/<path:url>")
def serve_mvs(url: str) -> Response:
    return send_file(f"meshes/segmented/mvs.png")

@app.route("/generated_segmented/<path:url>")
def serve_segmented(url: str) -> Response:
    return send_file(f"meshes/segmented/segmented.png")

@app.route("/get/urls", methods=["GET"])
def get_urls():
    urls = [url_doc['url'] for url_doc in urls_collection.find({}, {'url': 1})]
    return jsonify({"urls":urls})

@app.route("/get/users/size", methods=["GET"])
def get_users_size():
    total_users =  users_collection.count_documents({})
    return jsonify({'users': total_users})

@app.route("/get/urls/size", methods=["GET"])
def get_urls_size():
    total_urls =  urls_collection.count_documents({})
    return jsonify({'urls': total_urls})
    
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
