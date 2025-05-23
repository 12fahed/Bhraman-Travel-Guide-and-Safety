import { useUser } from "@/components/hooks/use-user";
import { TimelineDemo } from "@/components/timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Capsule, Media } from "@/lib/types"; // Import Capsule type
import axios from "axios";
import { Clock, Plus, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data
const items = [
   {
      id: 1,
      title: "Summer Memories 2023",
      description: "A collection of our best moments from this summer",
      image: "peeps.jpg",
      sharedBy: [
         { name: "Alex", avatar: "/placeholder.svg" },
         { name: "Sam", avatar: "/placeholder.svg" },
      ],
   },
   {
      id: 2,
      title: "Beach Weekend",
      description: "Unforgettable moments by the ocean",
      image: "csipeeps.jpg",
      sharedBy: [
         { name: "Taylor", avatar: "/placeholder.svg" },
         { name: "Jordan", avatar: "/placeholder.svg" },
      ],
   },
   {
      id: 3,
      title: "Mountain Retreat",
      description: "Adventure in the wilderness",
      image: "/placeholder.svg",
      sharedBy: [
         { name: "Casey", avatar: "/placeholder.svg" },
         { name: "Morgan", avatar: "/placeholder.svg" },
      ],
   },
   {
      id: 4,
      title: "City Lights",
      description: "Urban exploration and nightlife",
      image: "/placeholder.svg",
      sharedBy: [
         { name: "Riley", avatar: "/placeholder.svg" },
         { name: "Jamie", avatar: "/placeholder.svg" },
      ],
   },
];

const suggestedUsers = [
   {
      name: "Sarah Wilson",
      username: "@sarahw",
      avatar: "/placeholder.svg",
   },
   {
      name: "Mike Johnson",
      username: "@mikej",
      avatar: "/placeholder.svg",
   },
   {
      name: "Emma Davis",
      username: "@emmad",
      avatar: "/placeholder.svg",
   },
   // Add more users
];

export default function Page() {
   const navigate = useNavigate();
   const { user } = useUser();

   const [allCapsules, setAllCapsules] = useState<Capsule[]>([]); // use Capsule type
   useEffect(() => {
      const fetchCapsules = async () => {
         try {
            const res = axios.get("http://localhost:3000/api/capsule/get-all", {
               withCredentials: true,
            });
            const res2 = axios.get(
               "http://localhost:3000/api/capsule/get-received",
               {
                  withCredentials: true,
               }
            );

            const responses = await Promise.all([res, res2]);
            const capsules = responses[0].data.data;
            const receivedCapsules = responses[1].data.data;
            if (!capsules || !receivedCapsules) return;
            setAllCapsules([...capsules, ...receivedCapsules]); // setting capsules data
         } catch (error) {
            toast.error("An error occurred. Please try again.");
         }
      };

      fetchCapsules();
   }, []);
   console.log(allCapsules);

   return (
      <div className="min-h-screen bg-background">
         <Card className="p-6 m-6 bg-primary/40 text-primary">
            <div className="flex justify-between items-start mb-4">
               <Clock className="h-8 w-8 " />
               <Sparkles className="h-6 w-6 " />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
               Create a Time Capsule
            </h3>
            <p className="text-gray-400 mb-4">
               Preserve today's moments for tomorrow. AI-powered suggestions
               help you create meaningful time capsules.
            </p>
            <Button
               variant="secondary"
               className="w-full rounded-lg"
               onClick={() => {
                  navigate("/dashboard/createcapsule");
               }}
            >
               Start Time Capsule
            </Button>
         </Card>

         {/* Scrollable Cards Section */}
         {/* Scrollable Cards Section */}
         <div className="flex overflow-x-auto gap-6 p-6 pb-8 snap-x snap-mandatory">
            {allCapsules.map((capsule) => (
               <Link to={`/capsule/${capsule._id}`} key={capsule._id}>
                  <Card className="relative overflow-hidden h-64 min-w-[320px] snap-center">
                     <img
                        src={
                           capsule.media && (capsule.media[0] as Media)?.url
                              ? (capsule.media[0] as Media).url
                              : "/placeholder.svg"
                        }
                        alt={capsule.title || "Capsule Image"}
                        className="absolute inset-0 w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 to-secondary/50" />
                     <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                        <div>
                           <CardTitle className="text-secondary-foreground mb-2 text-3xl">
                              {capsule.title || "Untitled Capsule"}
                           </CardTitle>
                           <CardDescription className="text-secondary-foreground/80">
                              {capsule.description ||
                                 "No description available."}
                           </CardDescription>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                           {capsule.recipients?.map((recipient, index) => (
                              <Avatar
                                 key={index}
                                 className="inline-block border-2 border-background"
                              >
                                 {/* <AvatarImage
                      src={recipient.avatar || "/placeholder.svg"}
                      alt={recipient.name || "User"}
                      /> */}
                                 <AvatarFallback>
                                    {recipient.name ? recipient.name[0] : "?"}
                                 </AvatarFallback>
                              </Avatar>
                           ))}
                        </div>
                     </div>
                  </Card>
               </Link>
            ))}
         </div>

         {/* Banner Section */}
         <div className="relative h-64 bg-[url('/placeholder.svg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-primary/80" />
            <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                     Create Lasting Memories Together
                  </h2>
                  <p className="text-white/90 max-w-2xl">
                     Join groups, share moments, and build connections that last
                     a lifetime
                  </p>
               </div>
            </div>
         </div>

         {/* Create Group & Time Capsule CTAs */}
         <div className="grid md:grid-cols-2 gap-6 p-6">
            <Card className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-4">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <Avatar key={i} className="border-4 border-background">
                           <AvatarImage src="/placeholder.svg" />
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                     ))}
                  </div>
               </div>
               <h3 className="text-xl font-semibold mb-2">
                  Create a New Group
               </h3>
               <p className="text-muted-foreground mb-4">
                  Start a community and invite friends to share memories
                  together
               </p>
               <Button
                  className="w-full"
                  onClick={() => {
                     navigate("/dashboard/creategroup");
                  }}
               >
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
               </Button>
            </Card>
         </div>

         <TimelineDemo />
      </div>
   );
}
