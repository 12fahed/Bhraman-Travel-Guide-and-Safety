import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { useUser } from "./hooks/use-user";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface SettingsModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
   const [notifications, setNotifications] = useState(true);

   const { user, setUser } = useUser();

   const [username, setUsername] = useState(user?.username || "");

   const handleSave = async () => {
      try {
         const res = await api.post("/api/auth/username", { username });
         if (res.data.success) {
            setUser(res.data.updatedUser);
            toast.success("Username updated successfully");
         }
      } catch (error) {
         toast.error("Something went wrong");
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Settings</DialogTitle>
               <DialogDescription>
                  Manage your account settings below.
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                     id="username"
                     defaultValue={"username"}
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     type="email"
                     defaultValue={user?.email || "user@example.com"}
                  />
               </div>

               <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                     id="notifications"
                     checked={notifications}
                     onCheckedChange={setNotifications}
                  />
               </div>
            </div>

            {/* Footer */}
            <DialogFooter>
               <Button onClick={handleSave} className="w-full">
                  Save Changes
               </Button>
            </DialogFooter>

            {/* Logout Button */}
            <Button
               variant="secondary"
               className="w-full text-red-600"
               onClick={() => {
                  Cookies.remove("token");
                  window.location.reload();
               }}
            >
               Log out
            </Button>
         </DialogContent>
      </Dialog>
   );
}
