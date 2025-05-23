import streamlit as st
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
from io import BytesIO
import google.generativeai as genai

# Set up Gemini API
genai.configure(api_key="AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ")
model = genai.GenerativeModel("gemini-pro")

# Unsplash API access key
UNSPLASH_ACCESS_KEY = "MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM"

def get_place_details(place):
    """Fetch place details using Generative AI."""
    try:
        prompt = f"Provide a detailed description of {place} as a travel destination."
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        st.error(f"Error fetching details for {place}: {e}")
        return "No description available."

def get_unsplash_image(query):
    """Fetch an image of the place from Unsplash."""
    url = f"https://api.unsplash.com/search/photos?query={query}&client_id={UNSPLASH_ACCESS_KEY}&per_page=1"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data["results"]:
            image_url = data["results"][0]["urls"]["regular"]
            return image_url
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching Unsplash image for {query}: {e}")
    return ""

def recommend_places(visited_places, all_places):
    """Recommends places based on past visits using cosine similarity."""
    places_list = visited_places + list(all_places.keys())
    descriptions = [all_places.get(place, "") for place in places_list]
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descriptions)
    
    similarity_scores = cosine_similarity(tfidf_matrix[:len(visited_places)], tfidf_matrix[len(visited_places):])
    avg_scores = similarity_scores.mean(axis=0)
    
    recommended_indices = avg_scores.argsort()[::-1]
    recommended_places = [list(all_places.keys())[i] for i in recommended_indices if list(all_places.keys())[i] not in visited_places]
    
    return recommended_places[:5]  # Return top 5 recommendations

# Streamlit UI
st.title("Travel Destination Recommender")
st.write("Here are some recommended places for you to visit!")

# Predefined visited places
visited_places = ["Paris", "Rome"]
places_to_scrape = ["Tokyo", "New York", "Bangkok", "Barcelona", "Dubai"]
all_places = {place: get_place_details(place) for place in places_to_scrape}

# Get recommendations
recommended = recommend_places(visited_places, all_places)

st.subheader("Recommended places to visit:")
for place in recommended:
    description = all_places.get(place, "No description available.")
    image_url = get_unsplash_image(place)
    
    st.write(f"### {place}")
    st.write(description)
    if image_url:
        st.image(image_url, caption=place, use_column_width=True)