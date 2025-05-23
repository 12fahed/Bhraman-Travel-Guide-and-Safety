from flask import Flask, render_template, Response, jsonify
import cv2
import firebase_admin
from firebase_admin import credentials, firestore
import geocoder
from datetime import datetime
import uuid
from ultralytics import YOLO
import json
import requests

app = Flask(__name__)

# Initialize YOLO
model = YOLO('yolov8n.pt')

# Initialize Firebase
cred = credentials.Certificate("config/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Global variable to track alert status
alert_data = None

# def get_location():
#     g = geocoder.ip('me', key="304f4402c3c242")
#     return {
#         'latitude': str(g.lat),
#         'longitude': str(g.lng),
#         'address': g.address
#     }
    
def get_location():
    API_KEY = "e27447e4894c36101d030012f913c23c"
    response = requests.get(f"http://api.ipstack.com/check?access_key={API_KEY}")
    data = response.json()
    
    return {
        'latitude': str(data['latitude']),
        'longitude': str(data['longitude']),
        'address': data.get('city', '') + ', ' + data.get('region_name', '') + ', ' + data.get('country_name', '')
    }

def process_frame(frame):
    results = model(frame, classes=[0])
    result = results[0]
    
    overlay = frame.copy()
    person_count = len(result.boxes)
    
    for box in result.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        conf = float(box.conf[0])
        
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        conf_text = f'{conf:.2f}'
        cv2.putText(frame, conf_text, (x1, y1-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    count_bg = cv2.rectangle(overlay, (10, 10), (300, 100), (0, 0, 0), -1)
    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)
    cv2.putText(frame, f'People Count:', (20, 45),
               cv2.FONT_HERSHEY_DUPLEX, 1, (255, 255, 255), 2)
    cv2.putText(frame, str(person_count), (20, 85),
               cv2.FONT_HERSHEY_DUPLEX, 1.5, (0, 255, 0), 2)
    
    return frame, person_count

def generate_frames():
    global alert_data
    camera = cv2.VideoCapture(0)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    while True:
        success, frame = camera.read()
        if not success or alert_data is not None:
            camera.release()
            break
        
        processed_frame, person_count = process_frame(frame)
        
        if person_count >=100:
            location = get_location()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            alert_info = {
                'latitude': location['latitude'],
                'longitude': location['longitude'],
                'timestamp': timestamp,
                'address': location['address'],
                'issue': 'large crowd gathered',
                'resolved': False,
                'count': person_count
            }
            
            # Update Firebase
            doc_ref = db.collection('EmergencyIOT').document(str(uuid.uuid4()))
            doc_ref.set(alert_info)
            
            # Set global alert data
            alert_data = alert_info
            
            # Release camera
            camera.release()
            break
        
        ret, buffer = cv2.imencode('.jpg', processed_frame)
        frame = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/check_alert')
def check_alert():
    return jsonify({"alert": alert_data})

@app.route('/reset_alert')
def reset_alert():
    global alert_data
    alert_data = None
    return jsonify({"status": "reset"})

if __name__ == '__main__':
    app.run(debug=False)