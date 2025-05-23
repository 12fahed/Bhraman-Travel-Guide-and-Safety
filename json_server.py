from flask import Flask, jsonify, request, send_from_directory
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

JSON_FOLDER = os.path.join(os.getcwd(), 'assets')
os.makedirs(JSON_FOLDER, exist_ok=True)

def load_json(file_name):
    try:
        with open(os.path.join(JSON_FOLDER, file_name), 'r', encoding='utf-8') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError, UnicodeDecodeError) as e:
        return {"error": f"Failed to load {file_name}: {str(e)}"}

@app.route('/')
def home():
    return "Welcome to the JSON Hosting API! Access /activities or /destinations. Use query params for filtering and pagination."


def paginate(data, page, limit):
    start = (page - 1) * limit
    end = start + limit
    return data[start:end]


@app.route('/activities')
def get_activities():
    activities = load_json('activities.json')
    if isinstance(activities, dict) and 'error' in activities:
        return jsonify(activities), 404

    query_params = request.args.to_dict()
    page = int(query_params.pop('page', 1))
    limit = int(query_params.pop('limit', 10))

    filtered_activities = [activity for activity in activities if all(
        str(activity.get(key, '')).lower() == value.lower() for key, value in query_params.items()
    )]

    paginated_activities = paginate(filtered_activities, page, limit)

    return jsonify({
        "data": paginated_activities,
        "total": len(filtered_activities),
        "page": page,
        "limit": limit
    })


@app.route('/destinations')
def get_destinations():
    destinations = load_json('destinations.json')
    if isinstance(destinations, dict) and 'error' in destinations:
        return jsonify(destinations), 404

    query_params = request.args.to_dict()
    page = int(query_params.pop('page', 1))
    limit = int(query_params.pop('limit', 10))

    filtered_destinations = [destination for destination in destinations if all(
        str(destination.get(key, '')).lower() == value.lower() for key, value in query_params.items()
    )]

    paginated_destinations = paginate(filtered_destinations, page, limit)

    return jsonify({
        "data": paginated_destinations,
        "total": len(filtered_destinations),
        "page": page,
        "limit": limit
    })


if __name__ == '__main__':
    app.run(debug=True)

# Now you can query with pagination like:
# http://127.0.0.1:5000/activities?destination=queenstown&page=1&limit=5
# http://127.0.0.1:5000/destinations?country=Dominican%20Republic&page=2&limit=10

# Let me know if you want any adjustments! 🚀
