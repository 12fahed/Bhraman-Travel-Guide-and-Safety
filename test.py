import google.generativeai as genai
from pydantic import BaseModel
import enum
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import enum

class ItineraryType(str, enum.Enum):
    ACTIVITY = "activity"
    REST = "rest"
    HOTEL = "hotel"
    MOTEL = "motel"
    RESORT = "resort"
    VILLA = "villa"
    RESTAURANT = "restaurant"
    CAFE = "cafe"
    BISTRO = "bistro"
    BAR = "bar"
    PUB = "pub"
    OTHER_DINING = "other_dining"
    CAR = "car"
    BUS = "bus"
    TRAIN = "train"
    FLIGHT = "flight"
    SHIP = "ship"
    OTHER_TRANSPORTATION = "other_transportation"
     
class ItenaryItem(BaseModel):
    type: ItineraryType
    name: str
    address: str
    time_duration: str
    operating_hours:str
    description: str
    location: str
    longitude: str
    latitude: str
    photo_url: str   
    crowd_density:str
    estimated_cost: str
    rating: str
    review: str
    relevent_url:list[str]
    availability: str
    amenities: str
    phone_number: str
    email: str
    
    
class DaySchema(BaseModel):
  day_no: str
  date: str
  description:str
  daily_itenary: list[ItenaryItem]

app = Flask(__name__)
CORS(app)

@app.route('/generate_itinerary', methods=['POST'])
def generate_itinerary():
    user_data = request.json
    # json to text
    user_data_str = json.dumps(user_data)
    
    client = genai.Client(api_key="AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ")
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=[
            f"""
            You are a travel itinerary planner AI. Given data about the user, create the travel itinerary for the user.
            Start from the very beginning of the travel journey till the end of the trip. Also, add a photo URL:
            url = f"https://api.unsplash.com/search/photos?query=[KEYWORD]&client_id=MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM&per_page=1"
            Given User Data:{user_data_str}
            """
        ],
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[DaySchema],
        },
    )
    return json.loads(response.text)

# @app.route('/change_itinerary', methods=['POST'])
# def change_itinerary():
#     user_data = request.json
    
#     my_query = json.dumps(user_data.my_query)
#     itenary_previous = json.dumps(user_data.previous_itinerary)
#     item_to_be_changed=

#     client = genai.Client(api_key="AIzaSyAbD22OH2n6zAqPQAz4lzfS6E_2vHMYtMQ")
#     response = client.models.generate_content(
#         model='gemini-2.0-flash',
#         contents=[
#             f"""
#             You are a travel itinerary planner AI. You are assigned to change the following parts from the given itenary based of {myquery}
#             Given User Data:{user_data_str}
#             """
#         ],
#         config={
#             'response_mime_type': 'application/json',
#             'response_schema': list[DaySchema],
#         },
#     )
#     return json.loads(response.text)

    
if __name__ == '__main__':
    app.run(debug=True)

        #         real time data ->weather_description:Cloudy
        #             "transportation": {
        #   "status": ",
        #   "delays": "${transportDelays}",
        #   "alternateRoutes": [${alternateRoutes}],
        #   "trafficConditions": "${trafficConditions}"
        # },
#  "localEvents": [
#           {
#             "eventName": "${eventName}",
#             "eventDate": "${eventDate}",
#             "eventLocation": "${eventLocation}",
#             "description": "${eventDescription}",
#             "ticketPrice": "${eventTicketPrice}",
#             "bookingUrl": "${eventBookingUrl}"
#           }
#         ],
#         "crowdDensity": "${crowdDensity}",

        #  "safety": {
#           "travelAdvisory": "${travelAdvisory}",
#           "emergencyHotlines": [${emergencyHotlines}],
#           "policeContact": "${policeContact}"
#         }
#       },
#       ], 
#         "localInsights": "${localInsights}",
#         "sustainabilityTips": "${sustainabilityTips}",
#         "offbeatExperiences": [${offbeatExperiences}]
#       "safetyAdvisories": {
#         "localHealthAdvisory": "${healthAdvisory}",
#         "travelAdvisory": "${travelAdvisory}",
#         "currencyExchangeRate": "${exchangeRate}",
#         "emergencyServices": "${emergencyServices}"
#       },
#       
#         "bookingReference": "${accommodationBookingReference}"
#       },
#       "emergencyContacts": [
#         {
#           "name": "${emergencyContactName}",
#           "relationship": "${emergencyContactRelationship}",
#           "phone": "${emergencyContactPhone}"
#         }
#       ]
#     }
#   }