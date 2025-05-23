"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Land from "../public/landing_page_image.jpg"
import { Link } from "react-router-dom"


export default function TravelVenture() {
  const [activeTab, setActiveTab] = useState("flight")

  return (
    <div className="min-h-screen relative bg-secondary-foreground/95 ">
      <motion.div 
        className="absolute inset-0 z-0 h-[30rem]"
        style={{
          // backgroundImage: "url('/landing_page_image.jpg')", 
          backgroundImage: `url(${Land})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
      
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>

      <div className="relative z-10 min-h-screen text-white">

        <main className="container mx-auto px-6 py-8 sm:py-16">
          <motion.div 
            className="max-w-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-orange-500 mb-4 text-lg">Your Travel Services</h3>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">Best Escape Choice</h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Experience the Best in Travel: A Journey Beyond Your Imagination, Where Every
              Destination Becomes an Unforgettable Adventure
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 bg-stone-900 shadow-lg rounded-2xl p-6 sm:p-8 max-w-5xl text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-6 border-b  border-gray-200 mb-8">
              <button
                className={`pb-4 px-2 flex items-center gap-2 text-lg transition-all duration-300 ${
                  activeTab === "flight" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("flight")}
              >
                Decided
              </button>
              <button
                className={`pb-4 px-2 flex items-center gap-2 text-lg transition-all duration-300 ${
                  activeTab === "hotel" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("hotel")}
              >
                Undecided
              </button>
            </div>

            {activeTab === "flight" && (
              <div className="space-y-8 text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white">From</label>
                    <Input type="text" placeholder="Enter departure city" className="border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">To</label>
                    <Input type="text" placeholder="Enter destination city" className="border-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">Date</label>
                    <Input type="date" className="border-gray-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-white">Seat</label>
                    <Select>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="1 Passenger" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} Passenger{num > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-full flex items-center gap-2 w-full sm:w-auto"
                    onClick={() => alert('Searching for flights...')}
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            )}

            {activeTab === "hotel" && (
              <div className="text-center py-1">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      Enter Date
                    </label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        className="border border-gray-600 focus:border-orange-400 bg-stone-800 rounded-lg h-12 pl-4 pr-8 mt-0 text-white w-full hover:border-gray-400 transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                <Link to="/recommendation">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      className="bg-orange-500 mt-10 hover:bg-orange-600 h-12 px-8  rounded-full flex items-center gap-2 text-white"
                    >
                      Explore Your Mood
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </motion.div>

          
        </main>
      </div>
    </div>
  )
}