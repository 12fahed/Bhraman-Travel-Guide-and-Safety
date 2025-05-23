import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime
import plotly.graph_objects as go

# Page configuration
st.set_page_config(
    page_title="Mumbai Crime Map",
    page_icon="🗺️",
    layout="wide"
)

# Load data
@st.cache_data
def load_data():
    file_path = "data/data2.csv"
    df = pd.read_csv(file_path)
    df['date_time'] = pd.to_datetime(df['date_time'])
    return df

# Load the crime data
df = load_data()

# Header section
st.title("🗺️ Mumbai Crime Map")
st.markdown("### Interactive Visualization of Crime Incidents in Mumbai")

# Filters in main page
col1, col2, col3 = st.columns(3)

with col1:
    min_date = df['date_time'].min().date()
    max_date = df['date_time'].max().date()
    date_range = st.date_input(
        "Select Date Range",
        value=(min_date, max_date),
        min_value=min_date,
        max_value=max_date
    )

with col2:
    crime_categories = ['All Categories'] + list(df["crime_type"].unique())
    selected_category = st.selectbox("Select Crime Category:", crime_categories)

with col3:
    weather_conditions = ['All Weather'] + list(df["weather_condition"].unique())
    selected_weather = st.selectbox("Select Weather Condition:", weather_conditions)

# Apply filters
mask = (df['date_time'].dt.date >= date_range[0]) & (df['date_time'].dt.date <= date_range[1])
filtered_df = df[mask]

if selected_category != 'All Categories':
    filtered_df = filtered_df[filtered_df["crime_type"] == selected_category]
if selected_weather != 'All Weather':
    filtered_df = filtered_df[filtered_df["weather_condition"] == selected_weather]

# Create three columns for stats
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Incidents", len(filtered_df))

with col2:
    most_common_type = filtered_df['crime_type'].mode().iloc[0] if not filtered_df.empty else "N/A"
    st.metric("Most Common Crime", most_common_type)

with col3:
    most_common_weather = filtered_df['weather_condition'].mode().iloc[0] if not filtered_df.empty else "N/A"
    st.metric("Most Common Weather", most_common_weather)

# Display the map
if filtered_df.empty:
    st.warning("No data available for the selected filters.")
else:
    st.markdown("### 🎯 Crime Incidents Map")
    
    fig = px.scatter_mapbox(
        filtered_df,
        lat="Latitude",
        lon="Longitude",
        hover_name="crime_type",
        hover_data={
            "crime_type": True,
            "description": True,
            "date_time": True,
            "weather_condition": True,
            "Latitude": False,
            "Longitude": False
        },
        color="crime_type",
        size_max=15,
        zoom=10,
        height=600,
        title="Crime Incidents in Mumbai"
    )
    
    fig.update_layout(
        mapbox_style="carto-positron",
        mapbox_center={
            "lat": filtered_df["Latitude"].mean(),
            "lon": filtered_df["Longitude"].mean(),
        },
        margin={"r": 0, "t": 0, "l": 0, "b": 0}
    )

    st.plotly_chart(fig, use_container_width=True)

    # Add time series analysis with area chart
    st.markdown("### 📈 Time Series Analysis")
    daily_crimes = filtered_df.groupby(filtered_df['date_time'].dt.date).size().reset_index()
    daily_crimes.columns = ['Date', 'Count']
    
    fig_time = go.Figure()
    fig_time.add_trace(go.Scatter(
        x=daily_crimes['Date'],
        y=daily_crimes['Count'],
        fill='tozeroy',
        fillcolor='rgba(0, 100, 255, 0.2)',
        line=dict(color='rgb(0, 100, 255)', width=2),
        mode='lines',
        name='Daily Incidents',
        hovertemplate='Date: %{x}<br>Incidents: %{y}<extra></extra>'
    ))
    
    fig_time.update_layout(
        title={
            'text': 'Daily Crime Incidents Over Time',
            'y': 0.95,
            'x': 0.5,
            'xanchor': 'center',
            'yanchor': 'top'
        },
        xaxis_title='Date',
        yaxis_title='Number of Incidents',
        height=400,
        showlegend=False,
        hovermode='x unified',
        xaxis=dict(showgrid=True, gridcolor='rgba(0,0,0,0.1)'),
        yaxis=dict(showgrid=True, gridcolor='rgba(0,0,0,0.1)'),
        plot_bgcolor='white'
    )
    
    st.plotly_chart(fig_time, use_container_width=True)

# Footer
st.markdown("---")
st.markdown("*Data is for demonstration purposes only. For more information, please contact the appropriate authorities.*")
