import streamlit as st
import pandas as pd
import sqlite3

# Title
st.title("Interactive Map with CRUD Operations")

# Initialize database
conn = sqlite3.connect("locations.db")
c = conn.cursor()
c.execute("""
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL,
        lon REAL,
        city TEXT
    )
""")
conn.commit()

# Function to fetch data
def get_data():
    return pd.read_sql("SELECT * FROM locations", conn)

# Insert new location
def insert_location(lat, lon, city):
    c.execute("INSERT INTO locations (lat, lon, city) VALUES (?, ?, ?)", (lat, lon, city))
    conn.commit()

# Delete location
def delete_location(city):
    c.execute("DELETE FROM locations WHERE city = ?", (city,))
    conn.commit()

# User input
st.sidebar.header("Add Location")
lat = st.sidebar.number_input("Latitude")
lon = st.sidebar.number_input("Longitude")
city = st.sidebar.text_input("City")
if st.sidebar.button("Add Location"):
    insert_location(lat, lon, city)
    st.sidebar.success("Location added!")

# Display map and data
locations = get_data()
st.map(locations)
st.write("### Location Data")
st.dataframe(locations)

# Delete operation
st.sidebar.header("Delete Location")
delete_city = st.sidebar.text_input("City to delete")
if st.sidebar.button("Delete Location"):
    delete_location(delete_city)
    st.sidebar.success("Location deleted!")

# CSS Styling
st.markdown("""
    <style>
        .stTitle {
            color: #4CAF50;
            text-align: center;
        }
        .stDataFrame {
            background-color: #f5f5f5;
            border-radius: 10px;
            padding: 10px;
        }
    </style>
""", unsafe_allow_html=True)
