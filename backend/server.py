from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import os
from werkzeug.utils import secure_filename
from google import genai

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = '../assets/uploads/'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect('../db/dekho.db')
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username, email, password = data['username'], data['email'], data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                       (username, email, hash_password(password)))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Username or email already exists."}), 409
    finally:
        conn.close()

@app.route('/update_profile/<int:user_id>', methods=['POST'])
def update_profile(user_id):
    data = request.form
    image = request.files.get('image')
    interests = data.get('interests')
    
    image_path = None
    if image and image.filename != '':
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET img_url = ?, interests = ? WHERE id = ?",
                       (image_path, interests, user_id))
        conn.commit()
        print(interests)
        return jsonify({"message": "Profile updated successfully!"}), 200
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username, password = data['username'], data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, img_url, interests FROM users WHERE username = ? AND password_hash = ?",
                   (username, hash_password(password)))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify(dict(user)), 200
    else:
        return jsonify({"message": "Invalid credentials."}), 401

@app.route('/create_group', methods=['POST'])
def create_group():
    data = request.json
    name, description = data['name'], data['description']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO groups (name, description) VALUES (?, ?)", (name, description))
    conn.commit()
    conn.close()

    return jsonify({"message": "Group created successfully!"}), 201

@app.route('/join_group', methods=['POST'])
def join_group():
    data = request.json
    user_id, group_id = data['user_id'], data['group_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)", (user_id, group_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Joined group successfully!"}), 200

@app.route('/group_members/<int:group_id>', methods=['GET'])
def group_members(group_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT u.id, u.username, u.email FROM users u JOIN user_groups ug ON u.id = ug.user_id WHERE ug.group_id = ?", (group_id,))
    members = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(member) for member in members]), 200

@app.route('/create_plan', methods=['POST'])
def create_plan():
    data = request.json
    name, budget, currency, start_date, end_date, ref_id = data['name'], data['budget'], data['currency'], data['start_date'], data['end_date'], data['ref_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO plans (name, budget, currency, start_date, end_date, ref_id) VALUES (?, ?, ?, ?, ?, ?)",
                   (name, budget, currency, start_date, end_date, ref_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Plan created successfully!"}), 201

if __name__ == '__main__':
    client = genai.Client(api_key="AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4")
    response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents=["""
              languagePreferences: ${languagePreferences}
              specialInterests: ${specialInterests}
              travelDates: ${travelDates}
              preferredDestinations: ${preferredDestinations}
              travelPurpose: ${travelPurpose},
              insuranceDetails: ${insuranceDetails}
              groupSize: ${groupSize}
              accommodationType: ${accommodationType}
              accommodationAddress: ${accommodationAddress}
              accommodationName: ${accommodationName}
              accommodationPrice: ${accommodationPrice}
              transportationType: ${transportationType}
              transportationDetails: ${transportationDetails}
              weather
              
                 
              itenary generated json format :
              [
                       {
            "activities": [
              {
                "type": "activity | transportation |accomodation | dine",
                "name": "${Name}",
                "time": "${Time}",
                "description": "${Description}",
                "location": "${Location}",
                "estimatedCost": "${estimatedCost}",
                "duration": "${duration}",
                "notes": "${Notes}" for activity give type :adventurous,relaxing etc , for accomodation write hotel motel or resort for transportation give train bus or car or flight, for dine write cuisine or type eg resturant or cafe and rating,
                url: "${url}",
              },
              ...
            ],
          "daySummary": "${dayNotes}"
          },...
                  
              ],
            
              """],)
    print(response.text)
    app.run(debug=True)
