import { useState } from "react"
import { X, MapPin, IndianRupeeIcon, Clock, Star, StickyNote, Globe, Phone, Mail, CheckCircle, Calendar, Users, Link, Info, Landmark } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import UnsplashImage from "./unsplash"

interface Activity {
  type: string
  name: string
  address: string
  time_duration: string
  operating_hours: string
  description: string
  location: string
  longitude: string
  latitude: string
  photo_url: string
  crowd_density: string
  estimated_cost: string
  rating: number
  review: string
  relevent_url: string[]
  availability: string
  amenities: string
  phone_number: string
  email: string
}

interface DailyItinerary {
  date: string
  day_no: string
  description: string
  daily_itenary: Activity[]
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-current" : "opacity-20")} />
      ))}
    </div>
  )
}

export default function Timeline({ data }: { data: DailyItinerary[] }) {
  const [selectedCards, setSelectedCards] = useState<Activity[]>([])
  const [noteText, setNoteText] = useState("")

  const handleCardSelect = (activity: Activity) => {
    setSelectedCards((prev) =>
      prev.includes(activity) ? prev.filter((card) => card !== activity) : [...prev, activity]
    )
  }

  const handleSubmit = () => {
    console.log("Selected Cards:", selectedCards)
    console.log("Note Text:", noteText)
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      {data.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-12">
          <div className="sticky top-20 z-10 mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-4xl font-bold">{day.day_no}</h2>
            <p className="text-muted-foreground text-lg">{day.date}</p>
            <p className="text-muted-foreground text-lg">{day.description}</p>
          </div>
          <div className="relative ml-4">
            {day.daily_itenary.map((activity, activityIndex) => (
              <motion.div
                key={activityIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: activityIndex * 0.1 }}
                className="relative mb-6 ml-6"
              >
                <div className="absolute -left-10 top-4 h-full w-px bg-border" />
                <div className="absolute -left-12 top-4 h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md" />
                <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-semibold">{activity.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("z-10", selectedCards.includes(activity) && "text-destructive")}
                        onClick={() => handleCardSelect(activity)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div>
                        <UnsplashImage apiUrl={activity.photo_url} />
                      </div>
                      <div>
                        <div className="mb-4 space-y-2">
                          <p className="flex items-center gap-2"><MapPin /> {activity.location}</p>
                          <p className="flex items-center gap-2"><Globe /> {activity.address}</p>
                          <p className="flex items-center gap-2"><Clock /> {activity.time_duration} ({activity.operating_hours})</p>
                          <p className="flex items-center gap-2"><IndianRupeeIcon /> {activity.estimated_cost}</p>
                          <p className="flex items-center gap-2"><Users /> Crowd: {activity.crowd_density}</p>
                          <p className="flex items-center gap-2"><Phone /> {activity.phone_number}</p>
                          <p className="flex items-center gap-2"><Mail /> {activity.email}</p>
                          <p className="flex items-center gap-2"><CheckCircle /> Availability: {activity.availability}</p>
                          <p className="flex items-center gap-2"><Info /> Amenities: {activity.amenities}</p>
                          <p className="text-xl">{activity.description}</p>
                        </div>
                        <StarRating rating={activity.rating} />
                        <p className="mt-2 text-sm italic">{activity.review}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 p-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg">
        <div className="container mx-auto flex flex-col gap-4 md:flex-row">
          <Textarea placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <Button onClick={handleSubmit} className="flex items-center gap-2 text-lg">
            <StickyNote className="h-5 w-5" /> Submit
          </Button>
        </div>
      </div>
    </div>
  )
}