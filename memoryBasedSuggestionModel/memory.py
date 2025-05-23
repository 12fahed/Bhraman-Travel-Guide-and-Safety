import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder
from transformers import BertTokenizer, BertModel
import torch

# Load the dataset
df = pd.read_csv('destinations.csv')

# Combine 'knownFor' and 'tags' into a single text field
df['combined_text'] = df['knownFor'] + ' ' + df['tags']

# User's visited places
visited_places = ["Amber Fort", "Rome", "Paris", "Jaipur"]

# Filter the dataset to exclude visited places
df_unvisited = df[~df['name'].isin(visited_places)]

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Function to generate BERT embeddings for a given text
def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    # Use the [CLS] token embedding as the sentence embedding
    return outputs.last_hidden_state[:, 0, :].squeeze().numpy()

# Generate BERT embeddings for all destinations
df_unvisited['bert_embedding'] = df_unvisited['combined_text'].apply(get_bert_embedding)

# One-hot encode 'country' and 'continent' for geographical features
encoder = OneHotEncoder()
geo_features = encoder.fit_transform(df_unvisited[['country', 'continent']])

# Combine BERT embeddings and geographical features
from scipy.sparse import hstack
feature_matrix = hstack([np.vstack(df_unvisited['bert_embedding'].values), geo_features])

# Vectorize visited places
visited_indices = df[df['name'].isin(visited_places)].index
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
# Function to generate a reason for recommendation
def generate_reason(recommended_place, visited_places_df):
    reasons = []
    for _, visited_place in visited_places_df.iterrows():
        # Ensure tags are properly parsed as lists
        recommended_tags = eval(recommended_place['tags']) if isinstance(recommended_place['tags'], str) else recommended_place['tags']
        visited_tags = eval(visited_place['tags']) if isinstance(visited_place['tags'], str) else visited_place['tags']
        
        # Compare tags
        common_tags = set(recommended_tags).intersection(set(visited_tags))
        if common_tags:
            reasons.append(f"{recommended_place['name']} and {visited_place['name']} share interests in: {', '.join(common_tags)}.")
        
        # Compare activities in 'knownFor'
        if recommended_place['knownFor'] and visited_place['knownFor']:
            reasons.append(f"Both destinations offer similar experiences: {recommended_place['knownFor']}.")
        
        # Compare geographical proximity
        if recommended_place['country'] == visited_place['country']:
            reasons.append(f"Both {recommended_place['name']} and {visited_place['name']} are located in {recommended_place['country']}.")
        if recommended_place['continent'] == visited_place['continent']:
            reasons.append(f"Both are in {recommended_place['continent']}.")

    # Deduplicate reasons and return the top 3
    unique_reasons = list(set(reasons))
    return unique_reasons[:3]


# Display the top suggestions with reasons
print("Top suggested places to visit:")
for i, row in top_places.iterrows():
    print(f"{row['name']} - {row['country']} ({row['continent']}) (Similarity Score: {aggregated_scores[i]:.2f})")
    reasons = generate_reason(row, df[df['name'].isin(visited_places)])
    print("Reasons for recommendation:")
    for reason in reasons:
        print(f" - {reason}")
    print()