import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder

# Load your CSV dataset
df = pd.read_csv('D:\\ApartFC\\hackathon\\hacknova\\hacknova\\data\\maha-crime.csv')

# For demonstration, we create a risk label.
# Here we assume that violent crimes (e.g. Murder) are high risk,
# property crimes (e.g. Theft) are low risk,
# and any others might be medium.
def assign_risk(row):
    if row['Crime_Category'].lower() == 'violent':
        return 'High'
    elif row['Crime_Category'].lower() == 'property':
        return 'Low'
    else:
        return 'Medium'

df['Risk_Level'] = df.apply(assign_risk, axis=1)

# Select features for the model. In this example, we use a few categorical features.
features = ['District', 'City', 'Crime_Category', 'Crime_Type', 'Crime_Subtype']
X = df[features]
y = df['Risk_Level']

# Convert categorical variables to dummy/indicator variables.
X_encoded = pd.get_dummies(X, drop_first=True)

# Optionally, encode the target labels (Risk_Level) into numbers.
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split the data into training and test sets.
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y_encoded, test_size=0.3, random_state=42)

# Create and train the random forest classifier.
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate the model.
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
