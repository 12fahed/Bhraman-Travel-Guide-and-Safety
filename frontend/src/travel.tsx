import { useState } from "react";
import {
  Plane,
  Hotel,
  Route,
  Train,
  Bus,
  Car,
  Activity,
  Calendar,
  Gift,
  MapPin,
  Star,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Nav from "./newNav.tsx";
import ItineraryFetcher from "./alternate.tsx";
export default function TravelTabs() {
  const [selectedTransport, setSelectedTransport] = useState("plane");

  // Sample data for activities
  const buses = [
    {
      "company": "GreenLine",
      "logo": "https://source.unsplash.com/40x40/?bus,green",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "08:00 - 18:00 (Next Day)",
      "price": "₹2,500",
      "description": "Comfortable AC sleeper bus service from Mumbai to Siliguri."
    },
    {
      "company": "Royal Cruiser",
      "logo": "https://source.unsplash.com/40x40/?bus,royal",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "10:00 - 20:00 (Next Day)",
      "price": "₹2,800",
      "description": "Luxury AC bus service with onboard amenities for a relaxing journey."
    },
    {
      "company": "Neeta Tours and Travels",
      "logo": "https://source.unsplash.com/40x40/?bus,neeta",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "09:00 - 19:00 (Next Day)",
      "price": "₹2,200",
      "description": "Affordable AC sleeper bus service with frequent departures."
    },
    {
      "company": "Sharma Transports",
      "logo": "https://source.unsplash.com/40x40/?bus,sharma",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "11:00 - 21:00 (Next Day)",
      "price": "₹2,000",
      "description": "Budget-friendly non-AC bus service for economical travelers."
    },
    {
      "company": "Orange Tours",
      "logo": "https://source.unsplash.com/40x40/?bus,orange",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "07:00 - 17:00 (Next Day)",
      "price": "₹2,400",
      "description": "Reliable AC bus service with comfortable seating and overnight travel."
    },
    {
      "company": "Hans Travels",
      "logo": "https://source.unsplash.com/40x40/?bus,hans",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "12:00 - 22:00 (Next Day)",
      "price": "₹2,300",
      "description": "AC sleeper bus service with modern amenities for a smooth journey."
    },
    {
      "company": "Sai Nath Travels",
      "logo": "https://source.unsplash.com/40x40/?bus,sai",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "08:30 - 18:30 (Next Day)",
      "price": "₹2,100",
      "description": "Affordable bus service with comfortable seating and overnight travel."
    },
    {
      "company": "Paulo Travels",
      "logo": "https://source.unsplash.com/40x40/?bus,paulo",
      "from": "Mumbai",
      "to": "Siliguri",
      "time": "10:30 - 20:30 (Next Day)",
      "price": "₹2,600",
      "description": "Premium AC bus service with onboard entertainment and snacks."
    }
  ];
  
  const cars = [
    {
      "company": "Zoomcar",
      "logo": "https://source.unsplash.com/40x40/?zoomcar,car",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹2,000/day",
      "description": "Rent a self-drive car from Zoomcar at Bagdogra Airport and drive to Gangtok at your convenience."
    },
    {
      "company": "Revv",
      "logo": "https://source.unsplash.com/40x40/?revv,car",
      "from": "Siliguri",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹2,500/day",
      "description": "Book a self-drive car from Revv in Siliguri and enjoy a scenic drive to Gangtok."
    },
    {
      "company": "MyChoize",
      "logo": "https://source.unsplash.com/40x40/?mychoize,car",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹2,200/day",
      "description": "Affordable self-drive car rental service with a wide range of vehicles to choose from."
    },
    {
      "company": "Avis",
      "logo": "https://source.unsplash.com/40x40/?avis,car",
      "from": "Siliguri",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹3,000/day",
      "description": "Premium self-drive car rental service with well-maintained vehicles and excellent customer support."
    },
    {
      "company": "Drivezy",
      "logo": "https://source.unsplash.com/40x40/?drivezy,car",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹1,800/day",
      "description": "Budget-friendly self-drive car rental service with flexible pickup and drop-off options."
    },
    {
      "company": "Eco Rent A Car",
      "logo": "https://source.unsplash.com/40x40/?eco,car",
      "from": "Siliguri",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹2,300/day",
      "description": "Reliable self-drive car rental service with a variety of vehicles for solo and family travelers."
    },
    {
      "company": "Car Club",
      "logo": "https://source.unsplash.com/40x40/?carclub,car",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹2,400/day",
      "description": "Self-drive car rental service with a focus on safety and customer satisfaction."
    },
    {
      "company": "Hertz",
      "logo": "https://source.unsplash.com/40x40/?hertz,car",
      "from": "Siliguri",
      "to": "Gangtok",
      "time": "Flexible",
      "price": "₹3,500/day",
      "description": "Global car rental brand offering premium self-drive cars for a luxurious travel experience."
    }
  ];
  
  const others = [
    {
      "company": "Private Taxi",
      "logo": "https://source.unsplash.com/40x40/?taxi,car",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "4-5 hours",
      "price": "₹1,800",
      "description": "Hire a private taxi from Bagdogra to Gangtok for a comfortable and direct journey."
    },
    {
      "company": "Shared Cab",
      "logo": "https://source.unsplash.com/40x40/?shared,cab",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "4-5 hours",
      "price": "₹300-500 per person",
      "description": "Shared cabs are a budget-friendly option to travel from Bagdogra to Gangtok."
    },
    {
      "company": "Bike Rental",
      "logo": "https://source.unsplash.com/40x40/?bike,rental",
      "from": "Gangtok",
      "to": "Tsomgo Lake",
      "time": "2 hours",
      "price": "₹800/day",
      "description": "Rent a bike in Gangtok to explore nearby attractions like Tsomgo Lake at your own pace."
    },
    {
      "company": "Helicopter Service",
      "logo": "https://source.unsplash.com/40x40/?helicopter",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "20 minutes",
      "price": "₹4,000-5,000 per person",
      "description": "Enjoy a quick and scenic helicopter ride from Bagdogra to Gangtok."
    },
    {
      "company": "Bus Service",
      "logo": "https://source.unsplash.com/40x40/?bus,travel",
      "from": "Siliguri (NJP)",
      "to": "Gangtok",
      "time": "4-5 hours",
      "price": "₹200-300 per person",
      "description": "State-run and private buses operate regularly between Siliguri and Gangtok."
    },
    {
      "company": "Train + Taxi",
      "logo": "https://source.unsplash.com/40x40/?train,taxi",
      "from": "Mumbai",
      "to": "Gangtok",
      "time": "36-40 hours",
      "price": "₹2,500-3,500",
      "description": "Take a train from Mumbai to New Jalpaiguri (NJP) and then hire a taxi to Gangtok."
    },
    {
      "company": "Flight + Shared Cab",
      "logo": "https://source.unsplash.com/40x40/?flight,cab",
      "from": "Mumbai",
      "to": "Gangtok",
      "time": "4-5 hours (flight) + 4-5 hours (cab)",
      "price": "₹6,000-8,000",
      "description": "Fly from Mumbai to Bagdogra and take a shared cab to Gangtok for a budget-friendly option."
    },
    {
      "company": "Self-Drive Car",
      "logo": "https://source.unsplash.com/40x40/?car,rental",
      "from": "Bagdogra Airport (IXB)",
      "to": "Gangtok",
      "time": "4-5 hours",
      "price": "₹1,500-2,000/day",
      "description": "Rent a self-drive car at Bagdogra Airport and drive to Gangtok at your convenience."
    },
    {
      "company": "Motorcycle Trip",
      "logo": "https://source.unsplash.com/40x40/?motorcycle,trip",
      "from": "Mumbai",
      "to": "Sikkim",
      "time": "5-7 days",
      "price": "₹15,000-20,000",
      "description": "Embark on an adventurous motorcycle trip from Mumbai to Sikkim, covering scenic routes."
    },
    {
      "company": "Flight + Helicopter",
      "logo": "https://source.unsplash.com/40x40/?flight,helicopter",
      "from": "Mumbai",
      "to": "Gangtok",
      "time": "4-5 hours (flight) + 20 minutes (helicopter)",
      "price": "₹8,000-10,000",
      "description": "Fly from Mumbai to Bagdogra and take a helicopter to Gangtok for a luxurious experience."
    }
  ];
  const sikkimActivities = [
    {
      "title": "Tsomgo Lake Visit",
      "image": "https://source.unsplash.com/400x250/?tsomgo,lake",
      "duration": "Full Day",
      "price": "₹2,500",
      "rating": "4.8",
      "description": "Visit the scenic high-altitude Tsomgo Lake with stunning mountain views."
    },
    {
      "title": "Nathula Pass Trek",
      "image": "https://source.unsplash.com/400x250/?nathula,pass",
      "duration": "Full Day",
      "price": "₹3,000",
      "rating": "4.7",
      "description": "Trek to the historic Nathula Pass at the Indo-China border."
    },
    {
      "title": "Gangtok City Tour",
      "image": "https://source.unsplash.com/400x250/?gangtok,city",
      "duration": "Half Day",
      "price": "₹1,500",
      "rating": "4.6",
      "description": "Explore the capital city's monasteries and local markets."
    },
    {
      "title": "Yumthang Valley Excursion",
      "image": "https://source.unsplash.com/400x250/?yumthang,valley",
      "duration": "Full Day",
      "price": "₹3,500",
      "rating": "4.9",
      "description": "Experience the breathtaking beauty of Yumthang Valley, known for its hot springs and vibrant flowers."
    },
    {
      "title": "Zero Point Adventure",
      "image": "https://source.unsplash.com/400x250/?zero,point",
      "duration": "Full Day",
      "price": "₹4,000",
      "rating": "4.8",
      "description": "Visit Zero Point, the last outpost of civilization, surrounded by snow-clad peaks."
    },
    {
      "title": "Rumtek Monastery Tour",
      "image": "https://source.unsplash.com/400x250/?rumtek,monastery",
      "duration": "Half Day",
      "price": "₹1,200",
      "rating": "4.5",
      "description": "Explore the famous Rumtek Monastery, a center of Tibetan Buddhism."
    },
    {
      "title": "Lachung and Lachen Exploration",
      "image": "https://source.unsplash.com/400x250/?lachung,lachen",
      "duration": "2 Days",
      "price": "₹6,000",
      "rating": "4.7",
      "description": "Discover the picturesque villages of Lachung and Lachen, gateways to North Sikkim."
    },
    {
      "title": "River Rafting in Teesta",
      "image": "https://source.unsplash.com/400x250/?teesta,river",
      "duration": "Half Day",
      "price": "₹2,000",
      "rating": "4.6",
      "description": "Enjoy thrilling river rafting on the Teesta River amidst stunning landscapes."
    },
    {
      "title": "Pelling Sightseeing",
      "image": "https://source.unsplash.com/400x250/?pelling,sikkim",
      "duration": "Full Day",
      "price": "₹2,500",
      "rating": "4.7",
      "description": "Visit Pelling's iconic attractions like the Skywalk and Pemayangtse Monastery."
    },
    {
      "title": "Kanchenjunga Base Camp Trek",
      "image": "https://source.unsplash.com/400x250/?kanchenjunga,trek",
      "duration": "5 Days",
      "price": "₹15,000",
      "rating": "4.9",
      "description": "Trek to the base of the world's third-highest peak, Mount Kanchenjunga."
    },
    {
      "title": "Namchi Day Trip",
      "image": "https://source.unsplash.com/400x250/?namchi,sikkim",
      "duration": "Full Day",
      "price": "₹2,000",
      "rating": "4.6",
      "description": "Explore Namchi's Char Dham pilgrimage site and the giant statue of Guru Padmasambhava."
    },
    {
      "title": "Banjhakri Falls Visit",
      "image": "https://source.unsplash.com/400x250/?banjhakri,falls",
      "duration": "Half Day",
      "price": "₹1,000",
      "rating": "4.5",
      "description": "Visit the enchanting Banjhakri Falls, surrounded by lush greenery and folklore."
    },
    {
      "title": "Paragliding in Gangtok",
      "image": "https://source.unsplash.com/400x250/?paragliding,gangtok",
      "duration": "2 Hours",
      "price": "₹3,500",
      "rating": "4.8",
      "description": "Experience the thrill of paragliding with panoramic views of Gangtok and the Himalayas."
    },
    {
      "title": "Temi Tea Garden Tour",
      "image": "https://source.unsplash.com/400x250/?temi,tea",
      "duration": "Half Day",
      "price": "₹1,500",
      "rating": "4.6",
      "description": "Explore the lush Temi Tea Garden, known for producing some of the finest tea in India."
    },
    {
      "title": "Zuluk Silk Route Tour",
      "image": "https://source.unsplash.com/400x250/?zuluk,silkroute",
      "duration": "2 Days",
      "price": "₹5,000",
      "rating": "4.7",
      "description": "Travel along the historic Silk Route, passing through Zuluk and Thambi Viewpoint."
    }
  ]

  // Sample data for flights
  const flights = [
    {
      "company": "IndiGo",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/IndiGo_Logo.svg/40px-IndiGo_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "06:00 - 08:30",
      "price": "₹4,999"
    },
    {
      "company": "SpiceJet",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/SpiceJet_Logo.svg/40px-SpiceJet_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "09:00 - 12:30",
      "price": "₹6,499"
    },
    {
      "company": "Air India",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Air_India_Logo.svg/40px-Air_India_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "07:30 - 10:00",
      "price": "₹5,499"
    },
    {
      "company": "Vistara",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vistara_logo.svg/40px-Vistara_logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "11:00 - 13:30",
      "price": "₹7,299"
    },
    {
      "company": "Go First",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Go_First_Logo.svg/40px-Go_First_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "14:00 - 16:30",
      "price": "₹5,799"
    },
    {
      "company": "IndiGo",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/IndiGo_Logo.svg/40px-IndiGo_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "16:00 - 18:30",
      "price": "₹6,199"
    },
    {
      "company": "SpiceJet",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/SpiceJet_Logo.svg/40px-SpiceJet_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "18:00 - 20:30",
      "price": "₹6,999"
    },
    {
      "company": "Air India",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Air_India_Logo.svg/40px-Air_India_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "20:00 - 22:30",
      "price": "₹5,899"
    },
    {
      "company": "Vistara",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vistara_logo.svg/40px-Vistara_logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "21:00 - 23:30",
      "price": "₹7,499"
    },
    {
      "company": "Go First",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Go_First_Logo.svg/40px-Go_First_Logo.svg.png",
      "from": "Mumbai (BOM)",
      "to": "Bagdogra (IXB)",
      "time": "22:00 - 00:30 (Next Day)",
      "price": "₹6,299"
    }
  ];

  // Sample data for trains
  const trains = [
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai CST",
      "to": "New Jalpaiguri",
      "time": "14:05 - 20:30 (Next Day)",
      "price": "₹1,500",
      "train_name": "LTT NJP SF Express"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "22:45 - 06:00 (2 Days)",
      "price": "₹1,800",
      "train_name": "Karmabhoomi Express"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "08:15 - 15:45 (Next Day)",
      "price": "₹2,200",
      "train_name": "Dadar NJP AC SF Express"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai CST",
      "to": "New Jalpaiguri",
      "time": "23:40 - 07:15 (2 Days)",
      "price": "₹1,600",
      "train_name": "Gitanjali Express"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "12:30 - 19:45 (Next Day)",
      "price": "₹1,900",
      "train_name": "Mumbai NJP SF Special"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "06:00 - 13:30 (Next Day)",
      "price": "₹1,700",
      "train_name": "Mumbai NJP Special Fare Special"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai CST",
      "to": "New Jalpaiguri",
      "time": "15:20 - 22:00 (Next Day)",
      "price": "₹2,000",
      "train_name": "Mumbai NJP AC Special"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "10:00 - 17:30 (Next Day)",
      "price": "₹1,750",
      "train_name": "Mumbai NJP Weekly Special"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai CST",
      "to": "New Jalpaiguri",
      "time": "18:30 - 02:00 (Next Day)",
      "price": "₹1,850",
      "train_name": "Mumbai NJP Superfast Special"
    },
    {
      "company": "Indian Railways",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Indian_Railway_logo.svg/40px-Indian_Railway_logo.svg.png",
      "from": "Mumbai LTT",
      "to": "New Jalpaiguri",
      "time": "07:45 - 15:00 (Next Day)",
      "price": "₹1,950",
      "train_name": "Mumbai NJP Express"
    }
  ]

  // Sample data for hotels
  const hotels = [
    {
      "name": "The Elgin Nor-Khill",
      "image": "https://source.unsplash.com/500x300/?hotel,heritage",
      "rating": "4.7",
      "price": "₹10,500",
      "location": "Gangtok",
      "amenities": ["Heritage Building", "Restaurant", "Garden", "WiFi"],
      "description": "A heritage hotel offering a blend of traditional Sikkimese architecture and modern comforts."
    },
    {
      "name": "Backpacker's Den",
      "image": "https://source.unsplash.com/500x300/?hostel,backpacker",
      "rating": "4.3",
      "price": "₹1,200",
      "location": "Pelling",
      "amenities": ["Dormitory", "Common Kitchen", "WiFi", "Tour Assistance"],
      "description": "A budget-friendly hostel for backpackers, located close to major attractions in Pelling."
    },
    {
      "name": "Yangsum Heritage Farm",
      "image": "https://source.unsplash.com/500x300/?homestay,farm",
      "rating": "4.5",
      "price": "₹6,000",
      "location": "Rinchenpong",
      "amenities": ["Organic Farm", "Mountain View", "Cultural Experience", "WiFi"],
      "description": "A serene homestay offering an authentic rural Sikkimese experience amidst organic farms."
    },
    {
      "name": "Lemon Tree Hotel",
      "image": "https://source.unsplash.com/500x300/?hotel,modern",
      "rating": "4.4",
      "price": "₹7,500",
      "location": "Gangtok",
      "amenities": ["Restaurant", "Fitness Center", "WiFi", "Conference Room"],
      "description": "A modern hotel with vibrant decor and excellent hospitality, ideal for business and leisure travelers."
    },
    {
      "name": "Himalayan Horizon Homestay",
      "image": "https://source.unsplash.com/500x300/?homestay,mountain",
      "rating": "4.6",
      "price": "₹3,500",
      "location": "Lachung",
      "amenities": ["Mountain View", "Home-Cooked Meals", "Bonfire", "Local Guides"],
      "description": "A cozy homestay offering breathtaking views of the Himalayas and warm hospitality."
    },
    {
      "name": "The Wanderer's Hostel",
      "image": "https://source.unsplash.com/500x300/?hostel,travel",
      "rating": "4.2",
      "price": "₹900",
      "location": "Namchi",
      "amenities": ["Dormitory", "Common Lounge", "WiFi", "Bike Rentals"],
      "description": "A vibrant hostel for solo travelers and groups, located near Namchi's famous attractions."
    },
    {
      "name": "Mayur Inn",
      "image": "https://source.unsplash.com/500x300/?hotel,budget",
      "rating": "4.0",
      "price": "₹2,500",
      "location": "Ravangla",
      "amenities": ["Restaurant", "Garden", "WiFi", "Tour Packages"],
      "description": "A budget hotel with comfortable rooms and easy access to Ravangla's scenic spots."
    },
    {
      "name": "Kanchenjunga View Homestay",
      "image": "https://source.unsplash.com/500x300/?homestay,mountain",
      "rating": "4.7",
      "price": "₹4,000",
      "location": "Yuksom",
      "amenities": ["Kanchenjunga View", "Home-Cooked Meals", "Trekking Guides", "Bonfire"],
      "description": "A charming homestay offering stunning views of Mt. Kanchenjunga and a peaceful atmosphere."
    },
    {
      "name": "The Chumbi Mountain Retreat",
      "image": "https://source.unsplash.com/500x300/?luxury,tent",
      "rating": "4.8",
      "price": "₹9,000",
      "location": "Zuluk",
      "amenities": ["Mountain View", "Luxury Tents", "Bonfire", "Local Cuisine"],
      "description": "A luxury retreat offering glamping experiences with panoramic views of the Eastern Himalayas."
    },
    {
      "name": "Sikkim Nature Hostel",
      "image": "https://source.unsplash.com/500x300/?hostel,nature",
      "rating": "4.1",
      "price": "₹1,500",
      "location": "Jorethang",
      "amenities": ["Dormitory", "Common Kitchen", "WiFi", "Nature Tours"],
      "description": "An eco-friendly hostel surrounded by lush greenery, perfect for nature lovers."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 text-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 h-[60vh] bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/8285659/pexels-photo-8285659.jpeg')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      />      
      {/* Tabs Navigation */}
      <div className="relative pt-[20vh] z-[50]">
        <Tabs defaultValue="transport" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-3xl h-18 mx-auto mb-0 grid-cols-6 backdrop-blur-md rounded-xl p-1 shadow-lg bg-white text-gray-800">
            {[
              { value: "transport", icon: Plane, label: "Transport" },
              { value: "hotels", icon: Hotel, label: "Hotels" },
              { value: "activities", icon: Activity, label: "Activities" },
              { value: "itinerary", icon: Calendar, label: "Itinerary" },
              { value: "cab", icon: Car, label: "Cab" },
              { value: "offers", icon: Gift, label: "Offers" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex flex-col items-center gap-1 py-4 rounded-xl relative group transition-all duration-300 text-gray-700 bg-white data-[state=active]:bg-white"
                    >
                    <Icon className="h-6 w-6 transition-colors duration-300 group-data-[state=active]:text-orange-500" />
                    <span className="text-xs font-medium transition-colors duration-300 group-data-[state=active]:text-orange-500">
                        {label}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </TabsTrigger>
            ))}
          </TabsList>

  
            <TabsContent value="transport">
              
            <Card className="border-none bg-white backdrop-blur-md shadow-2xl text-gray-900 ">
            
                <CardContent>
                
                <div className="grid gap-6">
                    {/* Sticky Transport Buttons at the Top */}
                    <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="flex justify-between items-center p-4 mt-0">
                    <div className="border-none bg-white backdrop-blur-md shadow-2xl text-gray-900">26th February, 2025</div>
                        {[
                        { value: "plane", icon: Plane, label: "Plane" },
                        { value: "train", icon: Train, label: "Train" },
                        { value: "bus", icon: Bus, label: "Bus" },
                        { value: "car", icon: Car, label: "Car" },
                        { value: "other", icon: Route, label: "Other" },
                        ].map(({ value, icon: Icon, label }) => (
                        <Button
                            key={value}
                            variant="ghost"
                            className={`flex flex-col gap-1 h-auto py-2 px-4 transition-all duration-300 text-gray-700 hover:bg-orange-50 hover:text-orange-700 ${
                            selectedTransport === value
                                ? "bg-orange-50 text-orange-700"
                                : ""
                            }`}
                            onClick={() => setSelectedTransport(value)}
                        >
                            <Icon className="h-8 w-8" /> {/* Bigger icons */}
                            <span className="text-xs">{label}</span>
                        </Button>
                        ))}
                    </div>
                    </div>

                    {/* Transport Listings */}
                    <div className="pt-0"> {/* Add padding-top to account for the sticky buttons */}
                    {/* Planes */}
                    {selectedTransport === "plane" && (
                        <div className="space-y-4;">
                        {flights.map((flight, index) => (
                            <div
                            key={index}
                            className="flex items-center justify-between shadow-md p-4 border rounded-lg hover:shadow-md transition-shadow bg-white border-stone-200 m-2 shadow-md border-stone-200 hover:shadow-orange-200"
                            >
                            <div className="flex items-center gap-4 border-color: var(--color-stone-700)">
                                <img
                                src={flight.logo}
                                alt={flight.company}
                                className="w-10 h-10 rounded border-color: var(--color-stone-700)"
                                />
                                <div className="border-color: var(--color-stone-700)">
                                <p className="font-medium">{flight.company}</p>
                                <p className="text-sm text-gray-600">{flight.time}</p>
                                </div>
                            </div>
                            <div className="text-center border-color: var(--color-red-100)">
                                <p className="font-medium">
                                {flight.from} → {flight.to}
                                </p>
                                <p className="text-sm text-gray-600">Non-stop</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-orange-500">{flight.price}</p>
                                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                                Book Now
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Trains */}
                    {selectedTransport === "train" && (
                        <div className="space-y-4">
                        {trains.map((train, index) => (
                            <div
                            key={index}
                            className="flex items-center justify-between p-4 border shadow-md border-stone-200 rounded-lg hover:shadow-md transition-shadow bg-white shadow-md border-stone-200 hover:shadow-orange-200"
                            >
                            <div className="flex items-center gap-4">
                                <img
                                src={train.logo}
                                alt={train.company}
                                className="w-10 h-10 rounded"
                                />
                                <div>
                                <p className="font-medium">{train.company}</p>
                                <p className="text-sm text-gray-600">{train.time}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">
                                {train.from} → {train.to}
                                </p>
                                <p className="text-sm text-gray-600">Overnight</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-orange-500">{train.price}</p>
                                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                                Book Now
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Buses */}
                    {selectedTransport === "bus" && (
                        <div className="space-y-6">
                        {buses.map((bus, index) => (
                            <div
                            key={index}
                            className="flex items-center justify-between p-4 border shadow-md border-stone-200 hover:shadow-orange-200  hover:shadow-lg rounded-lg hover:shadow-md transition-shadow bg-white"
                            >
                            <div className="flex items-center gap-4">
                                <img
                                src={bus.logo}
                                alt={bus.company}
                                className="w-10 h-10 rounded"
                                />
                                <div>
                                <p className="font-medium">{bus.company}</p>
                                <p className="text-sm text-gray-600">{bus.time}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">
                                {bus.from} → {bus.to}
                                </p>
                                <p className="text-sm text-gray-600">Direct</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-orange-500">{bus.price}</p>
                                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                                Book Now
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Cars */}
                    {selectedTransport === "car" && (
                        <div className="space-y-4">
                        {cars.map((car, index) => (
                            <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg shadow-md border-stone-200 hover:shadow-orange-200  hover:shadow-lg hover:shadow-md transition-shadow bg-white"
                            >
                            <div className="flex items-center gap-4">
                                <img
                                src={car.logo}
                                alt={car.company}
                                className="w-10 h-10 rounded"
                                />
                                <div>
                                <p className="font-medium">{car.company}</p>
                                <p className="text-sm text-gray-600">{car.time}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">
                                {car.from} → {car.to}
                                </p>
                                <p className="text-sm text-gray-600">Self-drive</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-orange-500">{car.price}</p>
                                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                                Book Now
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}

                    {/* Other */}
                    {selectedTransport === "other" && (
                        <div className="space-y-4">
                        {others.map((other, index) => (
                            <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-white shadow-md border-stone-200 hover:shadow-orange-200"
                            >
                            <div className="flex items-center gap-4">
                                <img
                                src={other.logo}
                                alt={other.company}
                                className="w-10 h-10 rounded"
                                />
                                <div>
                                <p className="font-medium">{other.company}</p>
                                <p className="text-sm text-gray-600">{other.time}</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-medium">
                                {other.from} → {other.to}
                                </p>
                                <p className="text-sm text-gray-600">Custom</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-orange-500">{other.price}</p>
                                <Button variant="outline" size="sm" className="bg-orange-50 text-orange-700">
                                Book Now
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
                </CardContent>
            </Card>
            </TabsContent>

          {/* Hotels Tab Content */}
          <TabsContent value="hotels">
            <Card className="border-none bg-white backdrop-blur-md shadow-xl p-6 text-gray-900">
              <CardContent>
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="flex gap-6 p-4 border shadow-xl border-stone-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-1/3 h-48 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold">{hotel.name}</h3>
                          <p className="text-orange-500 font-semibold">{hotel.price}/night</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{hotel.rating}</span>
                          <MapPin className="h-4 w-4 text-gray-500 ml-2" />
                          <span className="text-gray-600">{hotel.location}</span>
                        </div>
                        <p className="mt-2 text-gray-600">{hotel.description}</p>
                        <div className="flex gap-2 mt-3">
                          {hotel.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <Button className="mt-4 bg-orange-500 text-white hover:bg-orange-600 text-white">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab Content */}
          <TabsContent value="activities">
            <Card className="border-none bg-white backdrop-blur-md shadow-xl p-6 text-gray-900">
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  {sikkimActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden border shadow-lg border-stone-200 hover:shadow-orange-200 transition-shadow"
                    >
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{activity.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{activity.duration}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-current ml-2" />
                          <span className="text-sm">{activity.rating}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-semibold text-orange-500">
                            {activity.price}
                          </span>
                          <Button variant="outline" className="bg-orange-500 text-white border-stone-200">Book Now</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab Content */}
          <TabsContent value="itinerary">
            <Card className="border-none bg-white backdrop-blur-md shadow-xl p-6 text-gray-900">
              <CardContent>
                {/* <div className="space-y-6">
                  {[
                    {
                      day: "Day 1",
                      title: "Arrival & Gangtok City Tour",
                      activities: [
                        "Airport pickup and transfer to hotel",
                        "Visit MG Marg",
                        "Evening local market visit",
                        "Welcome dinner at local restaurant",
                      ],
                    },
                    {
                      day: "Day 2",
                      title: "Tsomgo Lake & Baba Mandir",
                      activities: [
                        "Early morning drive to Tsomgo Lake",
                        "Visit Baba Mandir",
                        "Scenic photography stops",
                        "Evening return to Gangtok",
                      ],
                    },
                    {
                      day: "Day 3",
                      title: "Nathula Pass Trek",
                      activities: [
                        "Trek to Nathula Pass",
                        "Indo-China border visit",
                        "Mountain views and photography",
                        "Evening leisure time",
                      ],
                    },
                  ].map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                          {day.day}
                        </div>
                        <h3 className="text-xl font-semibold">{day.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {day.activities.map((activity, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            <p className="text-gray-700">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div> */}

                <ItineraryFetcher />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cab Tab Content */}
          <TabsContent value="cab">
            <Card className="border-none bg-white backdrop-blur-md p-6 text-gray-900">
              <CardContent>
                <div className="grid grid-cols-3 gap-6 ">
                  {[
                    {
                      type: "Economy",
                      vehicle: "Swift Dzire",
                      price: "₹1,500/day",
                      features: ["4 Seater", "AC", "GPS", "Local Driver"],
                    },
                    {
                      type: "Premium",
                      vehicle: "Toyota Innova",
                      price: "₹2,500/day",
                      features: ["7 Seater", "AC", "GPS", "Local Driver", "WiFi"],
                    },
                    {
                      type: "Luxury",
                      vehicle: "Toyota Fortuner",
                      price: "₹4,500/day",
                      features: ["7 Seater", "AC", "GPS", "Local Driver", "WiFi", "Premium Service"],
                    },
                  ].map((cab, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-6 shadow-xl border-stone-200 hover:shadow-orange-200  hover:shadow-lg transition-shadow"
                    >
                      <Car className="h-8 w-8 text-orange-500 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{cab.type}</h3>
                      <p className="text-gray-600 mb-2">{cab.vehicle}</p>
                      <div className="space-y-2 mb-4">
                        {cab.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            <p className="text-sm text-gray-600">{feature}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-lg font-semibold text-orange-500 mb-4">
                        {cab.price}
                      </p>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Book Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab Content */}
          <TabsContent value="offers">
            <Card className="border-none bg-white backdrop-blur-md shadow-xl p-6 text-gray-900">
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      title: "Sikkim Summer Special",
                      discount: "30% OFF",
                      code: "SIKKIM30",
                      description: "Book your summer trip to Sikkim and get 30% off on hotels",
                      validity: "Valid till 30th June 2025",
                    },
                    {
                      title: "Adventure Package",
                      discount: "20% OFF",
                      code: "TREK20",
                      description: "Special discount on trekking and adventure activities",
                      validity: "Valid till 31st May 2025",
                    },
                    {
                        title: "Family Holiday",
                        discount: "25% OFF",
                        code: "FAMILY25",
                        description: "Family package with hotel and sightseeing included",
                        validity: "Valid till 31st July 2025",
                      },
                      {
                        title: "Honeymoon Special",
                        discount: "35% OFF",
                        code: "HONEY35",
                        description: "Romantic getaway package with luxury hotel stay",
                        validity: "Valid till 31st August 2025",
                      },
                    ].map((offer, index) => (
                      <div
                        key={index}
                        className="bg-orange-100 p-6 rounded-lg border border-orange-500 hover:shadow-xl"
                      >
                        <Gift className="h-6 w-6 text-orange-500 mb-2" />
                        <h3 className="font-medium text-xl mb-2">{offer.title}</h3>
                        <p className="text-orange-500 text-lg">{offer.discount}</p>
                        <p className="text-gray-700 mt-2">{offer.description}</p>
                        <div className="mt-4 p-2 bg-white rounded-md">
                          <p className="text-sm text-gray-700">
                            Use code: <span className="font-bold">{offer.code}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{offer.validity}</p>
                        </div>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
                          Claim Offer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
    );
  }