import os
import streamlit as st
import pandas as pd
import plotly.express as px
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
# from components.sos_button import sos_button
# sos_button()

# Load the dataset
csv_path = "D:\\ApartFC\\hackathon\\rubix\\rubix-2025\\backend\\data\\IndianWeatherRepository.csv"  # Update with the actual path

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
@st.cache_data
def load_data(path):
    return pd.read_csv(path)

df = load_data(csv_path)

# Streamlit App Title
st.title("Know your weather")

# Sidebar Filters
regions = df["region"].unique()
selected_region = st.selectbox("Select Region", ["All"] + list(regions))

if selected_region != "All":
    df = df[df["region"] == selected_region]

locations = df["location_name"].unique()
selected_location = st.selectbox("Select Location", ["All"] + list(locations))

if selected_location != "All":
    df = df[df["location_name"] == selected_location]

# Display Data
# st.write("### Filtered Weather Data")
# st.dataframe(df)

# Temperature Visualization
st.write("### Temperature Distribution")
fig_temp = px.bar(df, x="location_name", y="temperature_celsius", color="condition_text", title="Temperature by Location")
st.plotly_chart(fig_temp)

# Humidity Visualization
st.write("### Humidity Levels")
fig_humidity = px.line(df, x="location_name", y="humidity", markers=True, title="Humidity by Location")
st.plotly_chart(fig_humidity)

# Wind Speed Visualization
st.write("### Wind Speed Analysis")
fig_wind = px.scatter(df, x="location_name", y="wind_kph", color="wind_direction", size="wind_kph", title="Wind Speed and Direction")
st.plotly_chart(fig_wind)

# Air Quality Visualization
st.write("### Air Quality Overview")
fig_air_quality = px.bar(df, x="location_name", y=["air_quality_PM2.5", "air_quality_PM10"], barmode="group", title="Air Quality (PM2.5 & PM10)")
st.plotly_chart(fig_air_quality)

# Summary Stats
# st.write("### Weather Summary Statistics")
# st.write(df.describe())

# Feature Engineering
df['risk_factor'] = np.random.rand(len(df))  # Placeholder for risk factor calculation

# Model Training
features = ["latitude", "longitude", "temperature_celsius", "humidity", "wind_kph", "air_quality_PM2.5", "air_quality_PM10"]
target = "risk_factor"

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

# Model Evaluation
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Streamlit App Title
st.title("Weather Risk Prediction Dashboard")

# Risk Prediction Input
st.write("### Predict Risk Factor")
latitude = st.number_input("Latitude", value=19.237188)
longitude = st.number_input("Longitude", value=72.844139)
temperature = st.number_input("Temperature (°C)", value=33.0)
humidity = st.number_input("Humidity", value=70)
wind_kph = st.number_input("Wind Speed (kph)", value=15.0)
air_quality_pm25 = st.number_input("PM2.5", value=12.0)
air_quality_pm10 = st.number_input("PM10", value=20.0)

input_data = pd.DataFrame([[latitude, longitude, temperature, humidity, wind_kph, air_quality_pm25, air_quality_pm10]], columns=features)
predicted_risk = model.predict(input_data)[0]

st.write(f"### Predicted Risk Factor: {predicted_risk:.2f}")
st.write("#### Risk Factor Interpretation")
st.write("The risk factor is a measure of the overall weather risk based on the input parameters.")
st.write("A higher risk factor indicates a higher risk of adverse weather conditions.")
st.write("The predicted risk factor is")
if predicted_risk < 0.7:
    st.write("## `low`")
elif predicted_risk < 0.9:
    st.write("## `moderate`")
else:
    st.write("## `high`")


# Model Performance Metrics
st.write("### Model Performance")
st.write(f"Mean Squared Error: {mse:.4f}")
st.write(f"R-squared Score: {r2:.4f}")