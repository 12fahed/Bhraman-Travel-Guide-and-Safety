import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from 'lucide-react'
import { useNavigate } from "react-router-dom";
const travelPreferences = [
    "Beaches",
    "Mountains",
    "Cities",
    "Historical Sites",
    "Wildlife Safaris",
    "Road Trips",
    "Cruises",
    "Adventure Sports",
    "Cultural Festivals",
    "Luxury Resorts",
    "Camping",
    "Island Hopping",
    "Snowy Destinations",
    "Desert Tours",
    "Forests & Jungles",
    "Vineyard Tours",
    "Scuba Diving",
    "Hot Springs",
    "Ski Resorts",
    "Lakeside Retreats",
    "Backpacking",
    "Glamping",
    "Volcano Exploration",
    "Train Journeys",
    "Stargazing Locations",
    "Theme Parks",
    "Eco-Tourism",
    "Waterfalls",
    "Castle Tours",
    "Food & Wine Tours",
    "Spiritual Retreats",
    "Photography Trips",
    "Fishing Escapades",
    "Desert Stargazing",
    "Cycling Tours",
    "River Cruises",
    "Ghost Towns",
    "Cave Exploration",
    "Botanical Gardens",
    "Wildflower Trails",
    "Geothermal Pools",
    "Safari Lodges",
    "Ice Hotels",
    "Architectural Wonders",
    "Music Festivals",
    "Art Retreats",
    "National Parks",
    "Secluded Beaches",
    "Lighthouse Stays",
    "Urban Exploration",
    "Cliffside Resorts",
    "Marine Sanctuaries",
    "Yoga & Wellness Retreats",
    "Mountain Villages",
    "Underground Cities",
    "Historical Battlefields",
    "Ancient Ruins",
    "Polar Expeditions",
    "Jungle Treks",
    "Luxury Trains",
    "Sand Dune Adventures",
    "Carnival Celebrations",
    "Medieval Towns",
    "Sunset Cruises",
    "Balloon Safaris",
    "Chocolate Tours",
    "Island Retreats",
    "Harbor Towns",
    "Fjords & Glaciers",
    "Wildlife Rehabilitation Centers",
    "Astronomy Camps",
    "Archaeological Sites",
    "Countryside B&Bs",
    "Rainforest Lodges",
    "Wilderness Survival Experiences",
    "Opera & Theater Tours",
    "Historic Villages",
    "Whale Watching",
    "Lavender Fields",
    "Antique Markets",
    "Coastal Cliffs",
    "Skydiving Destinations",
    "Surfing Hotspots",
    "Winter Festivals",
    "Alpine Meadows",
    "Geysers & Springs",
    "Pet-Friendly Resorts",
    "Artisan Villages",
    "Tea Plantations",
    "Cherry Blossom Spots",
    "Desert Oases",
    "Shipwreck Diving",
    "Horseback Riding Trails",
    "Floating Villages",
    "Sustainable Farms",
    "Hidden Caves",
    "Seaside Boardwalks",
    "Rock Climbing Spots",
    "Historic Lighthouses",
    "Abandoned Castles",
    "Bird Watching Sanctuaries",
    "Crystal Clear Lakes",
  ];
  

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function TravelPreferenceSelector() {
  const [selected, setSelected] = useState<string[]>([])
  const navigate = useNavigate()
  const togglePreference = (preference: string) => {
    setSelected((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference]
    )
  }


  const handleSubmit = () => {
    console.log("Selected Travel Preferences:", selected)
    localStorage.setItem("travelPreferences", JSON.stringify(selected))
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-white p-6 pt-40">
      <h1 className="text-zinc-800 text-3xl font-semibold mb-12 text-center">
        What are your travel preferences?
      </h1>
      <div className="max-w-[570px] mx-auto">
        <motion.div 
          className="flex flex-wrap gap-3 overflow-visible"
          layout
          transition={transitionProps}
        >
          {travelPreferences.map((preference) => {
            const isSelected = selected.includes(preference)
            return (
              <motion.button
                key={preference}
                onClick={() => togglePreference(preference)}
                layout
                initial={false}
                animate={{
                    backgroundColor: isSelected ? "#ffedd5" : "#fff7ed",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "#fed7aa" : "#ffedd5",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "#fdba74" : "#fed7aa",
                  }}
  
                transition={{ ...transitionProps, backgroundColor: { duration: 0.1 } }}
                className={
                  `inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${isSelected 
                    ? "text-orange-700 ring-orange-300" 
                    : "text-zinc-600 ring-zinc-300"}`
                }
              >
                <motion.div 
                  className="relative flex items-center"
                  animate={{ 
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.5rem" : "0",
                  }}
                  transition={{ ease: [0.175, 0.885, 0.32, 1.275], duration: 0.3 }}
                >
                  <span>{preference}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={transitionProps}
                        className="absolute right-0"
                      >
                        <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={1.5} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
      <button 
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2  bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition disabled:bg-orange-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  )
}
