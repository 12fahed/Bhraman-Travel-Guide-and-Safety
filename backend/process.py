import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

# Load dataset
data = pd.read_csv("data/crime.csv")

# Convert date and time to a numerical feature for better modeling
data['hour_decimal'] = pd.to_datetime(data['time'], format="%H:%M:%S").dt.hour + pd.to_datetime(data['time'], format="%H:%M:%S").dt.minute / 60

# Features and target
X = data[['hour_decimal', 'latitude', 'longitude']]
y = data['risk_score']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print("Mean Squared Error:", mse)

# Function to predict risk score
def predict_risk(latitude, longitude, time):
    try:
        time_obj = pd.to_datetime(time, format="%H:%M")
        hour_decimal = time_obj.hour + time_obj.minute / 60
        input_data = pd.DataFrame([[hour_decimal, latitude, longitude]], columns=['hour_decimal', 'latitude', 'longitude'])
        risk_score = model.predict(input_data)[0]
        return risk_score
    except ValueError:
        return "Invalid time format. Use HH:MM"

# Example usage
example_risk_score = predict_risk(19.0760, 72.8777, "14:30")
print("Predicted Risk Score:", example_risk_score)

# Save the trained model for later use
import joblib
joblib.dump(model, "crime_risk_model.pkl")

# Done! 🚀
