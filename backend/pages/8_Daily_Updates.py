import streamlit as st
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
# from components.sos_button import sos_button
# sos_button()

# Load environment variables
load_dotenv()

# API Keys
GNEWS_API_KEY = os.getenv('GNEWS_API_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

def fetch_crime_news():
    """Fetch crime-related news for Mumbai"""
    try:
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        url = "https://gnews.io/api/v4/search"
        params = {
            'q': 'crime OR criminal OR murder OR theft Mumbai',
            'lang': 'en',
            'country': 'in',
            'max': 10,
            'from': yesterday,
            'apikey': GNEWS_API_KEY
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        news_data = response.json()
        return news_data.get('articles', [])
    except Exception as e:
        st.error(f"Error fetching news: {str(e)}")
        return []

def fetch_weather_alerts():
    """Fetch detailed weather data for Mumbai"""
    try:
        current_url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': 'Mumbai,in',
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(current_url, params=params)
        response.raise_for_status()
        current_weather = response.json()
        
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast"
        response = requests.get(forecast_url, params=params)
        response.raise_for_status()
        forecast = response.json()
        
        return current_weather, forecast
    except Exception as e:
        st.error(f"Error fetching weather: {str(e)}")
        return None, None

def check_severe_weather(current, forecast):
    """Check for severe weather conditions"""
    severe_conditions = []
    
    if not current or not forecast:
        return severe_conditions
    
    wind_speed = current.get('wind', {}).get('speed', 0)
    if wind_speed > 20:
        severe_conditions.append(f"High winds detected: {wind_speed} m/s")
    
    rain = current.get('rain', {}).get('1h', 0)
    if rain > 50:
        severe_conditions.append(f"Heavy rainfall: {rain}mm/h")
    
    for item in forecast.get('list', []):
        if 'rain' in item and item['rain'].get('3h', 0) > 100:
            severe_conditions.append("Risk of flooding in next 5 days")
            break
            
    return severe_conditions

def main():
    st.set_page_config(page_title="Mumbai Crime & Weather Dashboard", layout="wide")
    
    st.markdown("""
        <style>
        /* Base styles */
        .stApp {
            background-color: #F8F2EF !important;
            padding-top: 0 !important;
            margin-top: 0 !important;
        }
        
        .main-title {
            color: #1E1E1E !important;
            font-weight: 700 !important;
            font-size: 32px !important;
            text-align: center !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
            background: linear-gradient(45deg, #FF4B2B, #FF416C) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            padding: 10px 0 !important;
            margin: 0 0 20px 0 !important;
            border-bottom: 2px solid rgba(0,0,0,0.1) !important;
        }
        
        .news-card {
            display: flex !important;
            gap: 15px !important;
            padding: 20px !important;
            margin-bottom: 20px !important;
            border-radius: 15px !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
            transition: transform 0.2s ease !important;
        }
        
        .news-card:hover {
            transform: translateY(-2px) !important;
        }
        
        .news-image {
            width: 200px !important;
            min-width: 200px !important;
            height: 150px !important;
            object-fit: cover !important;
            border-radius: 10px !important;
        }
        
        .news-content {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            gap: 10px !important;
        }
        
        .news-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            line-height: 1.4 !important;
            margin: 0 !important;
        }
        
        .news-description {
            font-size: 14px !important;
            color: #555 !important;
            line-height: 1.6 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            margin: 0 !important;
        }
        
        .news-footer {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-top: auto !important;
        }
        
        .news-source {
            color: #666 !important;
            font-size: 13px !important;
            font-weight: 500 !important;
        }
        
        .read-more {
            text-decoration: none !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            padding: 6px 12px !important;
            border-radius: 6px !important;
            transition: all 0.3s ease !important;
        }
        
        .read-more:hover {
            opacity: 0.9 !important;
            transform: translateX(2px) !important;
        }
        
        /* Weather section styles */
        .weather-container {
            background: linear-gradient(135deg, #FF8C42, #FF5733) !important;
            border-radius: 15px !important;
            padding: 25px !important;
            color: white !important;
            margin-bottom: 30px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        /* Mobile optimization */
        @media screen and (max-width: 768px) {
            .main-title {
                font-size: 24px !important;
                padding: 10px 0 !important;
            }
            
            .news-card {
                flex-direction: column !important;
                padding: 15px !important;
                gap: 12px !important;
            }
            
            .news-image {
                width: 100% !important;
                min-width: unset !important;
                height: 200px !important;
            }
            
            .news-content {
                gap: 8px !important;
            }
            
            .news-title {
                font-size: 16px !important;
            }
            
            .news-description {
                font-size: 13px !important;
                -webkit-line-clamp: 3 !important;
            }
            
            .weather-container {
                padding: 20px !important;
                margin-bottom: 20px !important;
            }
        }
        
        /* Tablet optimization */
        @media screen and (min-width: 769px) and (max-width: 1024px) {
            .news-card {
                padding: 18px !important;
            }
            
            .news-image {
                width: 180px !important;
                min-width: 180px !important;
            }
        }
        
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
        
        /* Remove top padding from streamlit container */
        .block-container {
            padding-top: 0 !important;
        }
        
        div[data-testid="stToolbar"] {
            display: none !important;
        }
        
        </style>
    """, unsafe_allow_html=True)
    
    # Main title
    st.markdown('<h1 class="main-title">🚨 Mumbai Crime News & Weather Alerts</h1>', unsafe_allow_html=True)
    
    # Weather Section
    current_weather, forecast = fetch_weather_alerts()
    if current_weather and forecast:
        temp = current_weather.get('main', {}).get('temp', 'N/A')
        weather_desc = current_weather.get('weather', [{}])[0].get('description', '').capitalize()
        
        severe_conditions = check_severe_weather(current_weather, forecast)
        
        st.markdown(
            f"""
            <div class="weather-container">
                <h3 style='margin: 0 0 15px 0; font-size: 22px; font-weight: 600;'>Current Weather in Mumbai</h3>
                <div style='display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;'>
                    <div>
                        <p style='margin: 0; font-size: 18px;'>🌡️ Temperature: {temp}°C</p>
                        <p style='margin: 8px 0 0 0; font-size: 18px;'>🌤️ Conditions: {weather_desc}</p>
                    </div>
                    <div>
                        {
                            '<div style="background: rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 8px;">'
                            '<p style="margin: 0; color: #FFD700; font-weight: 600;">⚠️ Severe Weather Alert</p>'
                            '</div>' if severe_conditions else
                            '<div style="background: rgba(255,255,255,0.2); padding: 10px 15px; border-radius: 8px;">'
                            '<p style="margin: 0; font-weight: 600;">✅ Normal Weather Conditions</p>'
                            '</div>'
                        }
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    # News Section
    news_articles = fetch_crime_news()
    
    if not news_articles:
        st.warning("⚠️ No crime news available at the moment. Please check back later.")
        return
    
    for idx, article in enumerate(news_articles):
        bg_color = "#FFFFFF" if idx % 2 == 0 else "#F8FBFF"
        text_color = "#E65100" if idx % 2 == 0 else "#1976D2"
        
        st.markdown(
            f"""
            <div class="news-card" style="background-color: {bg_color};">
                <img class="news-image" 
                     src="{article.get('image', 'https://via.placeholder.com/200x150')}"
                     alt="News Image">
                <div class="news-content">
                    <div>
                        <h3 class="news-title" style="color: {text_color};">
                            {article.get('title')}
                        </h3>
                        <p class="news-description">
                            {article.get('description')}
                        </p>
                    </div>
                    <div class="news-footer">
                        <span class="news-source">
                            📰 {article.get('source', {}).get('name')}
                        </span>
                        <a href="{article.get('url')}"
                           target="_blank"
                           class="read-more"
                           style="background-color: {text_color}; color: white;">
                            Read Full Article →
                        </a>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

if __name__ == "__main__":
    main()