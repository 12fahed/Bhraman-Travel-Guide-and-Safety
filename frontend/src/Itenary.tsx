import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";

export default function ItineraryFetcher() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);

    try {
      let headersList = {
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        userData: {
          name: "Ritojnan",
          userage: 22,
          contactemail: "6K0o7@example.com",
          gender: "male",
          languages: ["English"],
          nationality: "Indian",
          maritalstatus: "Single",
          travelstyle: "Adventure",
          preferredActivities: ["Hiking"],
          dietaryrestrictions: "Hindu Non-vegetarian",
          accommodationtype: "any",
          disabilityNeeds: "None",
          interests: ["Sci-fi", "Anime", "Traditional"],
        },
        tripData: {
          startDestination: "Mumbai",
          toReachDestination: "Tokyo",
          travelpurpose: "World Exploration",
          roundTrip: true,
          canVisitIntermediatePlaces: true,
          todaysDate: "2025-02-24",
          startDate: "2025-03-02",
          numberOfDays: 5,
          tentativeEndDate: "2025-03-07",
          mustBeBackBy: "2025-03-08",
          currency: "INR",
          budgetRange: "100000-200000",
          visaRequirements: "None",
        },
      });

      let response = await fetch("http://127.0.0.1:5000/generate_itinerary", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }

      let result = await response.json();
      setData(result);
      console.log(result)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Button onClick={fetchItinerary} disabled={loading}>
        {loading ? "Fetching Itinerary..." : "Generate Itinerary"}
      </Button>
      {loading && <p className="text-gray-500">Loading itinerary...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && <Timeline data={data} />}
    </div>
  );
}
