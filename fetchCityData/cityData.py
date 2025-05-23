import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Set Gemini API Key (Replace with your actual key)
GENAI_API_KEY = "AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ"
genai.configure(api_key=GENAI_API_KEY)

@app.route('/get_city_info', methods=['GET'])
def get_city_info():
    city = request.args.get('city', '')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        # Generate query for Gemini
        prompt = f"""
        Provide a detailed travel guide about {city}, including the following sections in JSON format. 
        Ensure the response strictly adheres to the schema below:

        {{
          "travel_guide": {{
            "history_and_cultural_significance": "A brief description of the city's history and cultural importance.",
            "famous_landmarks_and_attractions": [
              {{
                "name": "Name of the landmark or attraction",
                "description": "A brief description of the landmark or attraction."
              }}
            ],
            "local_cuisine_and_must_try_dishes": [
              {{
                "name": "Name of the dish",
                "description": "A brief description of the dish."
              }}
            ],
            "unique_traditions_or_festivals": [
              {{
                "name": "Name of the tradition or festival",
                "description": "A brief description of the tradition or festival."
              }}
            ],
            "safety_measures_and_crowd_density": {{
              "safety_measures": "A brief description of safety measures for tourists.",
              "crowd_density": "A brief description of crowd density in the city."
            }},
            "public_transport_options": [
              {{
                "name": "Name of the transport option",
                "description": "A brief description of the transport option."
              }}
            ],
            "upcoming_events_or_special_activities": [
              {{
                "name": "Name of the event or activity",
                "description": "A brief description of the event or activity.",
                "date": "Date or time frame of the event (if available)."
              }}
            ]
          }}
        }}

        Do not include any additional text or explanations outside the JSON structure.
        """

        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)

        # Extract and parse the JSON response
        city_info = json.loads(response.text)
        print(city_info)
        return jsonify({"city": city, "info": city_info})

    except json.JSONDecodeError as e:
        return jsonify({"error": f"Invalid JSON response from Gemini: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)

