import streamlit as st
import folium
from streamlit_folium import st_folium
import requests
import pandas as pd
from datetime import datetime
from statsmodels.tsa.statespace.sarimax import SARIMAX
from keras.models import Sequential
# from components.sos_button import sos_button
# sos_button()
# OpenWeatherMap API Key
API_KEY = "5490ea92f1c5ab4314761afeaf0f869a"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

st.set_page_config(page_title="Mumbai Weather", layout="centered")

# Complete CSS styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    /* Overall page styling */
    body {
        font-family: 'Poppins', sans-serif;
        background-color: #F8F2EF !important;
        padding-top: 0px !important;
        margin-top: 0px !important;
        margin-bottom: 0px;
    }
    
    .stApp {
        background-color: #F8F2EF;
    }
    
    /* Remove padding at the top */
    .main .block-container {
        padding-top: 0rem;
        padding-bottom: 0rem;
        max-width: 100%;
    }
    
    /* Hide Streamlit's default header */
    header {
        display: none !important;
    }
    
    /* Style the map container */
    .stfolium-container {
        border-radius: 20px;
        overflow: hidden;
        margin-top: 1rem;
    }
    
    iframe {
        border-radius: 20px !important;
    }
    
    /* Weather container styles */
    .weather-container {
        background: white;
        border-radius: 15px;
        padding: 10px 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 26rem;
        margin: 5px auto;
        padding-top: 0px;
        margin-top: 5px;
        margin-bottom: 20px;
    }
    
    .weather-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 10px;
    }
    
    .temperature-section {
        font-size: 30px;
        font-weight: 600;
        color: #333;
        padding-top: 5px;
    }
    
    .feels-like {
        font-weight: 500;
        font-size: 13px;
        color: #666;
        margin-top: 0px;
    }
    
    .weather-image {
        text-align: center;
    }
    
    .weather-image img {
        margin-top: 10px;
        margin-left: 50px;
        width: 2rem;
        height: 2em;
    }
    
    .humidity-value {
        font-size: 13px;
        color: #666;
        margin-top: 10px;
        margin-bottom: 0px;
        text-align: right;
    }
    
    /* Style subheaders */
    .stSubheader {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        margin-top: 0.5rem;
    }
    
    /* Style the sidebar */
    [data-testid="collapsedControl"] {
        display: none;
    }
    
    /* Style input fields */
    .stTextInput input {
        border-radius: 10px;
    }
    
    /* Hide Streamlit branding */
    
    /* Style the button */
    .custom-button {
        background-color: #FF5733;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        text-align: center;
        margin: 10px auto;
        display: block;
        width: 100%;
        max-width: 200px;
    }
    
    .custom-button:hover {
        background-color: #FF4019;
    }
</style>
""", unsafe_allow_html=True)

def get_weather(city="Mumbai"):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }
    response = requests.get(BASE_URL, params=params)
    return response.json() if response.status_code == 200 else None

def get_weather_image(temp, humidity, precipitation=0):
    if temp > 30 and humidity > 70:
        return "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2FCloudy-removebg-preview.png?alt=media&token=1ec56cd4-5a0e-4275-ae8b-d7d04cd8365e"
    elif temp < 25 and precipitation > 50:
        return "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.apps/o/Fahed%2FRainy-removebg-preview.png?alt=media&token=b7c992ff-0350-4ca8-af7a-251c92ef8000"
    else:
        return "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2Fsunny-removebg-preview.png?alt=media&token=2283921f-624b-4eb1-9d41-fb957d8b4217"

# Function to get user's location based on IP
def get_ip_location():
    try:
        response = requests.get("https://ipinfo.io/json")
        data = response.json()
        lat, lon = map(float, data["loc"].split(","))
        return lat, lon
    except:
        return 19.0760, 72.8777  # Default to Mumbai if lookup fails

# Get user location
lat, lon = get_ip_location()

# Load crime data from CSV
def load_crime_data():
    try:
        df = pd.read_csv("data\data2.csv")
        return df
    except Exception as e:
        st.error(f"Error loading data: {e}")
        return None

crime_data = load_crime_data()

# Create the map
m = folium.Map(location=[lat, lon], zoom_start=12)

if crime_data is not None:
    for _, row in crime_data.iterrows():
        folium.Marker(
            location=[row["Latitude"], row["Longitude"]],
            popup=f"{row['Station']} - {row['crime_type']} ({row['date_time']})",
            icon=folium.Icon(color="red", icon="info-sign")
        ).add_to(m)


# Display weather data
data = get_weather()
if data:
    temp = round(data['main']['temp'])
    humidity = data['main']['humidity']
    feels_like = round(data['main']['feels_like'])
    precipitation = 0  # You might want to get this from a weather API
    
    weather_image = get_weather_image(temp, humidity, precipitation)
    
    st.markdown(f"""
        <div class="weather-container">
            <div class="weather-grid">
                <div class="temperature-section">
                    {temp}°C
                    <div class="feels-like">Feels like {feels_like}°C</div>
                </div>
                <div class="weather-image">
                    <img src="{weather_image}" alt="Weather condition">
                    <div class="humidity-value">Humidity: {humidity}%</div>
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    # Add a button to navigate to another page
    if st.button("Go to Weather Forecast", key="weather_forecast_button", help="Click to view detailed weather forecast"):
        st.switch_page("weatherforcast.py")  # Link to the new page
else:
    st.error("Unable to fetch weather data for Mumbai")

# Display map
st.subheader("Danger Zone Map")
st_folium(m, width=700, height=400)

# Sidebar for search and route planning
with st.sidebar:
    st.header("Search")
    search_query = st.text_input("Enter location")
    
    st.header("Plan Route")
    from_location = st.text_input("From")
    to_location = st.text_input("To")

# Main page route finder
st.markdown("""
    <style>
    .white-container {
        background-color: white;
        padding: 20px;
        border: 1px solid #FF9933;
        border-radius: 5px;
        margin: 20px 0;
    }
    </style>
""", unsafe_allow_html=True)

# Start the white container
st.markdown('<div class="white-container">', unsafe_allow_html=True)

# Add the Route Finder header and input fields
st.subheader("Route Finder")

col1, col2 = st.columns(2)
with col1:
    st.text_input("From:", value=from_location if from_location else "")
with col2:
    st.text_input("To:", value=to_location if to_location else "")

st.write("Enter locations to plan a safe route.")

# Close the white container
st.markdown('</div>', unsafe_allow_html=True)