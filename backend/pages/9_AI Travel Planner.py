import streamlit as st
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
from geopy.geocoders import Nominatim
import folium
from streamlit_folium import folium_static
import random
import os
# from components.sos_button import sos_button
# sos_button()

# Set up Gemini API
genai.configure(api_key="AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ")
model = genai.GenerativeModel("gemini-pro")

# Unsplash API access key
UNSPLASH_ACCESS_KEY = "MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM"


def generate_random_points_near_polyline(route, num_points=10, offset=0.01):
    points = []
    for lon, lat in route:
        lat_offset = random.uniform(-offset, offset)
        lon_offset = random.uniform(-offset, offset)
        points.append((lat + lat_offset, lon + lon_offset))
    return points


def geocode_location(place):
    try:
        geolocator = Nominatim(user_agent="geo_locator", timeout=10)
        location = geolocator.geocode(place)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        st.error(f"Error fetching coordinates for {place}: {e}")
    return None


def get_route(start, end):
    url = f"https://router.project-osrm.org/route/v1/driving/{start[1]},{start[0]};{end[1]},{end[0]}?overview=full&geometries=geojson"
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        return data['routes'][0]['geometry']['coordinates']
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching route data: {e}")
    return None


def get_image(url, timeout=10):
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching image: {e}")
    return None


def get_wikipedia_image(destination):
    search_url = f'https://en.wikipedia.org/wiki/{destination.replace(" ", "_")}'
    try:
        response = requests.get(search_url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        image_tag = soup.select_one('.infobox img')
        if image_tag:
            image_url = 'https:' + image_tag['src']
            return get_image(image_url)
    except Exception as e:
        st.error(f"Error fetching Wikipedia image for {destination}: {e}")
    return None


def get_unsplash_image(query):
    url = f"https://api.unsplash.com/search/photos?query={query}&client_id={UNSPLASH_ACCESS_KEY}&per_page=1"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data["results"]:
            image_url = data["results"][0]["urls"]["regular"]
            return get_image(image_url)
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching Unsplash image for {query}: {e}")
    return None


def generate_itinerary(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        st.error(f"Error generating itinerary: {e}")
        return None


st.set_page_config(page_title="Create your dream journey today...", layout="wide")
st.title("Create your dream journey today...🧳")

start_location = st.text_input("Enter starting location", "Delhi")
end_location = st.text_input("Enter ending location", "Goa")
current_time = st.text_input("Enter current time (default start time)", "09:00 AM")
user_input = st.text_area("Describe your travel preferences, destinations, and duration:",
                         placeholder="e.g., I want to visit Paris and Rome for 7 days, focusing on art and history.")

if st.button("Generate Itinerary") and user_input:
    with st.spinner("Generating your travel plan..."):
        itinerary_prompt = (
            f"Today is 22 Feb 2025. Starting from {start_location} at {current_time}, "
            f"create a detailed and creative travel itinerary that ends in {end_location}. "
            f"Include the following travel preferences: {user_input}. "
            "Ensure the itinerary considers the current date. "
            "Include risk avoidance measures, with high-risk areas marked with latitude and longitude in a table. "
            "Offer scenic routes, safety guidelines, travel costs, and practical travel tips."
        )
        itinerary = generate_itinerary(itinerary_prompt)

        if itinerary:
            st.markdown("## Your Travel Itinerary 🗺️")
            destinations = [start_location, end_location]
            cols = st.columns(len(destinations))

            for i, dest in enumerate(destinations):
                img = get_unsplash_image(dest) or get_wikipedia_image(dest)
                if img:
                    with cols[i]:
                        st.image(img, caption=f"{dest}", use_column_width=True)

            start_coords = geocode_location(start_location)
            end_coords = geocode_location(end_location)

            if start_coords and end_coords:
                route = get_route(start_coords, end_coords)
                if route:
                    m = folium.Map(location=start_coords, zoom_start=6)
                    folium.Marker(start_coords, tooltip="Start", icon=folium.Icon(color="green")).add_to(m)
                    folium.Marker(end_coords, tooltip="End", icon=folium.Icon(color="red")).add_to(m)
                    folium.PolyLine([(lat, lon) for lon, lat in route], color="blue", weight=5).add_to(m)
                    folium_static(m)
                else:
                    st.error("Could not fetch route. Try again.")
            else:
                st.error("Could not find one or both locations. Please check your input.")

            st.write(itinerary)
            st.download_button("Download Itinerary as Text", itinerary, file_name="travel_itinerary.txt")
            st.success("Itinerary generated successfully!")

# Let me know if you want me to tweak anything! 🚀
