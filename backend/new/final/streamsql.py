import streamlit as st
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt


st.set_page_config(page_title="Custom Streamlit App", layout="wide")

# Set custom CSS for font and page style
custom_css = """
<style>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Urbanist:wght@400;700&display=swap');
  @font-face {
    font-family: 'LucideIcons';
    src: url(https://unpkg.com/lucide-static@latest/font/Lucide.ttf) format('truetype');
  }

body {
    font-family: 'EB Garamond', serif;
}
*{
    font-family: 'Urbanist', sans-serif !important;
    border-radius: 0;
    }
    
h1, h2, h3, h4, h5, h6 {
    font-family: 'EB Garamond', serif !important;
    font-weight: 600;
}

p {
    font-weight: 400;
    line-height: 1.6;
}

</style>
"""

# Render custom CSS
st.markdown(custom_css, unsafe_allow_html=True)

import streamlit.components.v1 as components

# Custom HTML with JavaScript
custom_html = """
<div class="container">
    <h1>Welcome to the Custom Streamlit App</h1>
    <input id="nameInput" type="text" placeholder="Enter your name here" style="padding: 10px; width: 100%; margin: 10px 0;">
    <button onclick="greetUser()">Greet Me</button>
    <p id="result"></p>
</div>
<img src="https://unpkg.com/lucide-static@latest/icons/house.svg" />
<p class="text-center text-lg text-gray-500">Icon made by <a href="https://lucide.dev/" target="_blank" class="text-blue-500">Lucide</a></p>
<script>
function greetUser() {
    const name = document.getElementById('nameInput').value;
    if (name) {
        alert(`Hello, ${name}! Welcome to the Streamlit app!`);
    } else {
        document.getElementById('result').textContent = 'Please enter your name!';
    }
}
</script>
"""

# Embed HTML content using Streamlit components
components.html(f"{custom_css}{custom_html}", height=400)
import streamlit as st
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import json
data = [300, 50, 100]

# Convert the data list to a JSON string
# data_json = json.dumps(data)

# html_string = f"""
# <head>
#     <meta charset="UTF-8">
#     <meta name="viewport" content="width=device-width, initial-scale=1.0">
#     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
# </head>
# <body class="bg-gray-100 p-8">
# <p class="text-2xl font-bold text-center mb-4 text-orange-500">Interactive Doughnut Chart</p>
#     <div class="shadow-lg rounded-lg overflow-hidden">
#     <div class="py-3 px-5 bg-gray-50">Doughnut chart</div>
#     <canvas class="p-10" id="chartDoughnut"></canvas>
#     </div>

#     <!-- Required chart.js -->
#     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

#     <!-- Chart doughnut -->
#     <script>
#     const dataDoughnut = {{
#         labels: ["JavaScript", "Python", "Ruby"],
#         datasets: [
#         {{
#             label: "My First Dataset",
#             data: {data_json},
#             backgroundColor: [
#             "rgb(133, 105, 241)",
#             "rgb(164, 101, 241)",
#             "rgb(101, 143, 241)",
#             ],
#             hoverOffset: 4,
#         }},
#         ],
#     }};

#     const configDoughnut = {{
#         type: "doughnut",
#         data: dataDoughnut,
#         options: {{}},
#     }};

#     var chartBar = new Chart(
#         document.getElementById("chartDoughnut"),
#         configDoughnut
#     );
#     </script>
# </body>
# """

# st.components.v1.html(html_string, height=1000)

import st_tailwind as tw

tw.initialize_tailwind()

# with tw.container(classes="grid grid-cols-2"):
#     for idx in range(1, 9):
#         st.button(f"Button {idx}")

tw.write("Colored Button", classes="text-purple-500 pb-4")
tw.button("Button", classes="bg-orange-500 w-full")


import streamlit as st
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# User Input for Dummy Data Generation
st.sidebar.header("Data Settings")
num_points = st.sidebar.slider("Number of Data Points", 10, 200, 50)
x_range = st.sidebar.slider("Range of X Values", 0.0, 10.0, (0.0, 5.0))
noise_level = st.sidebar.slider("Noise Level", 0.0, 5.0, 1.0)

# Generate dummy data based on user input
np.random.seed(42)
x = np.random.uniform(x_range[0], x_range[1], num_points).reshape(-1, 1)
y = 4 + 3 * x + np.random.normal(0, noise_level, size=(num_points, 1))

# Convert data to DataFrame for display
data = pd.DataFrame({"Feature (X)": x.flatten(), "Target (Y)": y.flatten()})
st.dataframe(data)

# Train the Linear Regression model
model = LinearRegression()
model.fit(x, y)
y_pred = model.predict(x)

# Streamlit built-in line chart
chart_data = pd.DataFrame({"X": x.flatten(), "Y_actual": y.flatten(), "Y_pred": y_pred.flatten()})
st.line_chart(chart_data, x="X", y=["Y_actual", "Y_pred"], use_container_width=True)

# Display model coefficients
st.subheader("Model Coefficients")
st.write(f"Intercept: {model.intercept_[0]:.2f}")
st.write(f"Slope: {model.coef_[0][0]:.2f}")
st.scatter_chart(data, x="Feature (X)", y="Target (Y)")

# User input for prediction
st.sidebar.header("Make Predictions")
input_value = st.sidebar.number_input("Input a value for X", value=1.0)
if st.sidebar.button("Predict"):
    prediction = model.predict([[input_value]])
    st.sidebar.write(f"Predicted Y: {prediction[0][0]:.2f}")