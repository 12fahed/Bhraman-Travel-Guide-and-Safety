import { useState } from "react";
// import { Button, Card, CardContent, Spinner } from "@/components/ui";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { CardContent } from "./components/ui/card";
import { Loader } from "lucide-react";
import Timeline from "./timeline";
import ItineraryForm from "./itineraryForm";

export default function ItineraryFetcher() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const fetchItinerary = async () => {
    setLoading(true);
    setResponse(null);

    let headersList = {
      "Content-Type": "application/json",
    };

    let bodyContent = localStorage.getItem("bodyContent");

    try {
      let response = await fetch("http://127.0.0.1:5000/generate_itinerary", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });
      let data = await response.text();
      setResponse(data);
    } catch (error) {
      setResponse("Failed to fetch itinerary: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 -z-50">
      <ItineraryForm/>
      <Button onClick={fetchItinerary} disabled={loading}>
        {loading ? (
          <Loader
            className="animate-spin"
            size="sm"
          />
        ) : (
          "Generate Itinerary"
        )}
      </Button>
      {loading && <p className="mt-4">Fetching your itinerary...</p>}
      {response && (
        <Timeline data={JSON.parse(response)} />
      )}
    </div>
  );
}
