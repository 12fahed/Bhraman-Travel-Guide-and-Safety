import streamlit as st
import firebase_admin
from firebase_admin import credentials, firestore
import uuid
import requests
from datetime import datetime
from components.sos_button import sos_button
sos_button()

# Initialize Firebase (Ensure this runs only once)
if not firebase_admin._apps:
    cred = credentials.Certificate("tsechacks.json")  # Adjust the path if needed
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to get user's location based on IP
def get_ip_location():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()
        lat, lon = map(float, data["loc"].split(","))
        return lat, lon
    except:
        return 22.5726, 88.3639  # Default to Kolkata if lookup fails

# Function to send emergency alert
def send_emergency_alert(latitude, longitude):
    emergency_data = {
        "aadharCardNo": "1234543456543",
        "location": {
            "latitude": str(latitude),
            "longitude": str(longitude),
        },
        "phoneNo": "3443434343",
        "resolved": False,
        "time": datetime.now().isoformat(),
    }

    unique_id = str(uuid.uuid4())
    db.collection("Emergency").document(unique_id).set(emergency_data)
    return unique_id

# Function to create the SOS button
def sos_button():
    lat, lon = get_ip_location()  # Get the user's location

    if st.button("Send SOS", type="primary"):
        try:
            unique_id = send_emergency_alert(lat, lon)
            st.success(f"Emergency alert sent successfully!")
        except Exception as e:
            st.error(f"Error sending alert: {e}")

sos_button()