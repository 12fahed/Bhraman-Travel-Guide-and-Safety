import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from 'lucide-react'
import { useNavigate } from "react-router-dom";

const placesVisitedAlready = [
    "Mumbai, Maharashtra",
    "Delhi",
    "Kolkata, West Bengal",
    "Chennai, Tamil Nadu",
    "Bengaluru, Karnataka",
    "Hyderabad, Telangana",
    "Jaipur, Rajasthan",
    "Udaipur, Rajasthan",
    "Jodhpur, Rajasthan",
    "Agra, Uttar Pradesh",
    "Varanasi, Uttar Pradesh",
    "Lucknow, Uttar Pradesh",
    "Amritsar, Punjab",
    "Shimla, Himachal Pradesh",
    "Manali, Himachal Pradesh",
    "Dharamshala, Himachal Pradesh",
    "Rishikesh, Uttarakhand",
    "Haridwar, Uttarakhand",
    "Dehradun, Uttarakhand",
    "Mussoorie, Uttarakhand",
    "Leh, Ladakh",
    "Srinagar, Jammu and Kashmir",
    "Gulmarg, Jammu and Kashmir",
    "Kargil, Ladakh",
    "Ahmedabad, Gujarat",
    "Surat, Gujarat",
    "Vadodara, Gujarat",
    "Rann of Kutch, Gujarat",
    "Dwarka, Gujarat",
    "Somnath, Gujarat",
    "Pune, Maharashtra",
    "Nashik, Maharashtra",
    "Aurangabad, Maharashtra",
    "Lonavala, Maharashtra",
    "Mahabaleshwar, Maharashtra",
    "Goa",
    "Panaji, Goa",
    "Madurai, Tamil Nadu",
    "Kanyakumari, Tamil Nadu",
    "Coimbatore, Tamil Nadu",
    "Ooty, Tamil Nadu",
    "Kodaikanal, Tamil Nadu",
    "Pondicherry",
    "Thanjavur, Tamil Nadu",
    "Mysuru, Karnataka",
    "Hampi, Karnataka",
    "Gokarna, Karnataka",
    "Chikmagalur, Karnataka",
    "Belur, Karnataka",
    "Kochi, Kerala",
    "Thiruvananthapuram, Kerala",
    "Alleppey, Kerala",
    "Munnar, Kerala",
    "Wayanad, Kerala",
    "Thekkady, Kerala",
    "Varkala, Kerala",
    "Bhubaneswar, Odisha",
    "Puri, Odisha",
    "Konark, Odisha",
    "Cuttack, Odisha",
    "Gangtok, Sikkim",
    "Darjeeling, West Bengal",
    "Kalimpong, West Bengal",
    "Siliguri, West Bengal",
    "Shillong, Meghalaya",
    "Cherrapunji, Meghalaya",
    "Tawang, Arunachal Pradesh",
    "Itanagar, Arunachal Pradesh",
    "Aizawl, Mizoram",
    "Imphal, Manipur",
    "Agartala, Tripura",
    "Kohima, Nagaland",
    "Dimapur, Nagaland",
    "Kaziranga, Assam",
    "Guwahati, Assam",
    "Majuli, Assam",
    "Jorhat, Assam",
    "Patna, Bihar",
    "Bodh Gaya, Bihar",
    "Rajgir, Bihar",
    "Nalanda, Bihar",
    "Ranchi, Jharkhand",
    "Jamshedpur, Jharkhand",
    "Deoghar, Jharkhand",
    "Raipur, Chhattisgarh",
    "Bastar, Chhattisgarh",
    "Bilaspur, Chhattisgarh",
    "Bhopal, Madhya Pradesh",
    "Indore, Madhya Pradesh",
    "Gwalior, Madhya Pradesh",
    "Ujjain, Madhya Pradesh",
    "Khajuraho, Madhya Pradesh",
    "Sanchi, Madhya Pradesh",
    "Ajmer, Rajasthan",
    "Pushkar, Rajasthan",
    "Mount Abu, Rajasthan",
    "Alwar, Rajasthan",
    "Jaisalmer, Rajasthan",
    "Andaman and Nicobar Islands",
    "Port Blair, Andaman and Nicobar Islands",
    "Havelock Island, Andaman and Nicobar Islands",
    "Lakshadweep",
    "Kavaratti, Lakshadweep",  
    "Paris, France",
    "Tokyo, Japan",
    "New York City, USA",
    "London, England",
    "Rome, Italy",
    "Barcelona, Spain",
    "Sydney, Australia",
    "Bangkok, Thailand",
    "Dubai, UAE",
    "Istanbul, Turkey",
    "Amsterdam, Netherlands",
    "Singapore",
    "Cairo, Egypt",
    "Rio de Janeiro, Brazil",
    "Moscow, Russia",
    "Berlin, Germany",
    "Athens, Greece",
    "Seoul, South Korea",
    "Cape Town, South Africa",
    "Bali, Indonesia",
    "Los Angeles, USA",
    "Toronto, Canada",
    "Beijing, China",
    "Lisbon, Portugal",
    "Venice, Italy",
    "Prague, Czech Republic",
    "Havana, Cuba",
    "Mumbai, India",
    "Buenos Aires, Argentina",
    "Marrakech, Morocco",
    "Kyoto, Japan",
    "Vienna, Austria",
    "Kuala Lumpur, Malaysia",
    "Zurich, Switzerland",
    "Jerusalem, Israel",
    "Lima, Peru",
    "Reykjavik, Iceland",
    "Bogotá, Colombia",
    "Ho Chi Minh City, Vietnam",
    "San Francisco, USA",
    "Edinburgh, Scotland",
    "Bruges, Belgium",
    "Santiago, Chile",
    "Manila, Philippines",
    "Jaipur, India",
    "Zanzibar, Tanzania",
    "Kraków, Poland",
    "Dubrovnik, Croatia",
    "Cusco, Peru",
    "Helsinki, Finland",
    "Montreal, Canada",
    "Wellington, New Zealand",
    "Brasília, Brazil",
    "Antalya, Turkey",
    "Chiang Mai, Thailand",
    "Copenhagen, Denmark",
    "Casablanca, Morocco",
    "Yerevan, Armenia",
    "Mexico City, Mexico",
    "Seville, Spain",
    "Stockholm, Sweden",
    "Budapest, Hungary",
    "Macau, China",
    "Luxor, Egypt",
    "Nairobi, Kenya",
    "Vancouver, Canada",
    "Florence, Italy",
    "Jakarta, Indonesia",
    "Colombo, Sri Lanka",
    "Brisbane, Australia",
    "Oslo, Norway",
    "Phnom Penh, Cambodia",
    "Quito, Ecuador",
    "Cartagena, Colombia",
    "San Juan, Puerto Rico",
    "Kigali, Rwanda",
    "Amman, Jordan",
    "Medellín, Colombia",
    "Valencia, Spain",
    "Split, Croatia",
    "Addis Ababa, Ethiopia",
    "Hội An, Vietnam",
    "Sarajevo, Bosnia and Herzegovina",
    "Montevideo, Uruguay",
    "La Paz, Bolivia",
    "Riga, Latvia",
    "Tallinn, Estonia",
    "Belgrade, Serbia",
    "Porto, Portugal",
    "Warsaw, Poland",
    "Anchorage, USA",
    "Mykonos, Greece",
    "Palermo, Italy",
    "Baku, Azerbaijan",
    "Lagos, Nigeria",
    "Guatemala City, Guatemala",
    "San José, Costa Rica",
    "Kingston, Jamaica",
    "Muscat, Oman",
    "Thimphu, Bhutan",
    "Windhoek, Namibia",
    "Victoria, Seychelles",
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
    localStorage.setItem("placesVisitedAlready", JSON.stringify(selected))
    navigate("/preferences")
  }

  return (
    <div className="min-h-screen bg-white p-6 pt-40">
      <h1 className="text-zinc-800 text-3xl font-semibold mb-12 text-center">
        Which places have you visited already?
      </h1>
      <div className="max-w-[570px] mx-auto">
        <motion.div 
          className="flex flex-wrap gap-3 overflow-visible"
          layout
          transition={transitionProps}
        >
          {placesVisitedAlready.map((preference) => {
            const isSelected = selected.includes(preference)
            return (
              <motion.button
                key={preference}
                onClick={() => togglePreference(preference)}
                layout
                initial={false}
                animate={{
                    backgroundColor: isSelected ? "#ede9fe" : "#faf5ff",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "#d8b4fe" : "#ede9fe",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "#c084fc" : "#d8b4fe",
                  }}
                  
                transition={{ ...transitionProps, backgroundColor: { duration: 0.1 } }}
                className={
                  `inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${isSelected 
                    ? "text-purple-700 ring-purple-300" 
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
                        <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
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
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2  bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transition disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  )
}
