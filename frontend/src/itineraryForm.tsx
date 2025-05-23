import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ItineraryForm() {
  const [userInputs, setUserInputs] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  function createBodyContent(userInputs) {
    const bodyContent = {
      userData: {
        name: "Sushmit",
        userage: "20",
        contactemail: "sushmitsanyal@gmail.com",
        gender: "male",
        languages: localStorage.getItem("languagePreferences"),
        nationality: "Indian",
        maritalstatus: "single",
        travelstyle: localStorage.getItem("travelPreferences"),
        placesAlreadyVisited:localStorage.getItem("placesVisitedAlready"),
        dietaryrestrictions: userInputs.dietaryrestrictions,
        accommodationtype: userInputs.accommodationtype,
        disabilityNeeds: userInputs.disabilityNeeds,
        interests: userInputs.interests,
      },
      tripData: {
        startDestination: userInputs.startDestination,
        toReachDestination: userInputs.toReachDestination,
        startDate: userInputs.startDate,
        endDate: userInputs.endDate,
        budget: userInputs.budget,
        travelstyle: userInputs.travelstyle,
        preferredActivities: userInputs.preferredActivities,
        dietaryrestrictions: userInputs.dietaryrestrictions,
        accommodationtype: userInputs.accommodationtype,
        disabilityNeeds: userInputs.disabilityNeeds,
        interests: userInputs.interests,
      },
    };
    return bodyContent;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const bodyContent = createBodyContent(userInputs);
    localStorage.setItem("bodyContent", JSON.stringify(bodyContent));
    console.log("Generated Body Content:", bodyContent);
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 shadow-lg bg-white text-black ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Trip Itinerary Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
         

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDestination">Start Destination</Label>
              <Input
                type="text"
                name="startDestination"
                placeholder="Where are you starting from?"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="toReachDestination">Destination</Label>
              <Input
                type="text"
                name="toReachDestination"
                placeholder="Where are you going?"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input type="date" name="endDate" onChange={handleChange} />
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Input
                type="text"
                name="budgetRange"
                placeholder="Enter your budget range"
                onChange={handleChange}
              />
            </div>
           
            <div>
              <Label htmlFor="dietaryrestrictions">
                Dietary Restrictions
              </Label>
              <Input
                type="text"
                name="dietaryrestrictions"
                placeholder="Vegan, Vegetarian, Gluten-Free, etc."
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Accessibility & Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accommodationtype">Accommodation Type</Label>
              <Input
                type="text"
                name="accommodationtype"
                placeholder="Hotel, Hostel, Airbnb, etc."
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="disabilityNeeds">
                Accessibility Needs
              </Label>
              <Input
                type="text"
                name="disabilityNeeds"
                placeholder="Wheelchair access, etc."
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interests">Anything else you would like us to know about you?</Label>
            <Textarea
              name="interests"
              placeholder=""
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="transition-transform duration-200 hover:scale-105"
            >
              Save Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
