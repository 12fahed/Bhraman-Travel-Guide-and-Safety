import streamlit as st
import pandas as pd
import google.generativeai as genai  # Gemini API
import time
import json
import re

# Set up Gemini API
GENAI_API_KEY = "AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ"
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-pro")

# Function to get latitude and longitude from Gemini API
def get_lat_lon(landmark, station):
    prompt = (
        f"Find the latitude and longitude for the landmark: {landmark} of {station}. "
        "Provide output in JSON format with keys 'latitude' and 'longitude'. "
        "The 'latitude' and 'longitude' should not be negative."
    )
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if not response_text:
            raise ValueError("Empty response from API")
        
        # Extract JSON using regex in case of extra text
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            response_text = match.group(0)
        
        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            st.error(f"Invalid JSON format received: {response_text}")
            return None, None
        
        if isinstance(result, dict) and "latitude" in result and "longitude" in result:
            lat, lon = result["latitude"], result["longitude"]
            if isinstance(lat, (int, float)) and isinstance(lon, (int, float)) and lat >= 0 and lon >= 0:
                return lat, lon
            else:
                raise ValueError(f"Invalid coordinate values: {result}")
        else:
            raise ValueError(f"Unexpected response structure: {result}")
    except Exception as e:
        st.error(f"Error fetching coordinates for {landmark}: {e}")
        return None, None

# Streamlit UI
st.title("Crime Data with Geolocation")

# File uploader
uploaded_file = st.file_uploader("Upload CSV File", type=["csv"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    if "latitude" not in df.columns:
        df["latitude"] = None
        df["longitude"] = None

    # Fetch lat/lon for each landmark
    for idx, row in df.iterrows():
        if pd.isna(row["latitude"]) or pd.isna(row["longitude"]):
            lat, lon = get_lat_lon(row["Landmark"], row['Station'])
            df.at[idx, "latitude"] = lat
            df.at[idx, "longitude"] = lon
            time.sleep(1)  # Avoid API rate limits
    
    # Display dataframe
    st.write("### Updated Crime Data Table")
    st.dataframe(df)

    # Option to download updated CSV
    csv = df.to_csv(index=False).encode("utf-8")
    st.download_button("Download Updated CSV", csv, "updated_crime_data.csv", "text/csv")
