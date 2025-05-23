
import streamlit as st
import pandas as pd
import numpy as np
import folium
from streamlit_folium import folium_static
import plotly.express as px
from datetime import datetime, timedelta

# Page config
st.set_page_config(
    page_title="Bhraman",
    page_icon="🛡️",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
     *{
        font-family: 'Poppins', sans-serif;
        }
    .main {
        padding: 1rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.title("Bhraman")
st.subheader("Real-time Travel Safety & Risk Assessment Platform")

# Main description
st.markdown("""
    Bhraman combines advanced artificial intelligence with real-time data 
    to provide comprehensive travel safety insights and risk assessment. Make informed 
    decisions about your journey with our cutting-edge security analysis system.
""")

# on click button get started go to next page
if st.button("Get Started"):
    st.session_state.current_page = "pages/new.py"

# Create columns for key metrics
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("""
        <div class="metric-card">
        <h3>🎯 Safety Score</h3>
        <h2>92/100</h2>
        <p>Current Area Rating</p>
        </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
        <div class="metric-card">
        <h3>🌦️ Weather Risk</h3>
        <h2>Low</h2>
        <p>Next 24 Hours</p>
        </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
        <div class="metric-card">
        <h3>👥 Active Users</h3>
        <h2>2,547</h2>
        <p>Real-time Reports</p>
        </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown("""
        <div class="metric-card">
        <h3>⚡ Incidents</h3>
        <h2>3</h2>
        <p>Last Hour</p>
        </div>
    """, unsafe_allow_html=True)

# Interactive Map Section
st.header("📍 Live Safety Map")
st.write("Explore real-time safety insights across different locations")

# Create a sample map centered on a default location
m = folium.Map(location=[40.7128, -74.0060], zoom_start=12)

# Add some sample markers
folium.CircleMarker(
    location=[40.7128, -74.0060],
    radius=30,
    popup="High Safety Zone",
    color="#28a745",
    fill=True,
).add_to(m)

folium.CircleMarker(
    location=[40.7228, -74.0160],
    radius=20,
    popup="Medium Risk Area",
    color="#ffc107",
    fill=True,
).add_to(m)

# Display the map
folium_static(m)

# Features Section
st.header("🚀 Key Features")

tab1, tab2, tab3, tab4 = st.tabs([
    "Risk Assessment", 
    "AI-Driven Insights", 
    "Blockchain Verification", 
    "Predictive Analytics"
])

with tab1:
    st.markdown("""
        ### Comprehensive Risk Assessment
        - Real-time crime rate analysis
        - Live weather alert integration
        - Local incident monitoring
        - Emergency service proximity checking
    """)

with tab2:
    st.markdown("""
        ### AI-Powered Route Safety
        - Dynamic safety scoring
        - Historical data analysis
        - Pattern recognition
        - Real-time route optimization
    """)

with tab3:
    st.markdown("""
        ### Blockchain-Verified Reports
        - Immutable safety records
        - Verified crowd reports
        - Transparent rating system
        - Community-driven insights
    """)

with tab4:
    st.markdown("""
        ### Advanced Predictive Analytics
        - Future risk forecasting
        - Trend analysis
        - Hazard prediction
        - Safety recommendations
    """)

# Sample Risk Forecast
st.header("📊 Risk Forecast")
st.write("AI-powered prediction of safety levels for the next 7 days")

# Generate sample forecast data
dates = pd.date_range(start=datetime.now(), periods=7, freq='D')
risk_scores = np.random.normal(80, 10, 7).clip(0, 100)
forecast_df = pd.DataFrame({
    'Date': dates,
    'Risk Score': risk_scores
})

# Create forecast chart
fig = px.line(forecast_df, x='Date', y='Risk Score',
              title='7-Day Safety Forecast',
              labels={'Risk Score': 'Safety Score (0-100)'},
              line_shape='spline')
fig.update_layout(height=400)
st.plotly_chart(fig, use_container_width=True)

# Call to Action
st.header("🔐 Start Protecting Your Journey")
col1, col2, col3 = st.columns([1,2,1])

with col2:
    st.button("Try Bhraman Now", type="primary")
    st.write("Start your 30-day free trial - No credit card required")

# Footer
st.markdown("---")
st.markdown("""
    <div style='text-align: center'>
    <p>Bhraman | Powered by Advanced AI & Blockchain Technology</p>
    </div>
""", unsafe_allow_html=True)