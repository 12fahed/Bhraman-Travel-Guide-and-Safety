import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {  SettingsIcon, Users } from "lucide-react";
import PeepsModal from "./peeps-modal";
import SettingsModal from "./settings";
import SharedWithYou from "./shared-with-you";
import YouShared from "./you-shared";
import { useUser } from "./hooks/use-user";

export default function UserProfile() {
   const [isPeepsModalOpen, setIsPeepsModalOpen] = useState(false);
   const [isSettingsModalOpen,setIsSettingsModalOpen]=useState(false)
   const { user } = useUser();

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="flex items-center mb-8 space-x-4">
            {/* Avatar */}
            <Avatar className="w-24 h-24">
               <AvatarImage
                  src="/placeholder.svg?height=128&width=128"
                  alt="User"
               />
               <AvatarFallback className="text-xl font-bold">
                  {user?.name[0]?.toUpperCase() || "U"}
               </AvatarFallback>
            </Avatar>

            {/* Name and Username */}
            <div>
               <h1 className="text-xl font-bold">{user?.name || "Name"}</h1>
               <p className="text-gray-600">@{user?.username || "username"}</p>
            </div>
         </div>

         {/* Buttons */}
         <div className="flex space-x-4 mb-8">
         <Button
               onClick={() => setIsSettingsModalOpen(true)}
               variant="outline"
               className="flex items-center w-full"
            >
               <SettingsIcon className="mr-2 h-4 w-4" />
               Settings
            </Button>

            <Button
               onClick={() => setIsPeepsModalOpen(true)}
               variant="outline"
               className="flex items-center w-full"
            >
               <Users className="mr-2 h-4 w-4" />
               Peeps
            </Button>
         </div>

         {/* Tabs */}
         <Tabs defaultValue="shared-with-you" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="shared-with-you">
                  Shared with you
               </TabsTrigger>
               <TabsTrigger value="you-shared">You shared</TabsTrigger>
            </TabsList>
            <TabsContent value="shared-with-you">
               <SharedWithYou />
            </TabsContent>
            <TabsContent value="you-shared">
               <YouShared />
            </TabsContent>
         </Tabs>

         <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
         />
         <PeepsModal
            isOpen={isPeepsModalOpen}
            onClose={() => setIsPeepsModalOpen(false)}
         />
      </div>
   );
}
