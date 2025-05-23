import streamlit as st
import googlemaps
import folium
from streamlit_folium import folium_static
import polyline
# from components.sos_button import sos_button
# sos_button()

# Set page configuration
st.set_page_config(layout="centered")  # Center the app layout

def get_google_maps_directions(api_key, origin, destination):
    gmaps = googlemaps.Client(key=api_key)
    directions = gmaps.directions(origin, destination, mode="driving")
    return directions

def plot_route_on_map(directions):
    if not directions:
        return None
    
    route = directions[0]['overview_polyline']['points']
    decoded_route = polyline.decode(route)
    start_location = decoded_route[0]
    end_location = decoded_route[-1]
    
    # Create a Folium map with smaller width and height
    m = folium.Map(location=start_location, zoom_start=7, width="50%", height="400px")  # Smaller map
    folium.PolyLine(decoded_route, color="blue", weight=5, opacity=0.7).add_to(m)
    folium.Marker(start_location, popup="Start", icon=folium.Icon(color="green")).add_to(m)
    folium.Marker(end_location, popup="End", icon=folium.Icon(color="red")).add_to(m)
    
    # Adding red spots for specific latitude and longitude points
    red_spots = [(18.955500, 72.824416), (18.967534, 72.816133), (18.976665, 72.823901), (18.947318, 72.828047)]
    for lat, lon in red_spots:
        folium.CircleMarker(location=(lat, lon), radius=5, color='red', fill=True, fill_color='red').add_to(m)
    
    return m

def main():
    # Custom CSS for a more compact layout
    st.markdown("""
        <style>
            .stApp {
                margin: auto;      /* Center the app */
                padding: 10px;    /* Reduce padding */
                background-color: #F8F2EF; /* Background color */
                color: black; /* Text color */
            }

            /* Decrease the size of the map container */
            .folium-map {
                height: 400px !important;  /* Smaller height */
                width: 40% !important;     /* Smaller width */
                margin: auto;              /* Center the map */
            }

            /* Adjust input fields and buttons */
            .stTextInput > div > div > input {
                width: 100% !important;
                padding: 8px !important;  /* Reduce padding */
                background-color: #ffffff; /* White background for input fields */
                color: black; /* Black text for input fields */
            }
            .stButton > button {
                width: 100% !important;
                margin-top: 5px;          /* Reduce margin */
                padding: 8px 16px !important;  /* Reduce padding */
                background-color: #ffffff; /* White background for buttons */
                color: orange; /* Orange text for buttons */
                border: 1px solid orange; /* Orange border for buttons */
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
            }
            .stButton > button:hover {
                background-color: orange; /* Orange background on hover */
                color: white; /* White text on hover */
                border: 1px solid orange; /* Orange border on hover */
            }
        </style>
    """, unsafe_allow_html=True)

    st.title("Get Home Safely")
    
    api_key = "AIzaSyBnNgNaCmkIKZhPargguNpn9o7qEYp1MV8"  # Replace with your API Key
    
    col1, col2 = st.columns(2)
    with col1:
        origin = st.text_input("From:", "Mahalakshmi Race Course")
    with col2:
        destination = st.text_input("To:", "Gateway Of India Mumbai")
    
    if st.button("Get Route"):
        if origin and destination:
            directions = get_google_maps_directions(api_key, origin, destination)
            if directions:
                route_map = plot_route_on_map(directions)
                if route_map:
                    folium_static(route_map)
                else:
                    st.error("Could not plot the route. Try different locations.")
            else:
                st.error("Could not retrieve directions. Please check the inputs.")
        else:
            st.warning("Please enter both origin and destination.")
    
if __name__ == "__main__":
    main()