from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
from transformers import BertTokenizer, BertModel
import torch
from scipy.sparse import hstack
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from fuzzywuzzy import process  # For fuzzy matching

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Load the dataset
df = pd.read_csv('destinations.csv')

# Combine 'knownFor' and 'tags' into a single text field
df['combined_text'] = df['knownFor'] + ' ' + df['tags']

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Function to generate BERT embeddings for a given text
def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze().numpy()

# One-hot encode 'country' and 'continent' for geographical features
encoder = OneHotEncoder()
encoder.fit(df[['country', 'continent']])

class VisitedPlaces(BaseModel):
    places: list[str]

from fuzzywuzzy import process  # For fuzzy matching

@app.post("/recommend")
async def recommend(visited_places: VisitedPlaces):
    visited_places_list = visited_places.places

    # Function to find the closest match in the dataset
    def find_closest_match(place, choices):
        match, score = process.extractOne(place, choices)
        return match if score > 70 else None  # Adjust threshold as needed

    # Find matches for visited places in the 'knownFor' or 'tags' fields
    matched_places = []
    for place in visited_places_list:
        # Search in 'knownFor'
        match = find_closest_match(place, df['knownFor'].tolist())
        if match:
            matched_places.append(df[df['knownFor'] == match]['name'].values[0])
            continue

        # Search in 'tags' if no match in 'knownFor'
        match = find_closest_match(place, df['tags'].tolist())
        if match:
            matched_places.append(df[df['tags'] == match]['name'].values[0])

    # If no matches found, raise an error
    if not matched_places:
        raise HTTPException(
            status_code=404,
            detail="None of the visited places could be matched in the dataset."
        )

    # Filter the dataset to exclude matched places
    df_unvisited = df[~df['name'].isin(matched_places)]

    # Generate BERT embeddings for all destinations
    df_unvisited['bert_embedding'] = df_unvisited['combined_text'].apply(get_bert_embedding)

    # Combine BERT embeddings and geographical features
    geo_features = encoder.transform(df_unvisited[['country', 'continent']])
    feature_matrix = hstack([np.vstack(df_unvisited['bert_embedding'].values), geo_features])

    # Vectorize visited places
    visited_indices = df[df['name'].isin(matched_places)].index
    visited_bert = np.vstack(df.loc[visited_indices, 'combined_text'].apply(get_bert_embedding).values)
    visited_geo = encoder.transform(df.loc[visited_indices, ['country', 'continent']])
    visited_features = hstack([visited_bert, visited_geo])

    # Calculate cosine similarity between visited places and unvisited places
    similarity_matrix = cosine_similarity(visited_features, feature_matrix)

    # Aggregate similarity scores for each unvisited place
    aggregated_scores = np.mean(similarity_matrix, axis=0)

    # Get the top 5 most similar places
    top_indices = np.argsort(aggregated_scores)[-5:][::-1]
    top_places = df_unvisited.iloc[top_indices]

    # Function to generate a reason for recommendation
    def generate_reason(recommended_place, visited_places_df):
        reasons = []
        for _, visited_place in visited_places_df.iterrows():
            recommended_tags = eval(recommended_place['tags']) if isinstance(recommended_place['tags'], str) else recommended_place['tags']
            visited_tags = eval(visited_place['tags']) if isinstance(visited_place['tags'], str) else visited_place['tags']
            common_tags = set(recommended_tags).intersection(set(visited_tags))
            
            if common_tags:
                reasons.append(f"{recommended_place['name']} and {visited_place['name']} share interests in: {', '.join(common_tags)}.")
            if recommended_place['knownFor'] and visited_place['knownFor']:
                reasons.append(f"{recommended_place['name']} offers experiences similar to {visited_place['name']}: {recommended_place['knownFor']}.")
            if recommended_place['country'] == visited_place['country']:
                reasons.append(f"{recommended_place['name']} and {visited_place['name']} are both located in {recommended_place['country']}.")
            if recommended_place['continent'] == visited_place['continent']:
                reasons.append(f"{recommended_place['name']} and {visited_place['name']} are both in {recommended_place['continent']}.")
        
        unique_reasons = list(set(reasons))
        return unique_reasons[:3]

    # Prepare the response
    recommendations = []
    for i, row in top_places.iterrows():
        reasons = generate_reason(row, df[df['name'].isin(matched_places)])
        recommendations.append({
            "name": row['name'],
            "country": row['country'],
            "continent": row['continent'],
            "similarity_score": float(aggregated_scores[i]),
            "reasons": reasons
        })

    return {"recommendations": recommendations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# uvicorn main:app --reload