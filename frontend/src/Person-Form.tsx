import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MinusCircle, PlusCircle, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
L.Icon.Default.prototype.options.iconUrl = markerIcon;
L.Icon.Default.prototype.options.shadowUrl = markerIconShadow;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});

const LocationMarker = ({ position, setPosition }: { position: [number, number]; setPosition: React.Dispatch<React.SetStateAction<[number, number]>> }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const HouseholdForm = () => {
  const [name, setName] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]);
  const [error, setError] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const budgetRanges = [
    "₹10,000 - ₹30,000",
    "₹30,000 - ₹50,000",
    "₹50,000 - ₹1,00,000",
    "₹1,00,000 - ₹3,00,000",
    "₹3,00,000 - ₹5,00,000",
    "₹5,00,000 - ₹10,00,000"
  ];

  const handleIncrement = () => setPeopleCount(prev => prev + 1);
  const handleDecrement = () => setPeopleCount(prev => prev > 1 ? prev - 1 : 1);

  const handleSubmit = () => {
    if (!name.trim() || !position) {
      setError('Please fill out all required fields.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    alert('Form submitted successfully!');
  };

  const handleReset = () => {
    setName('');
    setPeopleCount(1);
    setPosition([20.5937, 78.9629]);
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center py-8 px-4 text-black" 
         style={{ backgroundImage: "url('https://png.pngtree.com/background/20210711/original/pngtree-vintage-wind-labor-day-theme-ray-orange-yellow-texture-background-picture-image_1147593.jpg" }}>
      <div className="max-w-4xl mx-auto text-black">
        <Card className="backdrop-blur-sm bg-white/90 text-black">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              Your First Step
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className="text-lg p-6 focus:ring-orange-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Full Name"
                aria-describedby="name-error"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Household Members Counter */}
            <div className="space-y-2">
  <Label className="text-lg font-medium">
    Number of People in Household
  </Label>
  <div className="flex items-center space-x-4">
    <Button
      variant="outline"
      size="icon"
      onClick={handleDecrement}
      className="h-10 w-10 bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-700"
    >
      <MinusCircle className="h-6 w-6" />
    </Button>
    <Input
      type="number"
      value={peopleCount}
      onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
      className="text-center text-lg w-24 focus:ring-orange-500"
    />
    <Button
      variant="outline"
      size="icon"
      onClick={handleIncrement}
      className="h-10 w-10 bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-700"
    >
      <PlusCircle className="h-6 w-6" />
    </Button>
  </div>
</div>

            {/* Budget Range */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">
                Budget Range
              </Label>
              <RadioGroup defaultValue={budgetRanges[0]} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetRanges.map((range) => (
                  <div key={range} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-orange-50 transition-colors">
                    <RadioGroupItem value={range} id={range} className="text-orange-600" />
                    <Label htmlFor={range} className="text-base">
                      {range}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Location Map */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">
                Location
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your address"
                  className="pr-10 text-lg p-6 focus:ring-orange-500"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={position}
                  zoom={5}
                  className="h-full w-full"
                  whenReady={() => setIsMapLoading(false)}
                >
                  {isMapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <p className="text-orange-500">Loading map...</p>
                    </div>
                  )}
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="flex space-x-4">
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-lg font-semibold">Are you sure you want to submit?</p>
            <div className="flex space-x-4 mt-4">
              <Button onClick={handleConfirm}>Yes</Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdForm;