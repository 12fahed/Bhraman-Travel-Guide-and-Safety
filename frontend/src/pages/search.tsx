// import SearchBar from "../components/SearchBar"
// import ImageResults from "../components/ImageResults"
// import PeopleResults from "../components/PeopleResults"
// import TimeCapsules from "../components/TimeCapsules"
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion"
// import { useState, useEffect, useRef } from "react"
// import { Loader2, Send } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast";
// import { Input } from "@/components/ui/input";
// import VoiceGenerator from "@/components/review-page";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function SearchPage() {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Live memories back, easily</h1>
      <div className="grid grid-cols-2 gap-4">
        <Button className="w-full" onClick={()=>{navigate('ask')}}>Remeber When?</Button>
        <Button className="w-full" onClick={()=>{navigate('consent')}}>Clone Voice</Button>
        <Button className="w-full font-serif" onClick={()=>{navigate('fam')}}>fam</Button>
        <Button className="w-full" onClick={()=>{navigate('')}}>Record</Button>
      </div>
      {/* <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ImageResults />
        <PeopleResults />
      </div>
      <TimeCapsules /> */}
    </div>
  )
}

