"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


const UNSPLASH_ACCESS_KEY = "MtKPMwW2x5cgpY6GQeXmK1EhV08RFAOMt4f68Qg8jzM"
const API_BASE_URL = "http://127.0.0.1:5003"

interface CityInfo {
  travel_guide: {
    history_and_cultural_significance: string
    famous_landmarks_and_attractions: Array<{ name: string; description: string }>
    local_cuisine_and_must_try_dishes: Array<{ name: string; description: string }>
    unique_traditions_or_festivals: Array<{ name: string; description: string }>
    safety_measures_and_crowd_density: {
      safety_measures: string
      crowd_density: string
    }
    public_transport_options: Array<{ name: string; description: string }>
    upcoming_events_or_special_activities: Array<{ name: string; description: string; date: string }>
  }
}

const TrafficMap = ({ city }: { city: string }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [cityLocation, setCityLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (isScriptLoaded && city) {
      fetchCityCoordinates(city);
    }
  }, [isScriptLoaded, city]);

  const fetchCityCoordinates = (cityName: string) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=AIzaSyDsVbHr2_avl8f3_71E37KphbEFkSaTPnI`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const location = data.results[0].geometry.location;
          setCityLocation(location);
          initMap(location);
        } else {
          console.error("Geocoding API Error:", data.status);
        }
      })
      .catch((error) => console.error("Geocoding Error:", error));
  };

  const initMap = (location: google.maps.LatLngLiteral) => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: location,
    });

    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    getTrafficCongestion(location);
  };

  const getTrafficCongestion = (destination: google.maps.LatLngLiteral) => {
    const origin = { lat: 28.7041, lng: 77.1025 }; // Default Origin (Delhi)
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
        const durationWithTraffic = response.routes[0].legs[0].duration_in_traffic?.value || 0;
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
        if (statusElement) statusElement.innerText = `Traffic Status: ${trafficStatus}`;
      } else {
        console.error("Directions request failed:", status);
        const statusElement = document.getElementById("traffic-status");
        if (statusElement) statusElement.innerText = "Could not fetch traffic data.";
      }
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div ref={mapRef} className="h-[500px] w-full rounded-lg shadow-md" />
      <p id="traffic-status" className="mt-4 text-lg font-semibold">
        Fetching traffic data...
      </p>
    </div>
  );
};

export default function MemoryBasedCityCard({ city }: { city: string }) {
  const [cityImages, setCityImages] = useState<Array<{ src: string; alt: string }>>([])
  const [cityInfo, setCityInfo] = useState<CityInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/travel");
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${city}&per_page=5&client_id=${UNSPLASH_ACCESS_KEY}`,
        )
        const data = await response.json()
        setCityImages(data.results.map((img: any) => ({ src: img.urls.small, alt: img.alt_description })))
      } catch (error) {
        console.error("Error fetching images from Unsplash:", error)
        setError("Failed to load city images.")
      }
    }

    const fetchCityInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_city_info?city=${city}`)
        const data = await response.json()
        if (data.info && typeof data.info === "object") {
          setCityInfo(data.info)
        } else {
          setError("No information available for this city.")
        }
      } catch (error) {
        console.error("Error fetching city info from API:", error)
        setError("Failed to load city details.")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
    fetchCityInfo()
  }, [city])

  if (loading) {
    return <div className="text-center py-10">Loading city information...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <motion.h1
        className="text-5xl font-bold text-center mb-10 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {city}
      </motion.h1>

      <ScrollArea className="w-full overflow-x-auto rounded-lg border p-2 bg-gray-100">
        <div className="flex space-x-6 p-2">
          {cityImages.map((image, index) => (
            <Card key={index} className="w-[280px] shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt || `Image of ${city}`}
                      className="w-full h-48 object-cover cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {city} - View {index + 1}
                      </DialogTitle>
                      <DialogDescription>A beautiful view of {city}</DialogDescription>
                    </DialogHeader>
                    <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full rounded-lg" />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {cityInfo && (
        <motion.div
          className="mt-10 bg-white p-6 rounded-lg shadow-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">About {city}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">History and Cultural Significance</h3>
              <p>{cityInfo.travel_guide.history_and_cultural_significance}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Famous Landmarks and Attractions</h3>
              <ul className="list-disc list-inside">
                {cityInfo.travel_guide.famous_landmarks_and_attractions.map((landmark, index) => (
                  <li key={index}>
                    <strong>{landmark.name}:</strong> {landmark.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Local Cuisine and Must-Try Dishes</h3>
              <ul className="list-disc list-inside">
                {cityInfo.travel_guide.local_cuisine_and_must_try_dishes.map((dish, index) => (
                  <li key={index}>
                    <strong>{dish.name}:</strong> {dish.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Unique Traditions or Festivals</h3>
              <ul className="list-disc list-inside">
                {cityInfo.travel_guide.unique_traditions_or_festivals.map((festival, index) => (
                  <li key={index}>
                    <strong>{festival.name}:</strong> {festival.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Safety Measures and Crowd Density</h3>
              <p>
                <strong>Safety Measures:</strong>{" "}
                {cityInfo.travel_guide.safety_measures_and_crowd_density.safety_measures}
              </p>
              <p>
                <strong>Crowd Density:</strong> {cityInfo.travel_guide.safety_measures_and_crowd_density.crowd_density}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Public Transport Options</h3>
              <ul className="list-disc list-inside">
                {cityInfo.travel_guide.public_transport_options.map((transport, index) => (
                  <li key={index}>
                    <strong>{transport.name}:</strong> {transport.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Upcoming Events or Special Activities</h3>
              <ul className="list-disc list-inside">
                {cityInfo.travel_guide.upcoming_events_or_special_activities.map((event, index) => (
                  <li key={index}>
                    <strong>{event.name}:</strong> {event.description} <em>({event.date})</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Live Congestion Map of {city}</h2>
        <div className="rounded-lg overflow-hidden shadow-lg border">
          {/* <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${city}&zoom=12&size=800x400&key=AIzaSyDsVbHr2_avl8f3_71E37KphbEFkSaTPnI`}
            alt={`Map of ${city}`}
            className="w-full h-64 object-cover"
          /> */}
          <TrafficMap city={city}/>
        </div>
      </motion.div>

      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button 
          size="lg" 
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-md px-6 py-3 text-lg"
          onClick={handleClick}
        >
          <Calendar className="mr-2 h-5 w-5" /> Plan a Trip to {city}
        </Button>
      </motion.div>
    </div>
  )
}