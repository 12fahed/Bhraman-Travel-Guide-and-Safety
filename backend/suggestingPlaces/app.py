import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def scrape_place_info(place):
    """
    Scrape place description from a travel website.
    Modify the URL structure based on the website being used.
    """
    search_url = f"https://www.lonelyplanet.com/search?q={place.replace(' ', '+')}"
    headers = {"User-Agent": "Mozilla/5.0"}  # Mimic a browser request

    response = requests.get(search_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data for {place}")
        return ""

    soup = BeautifulSoup(response.text, "html.parser")
    
    # Modify based on actual website structure
    description_tag = soup.find("p")  # Example: First <p> tag might have the description
    return description_tag.text.strip() if description_tag else ""

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

# Places the user has visited
visited_places = ["Paris", "Rome"]

# Scrape descriptions for different places
places_to_scrape = ["Tokyo", "New York", "Bangkok", "Barcelona", "Dubai"]
all_places = {place: scrape_place_info(place) for place in places_to_scrape}

# Get recommendations
recommended = recommend_places(visited_places, all_places)
print("Recommended places to visit:", recommended)
