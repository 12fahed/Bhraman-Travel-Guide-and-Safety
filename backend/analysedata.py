import streamlit as st
import pandas as pd
import plotly.express as px
import folium
from streamlit_folium import folium_static
import plotly.graph_objects as go
from datetime import datetime, timedelta
import google.generativeai as genai
from typing import Dict, Any
import pandas as pd
import json

api_key = "AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ"

# Page configuration
st.set_page_config(
    page_title="Crime Analysis Dashboard",
    page_icon="🚨",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 0rem 1rem;
    }
    .stTitle {
        font-size: 2.5rem !important;
        color: #1E3D59 !important;
    }
    .stSubheader {
        color: #17A2B8 !important;
        font-size: 1.5rem !important;
    }
    .metric-card {
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    </style>
    """, unsafe_allow_html=True)

# Load dataset with caching
@st.cache_data
def load_data():
    df = pd.read_csv("data/data2.csv", parse_dates=["date_time"])
    df["day_of_week"] = df["date_time"].dt.day_name()
    df["hour"] = df["date_time"].dt.hour
    df["month"] = df["date_time"].dt.month_name()
    return df

# Main header with emoji and subtitle
st.title("🚨 Crime Data Analysis Dashboard")
# st.markdown("*An interactive visualization of crime patterns and trends*")
st.markdown("---")

try:
    df = load_data()
    
    # Create two columns for filters
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 Data Filters")
        selected_crime = st.multiselect(
            "Select Crime Types",
            options=sorted(df["crime_type"].unique()),
            default=df["crime_type"].unique()[:3]  # Default to first 3 types
        )
        
    with col2:
        selected_weather = st.multiselect(
            "Select Weather Conditions",
            options=sorted(df["weather_condition"].unique()),
            default=df["weather_condition"].unique()[:3]
        )
        
    # Date range with min/max values
    min_date = df["date_time"].min().date()
    max_date = df["date_time"].max().date()
    date_range = st.date_input(
        "Select Date Range",
        value=[min_date, max_date],
        min_value=min_date,
        max_value=max_date
    )

    # Apply filters
    filtered_df = df[
        (df["crime_type"].isin(selected_crime)) & 
        (df["weather_condition"].isin(selected_weather)) &
        (df["date_time"].dt.date >= date_range[0]) & 
        (df["date_time"].dt.date <= date_range[1])
    ]

    # Key Metrics
    st.markdown("### 📈 Key Metrics")
    metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
    
    with metric_col1:
        st.markdown("""
            <div class="metric-card">
                <h3 style="margin:0">Total Incidents</h3>
                <h2 style="margin:0; color:#17A2B8">{:,}</h2>
            </div>
        """.format(len(filtered_df)), unsafe_allow_html=True)
        
    with metric_col2:
        most_common_crime = filtered_df["crime_type"].mode()[0]
        st.markdown("""
            <div class="metric-card">
                <h3 style="margin:0">Most Common Crime</h3>
                <h2 style="margin:0; color:#17A2B8">{}</h2>
            </div>
        """.format(most_common_crime), unsafe_allow_html=True)
        
    with metric_col3:
        most_common_day = filtered_df["day_of_week"].mode()[0]
        st.markdown("""
            <div class="metric-card">
                <h3 style="margin:0">Busiest Day</h3>
                <h2 style="margin:0; color:#17A2B8">{}</h2>
            </div>
        """.format(most_common_day), unsafe_allow_html=True)
        
    with metric_col4:
        most_common_weather = filtered_df["weather_condition"].mode()[0]
        st.markdown("""
            <div class="metric-card">
                <h3 style="margin:0">Common Weather</h3>
                <h2 style="margin:0; color:#17A2B8">{}</h2>
            </div>
        """.format(most_common_weather), unsafe_allow_html=True)

    # Interactive Maps and Charts
    st.markdown("### 🗺️ Crime Location Heatmap")
    
    # Create a more sophisticated map
    m = folium.Map(
        location=[filtered_df["Latitude"].mean(), filtered_df["Longitude"].mean()],
        zoom_start=12,
        tiles="cartodbpositron"
    )
    
    # Add heatmap layer
    heat_data = [[row["Latitude"], row["Longitude"]] for index, row in filtered_df.iterrows()]
    folium.plugins.HeatMap(heat_data).add_to(m)
    
    # Add cluster markers
    marker_cluster = folium.plugins.MarkerCluster().add_to(m)
    for idx, row in filtered_df.iterrows():
        folium.Marker(
            [row["Latitude"], row["Longitude"]],
            popup=f"Crime: {row['crime_type']}<br>Date: {row['date_time']}<br>Weather: {row['weather_condition']}",
            icon=folium.Icon(color="red", icon="info-sign")
        ).add_to(marker_cluster)
    
    folium_static(m)

    # Create two columns for charts
    chart_col1, chart_col2 = st.columns(2)
    
    with chart_col1:
        st.markdown("### 📊 Crime Type Distribution")
        crime_counts = filtered_df["crime_type"].value_counts()
        fig_crime = px.pie(
            values=crime_counts.values,
            names=crime_counts.index,
            title="Distribution of Crime Types",
            hole=0.3
        )
        fig_crime.update_traces(textposition='inside', textinfo='percent+label')
        st.plotly_chart(fig_crime, use_container_width=True)
        
    with chart_col2:
        st.markdown("### 🌙 Time of Day Analysis")
        hour_counts = filtered_df["hour"].value_counts().sort_index()
        fig_hour = px.line(
            x=hour_counts.index,
            y=hour_counts.values,
            title="Crime Incidents by Hour",
            labels={"x": "Hour of Day", "y": "Number of Incidents"}
        )
        fig_hour.update_layout(showlegend=False)
        st.plotly_chart(fig_hour, use_container_width=True)

    # Weekly Pattern
    st.markdown("### 📅 Weekly Pattern")
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_counts = filtered_df["day_of_week"].value_counts().reindex(day_order)
    fig_weekly = px.bar(
        x=day_counts.index,
        y=day_counts.values,
        title="Crime Incidents by Day of Week",
        labels={"x": "Day of Week", "y": "Number of Incidents"},
        color=day_counts.values,
        color_continuous_scale="Viridis"
    )
    st.plotly_chart(fig_weekly, use_container_width=True)

    # Data Preview with Download Option
    st.markdown("### 📋 Data Preview")
    st.markdown("*Showing the first 1000 records of filtered data*")
    st.dataframe(
        filtered_df.head(1000)[["date_time", "crime_type", "weather_condition", "Latitude", "Longitude"]],
        use_container_width=True
    )
    
    # Download Button
    csv = filtered_df.to_csv(index=False)
    st.download_button(
        label="📥 Download Filtered Data",
        data=csv,
        file_name="crime_data_filtered.csv",
        mime="text/csv"
    )

except Exception as e:
    st.error(f"An error occurred: {str(e)}")
    st.markdown("Please check your data file and try again.")


def setup_gemini_api(api_key: str):
    """
    Initialize the Gemini API with the provided API key
    """
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    return model

def prepare_crime_statistics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Prepare crime statistics for analysis
    """
    stats = {
        "total_incidents": len(df),
        "crime_distribution": df["crime_type"].value_counts().to_dict(),
        "temporal_patterns": {
            "daily": df["day_of_week"].value_counts().to_dict(),
            "hourly": df["hour"].value_counts().to_dict()
        },
        "weather_correlation": df["weather_condition"].value_counts().to_dict(),
        "monthly_trend": df["month"].value_counts().to_dict()
    }
    
    # Calculate crime rate changes
    stats["trend_analysis"] = {
        "month_over_month_change": calculate_monthly_change(df),
        "peak_crime_hours": df["hour"].value_counts().nlargest(3).index.tolist()
    }
    
    return stats

def calculate_monthly_change(df: pd.DataFrame) -> float:
    """
    Calculate the percentage change in crime rates between the last two months
    """
    monthly_counts = df.set_index('date_time').resample('M').size()
    if len(monthly_counts) >= 2:
        return ((monthly_counts[-1] - monthly_counts[-2]) / monthly_counts[-2] * 100)
    return 0

def generate_analysis_prompt(stats: Dict[str, Any]) -> str:
    """
    Create a detailed prompt for Gemini based on the statistics
    """
    prompt = f"""
    Please analyze the following crime statistics and provide:
    1. A detailed overview of crime patterns
    2. Key insights and trends
    3. Potential contributing factors
    4. Specific recommendations for law enforcement
    5. Community safety suggestions
    
    Statistics:
    - Total Incidents: {stats['total_incidents']}
    - Crime Type Distribution: {json.dumps(stats['crime_distribution'], indent=2)}
    - Daily Patterns: {json.dumps(stats['temporal_patterns']['daily'], indent=2)}
    - Weather Correlation: {json.dumps(stats['weather_correlation'], indent=2)}
    - Monthly Trend: {json.dumps(stats['monthly_trend'], indent=2)}
    - Month-over-Month Change: {stats['trend_analysis']['month_over_month_change']:.2f}%
    - Peak Crime Hours: {stats['trend_analysis']['peak_crime_hours']}
    
    Please structure your analysis with clear sections and actionable insights.
    """
    return prompt

def analyze_crime_data(df: pd.DataFrame, api_key: str) -> Dict[str, str]:
    """
    Main function to analyze crime data using Gemini API
    """
    try:
        # Setup Gemini
        model = setup_gemini_api(api_key)
        
        # Prepare statistics
        stats = prepare_crime_statistics(df)
        
        # Generate and send prompt to Gemini
        prompt = generate_analysis_prompt(stats)
        response = model.generate_content(prompt)
        
        # Parse and structure Gemini's response
        analysis = {
            "overview": response.text.split("Key Insights")[0].strip(),
            "insights": extract_section(response.text, "Key Insights", "Recommendations"),
            "recommendations": extract_section(response.text, "Recommendations", None),
            "raw_statistics": stats
        }
        
        return analysis
        
    except Exception as e:
        return {
            "error": f"Analysis failed: {str(e)}",
            "raw_statistics": stats
        }

def extract_section(text: str, start_marker: str, end_marker: str) -> str:
    """
    Helper function to extract sections from Gemini's response
    """
    try:
        start_idx = text.index(start_marker)
        if end_marker:
            end_idx = text.index(end_marker)
            return text[start_idx:end_idx].strip()
        return text[start_idx:].strip()
    except ValueError:
        return ""

def add_gemini_analysis_to_dashboard(st, df: pd.DataFrame, api_key: str):
    """
    Add Gemini analysis section to the Streamlit dashboard
    """
    st.markdown("### 🤖 AI-Powered Crime Analysis")
    
    if st.button("Generate AI Analysis"):
        with st.spinner("Analyzing crime patterns..."):
            try:
                analysis = analyze_crime_data(df, api_key)
                
                if "error" in analysis:
                    st.error(analysis["error"])
                    return
                
                # Display analysis in expandable sections
                with st.expander("📊 Overview", expanded=True):
                    st.markdown(analysis["overview"])
                
                with st.expander("💡 Key Insights"):
                    st.markdown(analysis["insights"])
                
                with st.expander("📋 Recommendations"):
                    st.markdown(analysis["recommendations"])
                
                # Add download button for full report
                full_report = f"""
                # Crime Analysis Report
                
                ## Overview
                {analysis['overview']}
                
                ## Key Insights
                {analysis['insights']}
                
                ## Recommendations
                {analysis['recommendations']}
                
                ## Statistical Summary
                ```json
                {json.dumps(analysis['raw_statistics'], indent=2)}
                ```
                """
                
                st.download_button(
                    label="📥 Download Full Analysis",
                    data=full_report,
                    file_name="crime_analysis_report.md",
                    mime="text/markdown"
                )
                
            except Exception as e:
                st.error(f"Failed to generate analysis: {str(e)}")

add_gemini_analysis_to_dashboard(st, filtered_df, api_key)