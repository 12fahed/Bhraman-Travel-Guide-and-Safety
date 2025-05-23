import streamlit as st
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
# from components.sos_button import sos_button
# sos_button()

def load_data():
    file_path = "data/data2.csv"  # Ensure this path is correct
    try:
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip()  # Remove any leading/trailing spaces
        return df
    except FileNotFoundError:
        st.error("Error: Data file not found. Please check the file path.")
        st.stop()
    except Exception as e:
        st.error(f"Error loading data: {e}")
        st.stop()

def preprocess_data(df):
    # st.write("Columns in dataset:", df.columns.tolist())
    
    if 'crime_type' not in df.columns:
        st.error("Error: 'crime_type' column not found in dataset.")
        st.stop()
    
    df = df.drop(columns=['description', 'date_time'], errors='ignore')  # Drop unnecessary columns
    label_encoders = {}
    for col in df.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    return df, label_encoders

def train_model(df):
    X = df.drop(columns=['crime_type'])
    y = df['crime_type']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

st.title("Which crime you should be aware of?")
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        *{
            font-family: 'Poppins', sans-serif;
            }
 
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)
df = load_data()
df, label_encoders = preprocess_data(df)
model = train_model(df)

st.write("Enter details to predict the crime type:")

input_data = {}
for col in df.drop(columns=['crime_type']).columns:
    if col in label_encoders:
        input_data[col] = st.selectbox(col, label_encoders[col].classes_)
    else:
        input_data[col] = st.number_input(col, value=float(df[col].mean()))

if st.button("Predict Crime Type"):
    input_df = pd.DataFrame([input_data])
    
    for col, le in label_encoders.items():
        if col in input_df:
            input_df[col] = le.transform(input_df[col])
    
    if 'crime_type' not in label_encoders:
        st.error("Error: 'crime_type' not found in encoded labels.")
        st.stop()
    
    prediction = model.predict(input_df)[0]
    crime_type = label_encoders['crime_type'].inverse_transform([prediction])[0]
    st.success(f"Predicted Crime Type: {crime_type}")