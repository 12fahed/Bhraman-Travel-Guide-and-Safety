import streamlit as st
import pandas as pd
import pydeck as pdk

# Set Streamlit page config
st.set_page_config(layout="wide")

# Set your Mapbox access token
st.mapbox_token = "pk.eyJ1IjoiY29zbWljcmFwdG9yMiIsImEiOiJjbTdldjdua2kwaWt4MmpvcDgxNjl5ejFkIn0.3ZXFop6V2DXIWQlVZ3R7Sw"

# Load crime data
DATA_PATH = "data/maha-crime.csv"

@st.cache_data
def load_data():
    df = pd.read_csv(DATA_PATH)

    # Ensure Latitude & Longitude are numeric
    df["Latitude"] = pd.to_numeric(df["Latitude"], errors="coerce")
    df["Longitude"] = pd.to_numeric(df["Longitude"], errors="coerce")

    # Drop missing coordinates
    df = df.dropna(subset=["Latitude", "Longitude"])

    return df

df = load_data()

# Display the total number of points
st.write(f"📍 Total Crime Points: {len(df)}")

# Define PyDeck layer for plotting all crime points using an icon
ICON_URL = "https://img.icons8.com/emoji/48/round-pushpin-emoji.png"

icon_data = {
    "url": ICON_URL,
    "width": 128,
    "height": 128,
    "anchorY": 128  # Adjusts the anchor point
}

df["icon_data"] = [icon_data] * len(df)  # Assign the icon data to all rows

layer = pdk.Layer(
    "IconLayer",
    df,
    get_position=["Longitude", "Latitude"],
    get_icon="icon_data",
    get_size=3,  # Adjust icon size
    pickable=True
)

# Automatically set zoom level based on data spread
view_state = pdk.ViewState(
    latitude=df["Latitude"].mean(),
    longitude=df["Longitude"].mean(),
    zoom=10,  # Adjust for better visibility
    pitch=0
)

# Define Mapbox style
map_style = "mapbox://styles/mapbox/streets-v11"

# Render map with all crime points
st.pydeck_chart(pdk.Deck(
    layers=[layer],
    initial_view_state=view_state,
    map_style=map_style,
    tooltip={"text": "Crime: {Crime_Type}\nDistrict: {District}"}
))

# Option to show raw data
if st.checkbox("Show Raw Data"):
    st.write(df)
