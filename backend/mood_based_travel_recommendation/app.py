from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import json
import re
import ast
from sklearn.feature_extraction.text import CountVectorizer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK resources
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')

app = Flask(__name__)

# Load the dataset with image URLs
df = pd.read_csv('mood_travel_data.csv')

# Process preferred_activities column
def extract_activities(activities_str):
    if pd.isna(activities_str):
        return []
    try:
        # Try to parse as a list or array
        if activities_str.startswith('[') and activities_str.endswith(']'):
            return ast.literal_eval(activities_str)
        # Split by commas if it's a string
        return [act.strip() for act in activities_str.split(',')]
    except:
        return []

# Apply the function to create a list of activities for each row
if 'preferred_activities' in df.columns:
    df['activities_list'] = df['preferred_activities'].apply(extract_activities)
else:
    df['activities_list'] = [[]]

# Extract all unique activities
all_activities = []
for activities in df['activities_list']:
    all_activities.extend(activities)
activities = list(set(all_activities))

# Prepare the model encoders - make sure they encode all unique values
le_mood = LabelEncoder()
le_city = LabelEncoder()
le_state = LabelEncoder()

# Make sure to fit the encoders on all unique values in the dataset
all_moods = df['mood'].unique().tolist()
all_cities = df['city'].unique().tolist() 
all_states = df['state'].unique().tolist()

le_mood.fit(all_moods)
le_city.fit(all_cities)
le_state.fit(all_states)

df['mood_encoded'] = le_mood.transform(df['mood'])
df['city_encoded'] = le_city.transform(df['city'])
df['state_encoded'] = le_state.transform(df['state'])

# Extract unique moods for dropdowns
moods = df['mood'].unique().tolist()

# Simplified text summarization function that extracts important keywords
def extract_keywords(text, num_keywords=5):
    if pd.isna(text) or not text:
        return "Explore this amazing destination!"
    
    try:
        # Tokenize the text
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
        
        # Count word frequencies
        word_freq = {}
        for word in filtered_tokens:
            if word in word_freq:
                word_freq[word] += 1
            else:
                word_freq[word] = 1
        
        # Sort by frequency
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        
        # Get top keywords
        top_keywords = [word for word, freq in sorted_words[:num_keywords]]
        
        # If we have enough keywords, create a summary by highlighting them in the original text
        if len(top_keywords) > 0:
            # Just return first 2 sentences or 150 characters
            if len(text) > 150:
                return text[:150] + "..."
            return text
        
        return text
    except Exception as e:
        # In case of errors, return a shorter version of the text
        if len(text) > 150:
            return text[:150] + "..."
        return text

@app.route('/')
def home():
    return render_template('index.html', moods=moods, activities=activities)

@app.route('/predict', methods=['POST'])
def predict():
    # Get filters from form
    mood = request.form.get('mood', '')
    activities_json = request.form.get('activities', '[]')
    try:
        selected_activities = json.loads(activities_json)
    except:
        selected_activities = []
    
    # Create a copy of the DataFrame to avoid SettingWithCopyWarning
    working_df = df.copy()
    
    # Filter based on mood first (primary filter)
    if mood:
        filtered_df = working_df[working_df['mood'] == mood].copy()
    else:
        filtered_df = working_df.copy()
    
    # Scoring system for activity matches
    if selected_activities:
        # Create a score for each destination based on activity matches
        def calculate_activity_score(row_activities):
            if not row_activities:
                return 0
            
            # Count how many selected activities match
            matches = sum(1 for activity in selected_activities if activity in row_activities)
            return matches / len(selected_activities)  # Normalized score
        
        # Apply scoring to each row - use .loc to avoid warning
        filtered_df.loc[:, 'activity_score'] = filtered_df['activities_list'].apply(calculate_activity_score)
        
        # Sort by activity score, higher scores first
        filtered_df = filtered_df.sort_values('activity_score', ascending=False)
        
        # Keep only rows with at least one matching activity
        filtered_df = filtered_df[filtered_df['activity_score'] > 0]
        
        # If we still have no matches, revert to all mood matches
        if filtered_df.empty and mood:
            filtered_df = working_df[working_df['mood'] == mood].copy()
        elif filtered_df.empty:
            filtered_df = working_df.copy()
    
    # If we have too many options, use simple filtering instead of RandomForest
    if len(filtered_df) > 4:
        # Just sort by mood match (already filtered) and take top results
        if 'activity_score' in filtered_df.columns:
            filtered_df = filtered_df.sort_values('activity_score', ascending=False)
        else:
            # Add random score for variety if no activity scores
            filtered_df.loc[:, 'random_score'] = np.random.rand(len(filtered_df))
            filtered_df = filtered_df.sort_values('random_score', ascending=False)
    
    # Get top 4 recommendations
    recommendations = filtered_df.head(min(4, len(filtered_df)))
    
    # If we still don't have enough recommendations, add some random ones
    if len(recommendations) < 4:
        remaining = 4 - len(recommendations)
        # Get cities we already have
        existing_cities = recommendations['city'].tolist()
        # Get more cities that aren't in our results yet
        additional = working_df[~working_df['city'].isin(existing_cities)].sample(n=remaining)
        recommendations = pd.concat([recommendations, additional])
    
    result = []
    for _, row in recommendations.iterrows():
        # Extract keywords from the reason text instead of summarizing
        mood_reason = extract_keywords(row['reason'] if 'reason' in row else "Perfect destination for your mood")
        
        # Get activities reason
        activities_reason = "Explore local attractions and experiences"
        if 'activities_reason' in row and not pd.isna(row['activities_reason']):
            activities_reason = extract_keywords(row['activities_reason'])
            
        # Get list of activities for this destination
        destination_activities = row['activities_list'] if len(row['activities_list']) > 0 else []
        
        # If user selected activities, highlight matches
        if selected_activities:
            matching_activities = [act for act in destination_activities if act in selected_activities]
            other_activities = [act for act in destination_activities if act not in selected_activities]
            
            # Put matching activities first
            sorted_activities = matching_activities + other_activities
            
            # Limit to top 5 activities for display
            destination_activities = sorted_activities[:5]
        
        result.append({
            'city': row['city'],
            'state': row['state'],
            'mood_reason': mood_reason,
            'activities_reason': activities_reason,
            'activities': destination_activities,
            'image_url': row['image_url'] if 'image_url' in row else "https://via.placeholder.com/400x300"
        })
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)