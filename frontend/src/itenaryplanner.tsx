import { useState, useEffect } from "react";
import { Plane, DollarSign, Clock, MapPin, Utensils, Bed } from "lucide-react";

const dummyItinerary = {
  tripDetails: {
    travelMode: "Flight",
    totalTripExpense: 5000,
    duration: "7 days",
    startDate: "2025-03-01",
    endDate: "2025-03-07",
    bufferTime: "2 hours",
    predictedDelay: "30 minutes",
    currencyType: "USD",
    mustVisitActivities: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
  },
  days: [
    {
      dayNumber: 1,
      date: "2025-03-01",
      description: "Arrival in Paris and City Exploration",
      activities: [
        {
          type: "transportation",
          name: "Flight to Paris",
          time: "08:00",
          description: "Depart from home airport to Paris Charles de Gaulle Airport",
          location: "Paris Charles de Gaulle Airport",
          estimatedCost: 800,
          duration: "8 hours",
          notes: "Remember to check in online",
        },
      ],
    },
  ],
};

export default function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setItinerary(dummyItinerary);
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Paris Adventure</h1>
      <TripOverview tripDetails={itinerary.tripDetails} />
      {itinerary.days.map((day) => (
        <DayItinerary key={day.dayNumber} day={day} />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto p-4">
      <div className="h-12 w-3/4 bg-gray-200 animate-pulse mb-6"></div>
    </div>
  );
}

function TripOverview({ tripDetails }) {
  return (
    <div className="mb-6 border p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center">
          <Plane className="mr-2" />
          <span>{tripDetails.travelMode}</span>
        </div>
      </div>
    </div>
  );
}

function DayItinerary({ day }) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{day.description}</p>
      {day.activities.map((activity, index) => (
        <ActivityCard key={index} activity={activity} />
      ))}
    </div>
  );
}

function ActivityCard({ activity }) {
  const icons = {
    transportation: Plane,
    accommodation: Bed,
    activity: MapPin,
    dining: Utensils,
  };
  const Icon = icons[activity.type];

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Icon className="mr-2" size={16} />
            <h3 className="font-semibold">{activity.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
        </div>
      </div>
    </div>
  );
}
