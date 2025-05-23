import streamlit as st
# from components.sos_button import sos_button

# Set page config
st.set_page_config(layout="centered", page_title="Travel App", page_icon="🌍")

# sos_button()

# Load custom CSS
st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        *{
            font-family: 'Poppins', sans-serif;
            }
        body {
            background-color: #F8F2EF !important;
            
            /* Changed top padding to 5px */
            
        }
        
        .stApp {
            background-color: #F8F2EF !important;
        }
        
        .header-text {
            font-size: 28px;
            font-weight: 300;
            color: #333;
            margin: 8px;  /* Remove all margins */
            padding: 5px;  /* Remove all padding */
            font-family: 'Poppins', sans-serif;
            margin-top: 30px;
            margin-bottom: 3px;
            margin-left : 2.3rem;
        }

        /* New Search Bar Styling */
        .search-container {
            position: relative;
            margin: 0 ;
            margin-bottom: 5px;
            width : 100%
        }

        .search-input {
            width: 100%;
            height: 65px;
            padding: 0px 50px;
            border: none;
            border-radius: 40px;
            background: white;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            outline: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .search-input::placeholder {
            color: #787B7F;
            padding : 10px;
            margin : 20px;
            left : 100;
        }

        .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            margin-right: 0px;
            background: #F99058;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .search-icon svg {
            width: 20px;
            height: 20px;
            color: white;
        }

        .suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 15px;
            margin-top: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
        }

        .suggestion-item {
            padding: 10px 20px;
            cursor: pointer;
        }

        .suggestion-item:hover {
            background: #f5f5f5;
        }

        /* Rest of your existing styles */
        .quick-actions {
            display: flex;
            justify-content:center;
            
            gap: 20px;
        }

        .action-box {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-top:2px;
            margin-right:0px;
        }
        .stMain{
            margin :0;
            padding :0;
        }
        .section-title {
            font-size: 25px;
            padding: 5px ;
            font-weight: 400;
            margin: 20px 0 0 0;
            color: #333;
        }

        .destinations-container {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding: 10px 0;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .destination-card {
            min-width: 200px;
            height: 230px;
            background: white;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            margin:5px;
        }

        .destination-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
            
        .action-text{
            font-size: 13px;
            padding-top: 5px;
            width: 100%;
             color: #787B7F;
        }
            
        .destination-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px;
            background: linear-gradient(transparent, #FA8E55);
            color: white;
        }
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
    </style>
""", unsafe_allow_html=True)

# Remove Streamlit default padding
st.markdown("""
    <style>
        .block-container {
            padding-top: 0 !important;
            margin-top: 0 !important;
        }
    </style>
""", unsafe_allow_html=True)

# Greeting
st.markdown('<div class="header-text" style="font-weight:400;">Hello, <span style="font-weight:500">Sushmit</span></div>', unsafe_allow_html=True)


# New Search Bar with magnifying glass
st.markdown("""
    <div class="search-container">
        <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
        <input type="text" class="search-input" placeholder="Where are you going?" onkeyup="showSuggestions(this.value)">
        <div class="suggestions" id="suggestions"></div>
    </div>
""", unsafe_allow_html=True)

# Add JavaScript for search functionality
st.markdown("""
    <script>
        const cities = ["Delhi", "Mumbai", "Cappadocia", "Snowland", "Paris", "New York", "Tokyo", "Dubai"];
        
        function showSuggestions(value) {
            const suggestions = document.getElementById('suggestions');
            if (value.length > 0) {
                const filtered = cities.filter(city => 
                    city.toLowerCase().includes(value.toLowerCase())
                );
                
                suggestions.innerHTML = filtered.map(city => 
                    `<div class="suggestion-item">${city}</div>`
                ).join('');
                
                suggestions.style.display = filtered.length ? 'block' : 'none';
            } else {
                suggestions.style.display = 'none';
            }
        }
    </script>
""", unsafe_allow_html=True)

# Quick Actions
st.markdown("""
    <div class="quick-actions">
        <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="action-box"><img style="padding:20px" src =  "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2Fhome.png?alt=media&token=817e7dfc-389a-4dff-a539-e5fcbbd08ffb"></div>
                <div class="action-text">Best Places</div>
        </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="action-box"><img style="padding:15px" src = "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2Fprotection.png?alt=media&token=156b4591-cc69-4e1e-abd1-f5f8501340b6"></div>
                <div class="action-text">Your Safety</div>
        </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="action-box"><img style="padding:20px" src =   "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2Fdanger.png?alt=media&token=e8ccef80-1e77-492b-85fc-fad42b1e54be"></div>
                <div class="action-text">Dangers</div>
        </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="action-box"><img style="padding:20px" src = "https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2Freport.png?alt=media&token=60edbe88-088a-4de1-b4ed-49b4f296131d" ></div>
                <div class="action-text">Complaints</div>
        </div>

       
    </div>
""", unsafe_allow_html=True)

# st.image("images\\KOLKATA.png", caption="This is a static image")
# Popular Destinations
st.markdown('<div class="section-title">Popular Destinations</div>', unsafe_allow_html=True)
st.markdown("""
    <div class="destinations-container">
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2FMUMBAI.png?alt=media&token=e6b6939c-322e-4bb2-92e3-e2dbdff92805" alt="Mumbai">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Maharashtra</div>
            </div>
        </div>
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F5.png?alt=media&token=2f426a69-0fdf-49cc-8d18-c255eb726bb6" alt="Kolkata">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">West Bengal</div>
            </div>
        </div>
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F4.png?alt=media&token=dc07433c-88d2-4fd5-8064-b1da6099d488" alt="Jaipur">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Rajasthan</div>
            </div>
        </div>
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F2.png?alt=media&token=660c949b-0272-40b1-85e0-3c7e0449dc34" alt="Chennai">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Tamil Nadu</div>
            </div>
        </div>
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F3.png?alt=media&token=079d1b3e-02e3-418e-84dc-b37be1eb52d3" alt="Pune">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Maharashtra</div>
            </div>
        </div>
    </div>
""", unsafe_allow_html=True)

st.markdown('<div class="section-title">Safest Destinations</div>', unsafe_allow_html=True)
st.markdown("""
    <div class="destinations-container">
            <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F2.png?alt=media&token=660c949b-0272-40b1-85e0-3c7e0449dc34" alt="Snowland">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Tamil Nadu</div>
            </div>
        </div>
            <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2FMUMBAI.png?alt=media&token=e6b6939c-322e-4bb2-92e3-e2dbdff92805" alt="Cappadocia">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">Maharashtra</div>
            </div>
        </div>
        <div class="destination-card">
            <img src="https://firebasestorage.googleapis.com/v0/b/rubix25-bb41f.firebasestorage.app/o/Fahed%2F5.png?alt=media&token=2f426a69-0fdf-49cc-8d18-c255eb726bb6" alt="Cappadocia">
            <div class="destination-info">
                <div class="destination-name"></div>
                <div class="destination-location">West Bengal</div>
            </div>
        </div>
        
        
        
        
    </div>
""", unsafe_allow_html=True)