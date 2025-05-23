import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const TrafficMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDsVbHr2_avl8f3_71E37KphbEFkSaTPnI&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => setIsScriptLoaded(true);
    } else {
      setIsScriptLoaded(true);
    }

    window.initMap = () => {
      if (!mapRef.current) return;

      const location = { lat: 28.7041, lng: 77.1025 }; // Mumbai coordinates
      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: location,
      });

      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);

      getTrafficCongestion(location);
    };

    const getTrafficCongestion = (destination: google.maps.LatLngLiteral) => {
      const origin = { lat: 28.7041, lng: 77.1025 }; // Navi Mumbai
      const directionsService = new google.maps.DirectionsService();

      const futureTime = new Date();
      futureTime.setMinutes(futureTime.getMinutes() + 10);

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: futureTime,
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
      };

      directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const durationWithTraffic =
            response.routes[0].legs[0].duration_in_traffic?.value || 0;
          const normalDuration = response.routes[0].legs[0].duration.value;

          const congestionLevel = durationWithTraffic / normalDuration;
          let trafficStatus = "Moderate";

          if (congestionLevel > 1.5) {
            trafficStatus = "Heavy";
          } else if (congestionLevel > 1.2) {
            trafficStatus = "Moderate";
          } else {
            trafficStatus = "Light";
          }

          const statusElement = document.getElementById("traffic-status");
          if (statusElement)
            statusElement.innerText = `Traffic Status: ${trafficStatus}`;
        } else {
          console.error("Directions request failed:", status);
          const statusElement = document.getElementById("traffic-status");
          if (statusElement)
            statusElement.innerText = "Could not fetch traffic data.";
        }
      });
    };
  }, []);

  return (
    <Card className="p-4 max-w-2xl mx-auto">
      <CardContent>
        {/* <h2 className="text-xl font-bold mb-4">Mumbai Traffic Congestion</h2> */}
        <div ref={mapRef} className="h-[500px] w-full rounded-lg shadow-md" />
        <p id="traffic-status" className="mt-4 text-lg font-semibold">
          Fetching traffic data...
        </p>
      </CardContent>
    </Card>
  );
};

export default TrafficMap;
