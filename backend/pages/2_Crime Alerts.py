import streamlit as st
import requests
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from geopy.distance import geodesic
import json
# from components.sos_button import sos_button
# sos_button()

# Function to get location
def get_ip_location():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()
        lat, lon = map(float, data["loc"].split(","))
        return lat, lon
    except:
        return 19.205992, 72.874264  # Default to Mumbai, India

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")  # Replace with Firebase credentials
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Fetch crime data from Firebase
def fetch_crime_data():
    crimes_ref = db.collection("Crime")
    docs = crimes_ref.stream()
    return [doc.to_dict() for doc in docs]

# Find the nearest crime
def find_nearest_crime(lat, lon, crime_data):
    nearest_crime = None
    min_distance = float("inf")
    
    for crime in crime_data:
        crime_lat = crime.get("Latitude")
        crime_lon = crime.get("Longitude")
        
        if crime_lat is not None and crime_lon is not None:
            distance = geodesic((lat, lon), (crime_lat, crime_lon)).km
            if distance < min_distance:
                min_distance = distance
                nearest_crime = crime
    
    return nearest_crime, min_distance

# Chrome notification & mobile alert
def send_chrome_notification(title, message):
    notification_script = f"""
    <script>
        function isMobile() {{
            return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        }}

        if ("Notification" in window) {{
            if (Notification.permission === "granted") {{
                new Notification("{title}", {{ body: "{message}" }});
            }} else if (Notification.permission !== "denied") {{
                Notification.requestPermission().then(permission => {{
                    if (permission === "granted") {{
                        new Notification("{title}", {{ body: "{message}" }});
                    }}
                }});
            }}
        }}

        if (isMobile()) {{
            alert("{message}");
        }}
    </script>
    """
    st.components.v1.html(notification_script)

# Main function
def main():
    st.markdown("<h1 style='text-align: center; color: #FF4B4B;'>🚨 Crime Alert System 🚨</h1>", unsafe_allow_html=True)
    st.markdown("<h5 style='text-align: center;'>Check nearby crime reports based on your location 📍</h5>", unsafe_allow_html=True)

    st.markdown("---")

    # Custom styling
    st.markdown("""
        <style>
        div.stButton > button:first-child {
            background-color: #FF4B4B;
            color: white;
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            font-size: 18px;
        }
        </style>
    """, unsafe_allow_html=True)

    # Button to get crime data
    if st.button("📌 Find My Location & Crime Data", key="crime_btn"):
        location = get_ip_location()
        if location:
            lat, lon = location

            st.success(f"✅ Location Found: **{lat:.7f}, {lon:.7f}**")
            
            # Display map
            df = pd.DataFrame([[lat, lon]], columns=['lat', 'lon'])
            st.map(df)

            # Fetch crime data
            crime_data = fetch_crime_data()
            nearest_crime, distance = find_nearest_crime(lat, lon, crime_data)

            if nearest_crime:
                st.subheader("🔍 Nearest Crime Report")
                
                with st.expander("📌 Crime Details"):
                    st.write(f"**🛑 Crime Type:** {nearest_crime['crime_type']}")
                    st.write(f"**📜 Description:** {nearest_crime['description']}")
                    st.write(f"**📍 Location:** {nearest_crime['Landmark']} ({nearest_crime['Latitude']}, {nearest_crime['Longitude']})")
                    st.write(f"**📏 Distance:** {distance:.2f} km away")

                # Send notification
                notification_message = f"There was {nearest_crime['crime_type']} in {nearest_crime['Landmark']} on {nearest_crime['date_time']}. Stay alert!"
                send_chrome_notification("Crime Alert", notification_message)

                st.toast("🚨 Crime Alert Sent!", icon="⚠️")

            else:
                st.error("⚠️ No recent crime reports in your area.")
        else:
            st.error("❌ Unable to retrieve your location.")

if __name__ == "__main__":
    main()
