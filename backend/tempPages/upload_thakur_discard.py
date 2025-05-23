import streamlit as st
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Firebase setup
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")  # Replace with your Firebase key path
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Load Data from CSV
uploaded_file = st.file_uploader("Upload CSV File", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    st.write("### Preview of Crime Data")
    st.dataframe(df)

    # Convert DataFrame to Dictionary List
    crime_data = df.to_dict(orient="records")

    if st.button("Upload Data to Firebase"):
        for crime in crime_data:
            db.collection("Crime").add(crime)
        st.success("Crime data successfully uploaded to Firebase Firestore!")
