import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CapsulePage } from "@/components/capsule";
import { api } from "@/lib/api";
import { Capsule as CapsuleTypes } from "@/lib/types";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

const Capsule = () => {
   const { id } = useParams();
   const [data, setData] = useState<CapsuleTypes>();
   const [loading, setLoading] = useState(false);
   const [showPasswordDialog, setShowPasswordDialog] = useState(false);
   const [accessCode, setAccessCode] = useState("");

   const navigate = useNavigate();

   const fetchCapsuleData = async (code?: string) => {
      try {
         const res = await api.get(`/api/capsule/get/${id}`, {
            params: code ? { accessCode: code } : undefined,
         });

         if (res.data.success) {
            setData(res.data.data);
            setShowPasswordDialog(false);
         } else if (res.data.isPasswordRequired) {
            setShowPasswordDialog(true);
         } else if (res.data.redirect) {
            navigate(`/unlocking/${id}`);
         } else {
            toast.error("Error fetching capsule");
         }
      } catch (error) {
         toast.error("Error fetching capsule");
      }
   };

   useEffect(() => {
      fetchCapsuleData();
   }, []);

   const handleAccessCodeSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!accessCode.trim()) {
         toast.error("Please enter an access code");
         return;
      }
      setLoading(true);
      await fetchCapsuleData(accessCode);
      setLoading(false);
   };

   const handleAddCollaborator = async (userId: string) => {
      setLoading(true);
      try {
         const res = await api.post("/api/capsule/add-contributors", {
            capsuleId: id,
            contributors: [userId],
         });

         if (res.data.success) {
            toast.success("Collaborator added successfully");
         }
      } catch (error) {
         toast.error("Error adding collaborator");
      } finally {
         setLoading(false);
      }
   };

   const handleAddRecipient = async (userId: string) => {
      setLoading(true);
      try {
         const res = await api.post("/api/capsule/add-recipients", {
            capsuleId: id,
            recipients: [userId],
         });

         if (res.data.success) {
            toast.success("Recipient added successfully");
         }
      } catch (error) {
         toast.error("Error adding recipient");
      } finally {
         setLoading(false);
      }
   };

   const handleUpdateCollaborativeLock = async () => {
      setLoading(true);
      try {
         const res = await api.patch("/api/capsule/update", {
            capsuleId: id,
            isCollaboratorLock: !data?.isCollaboratorLock,
         });

         if (res.data.success) {
            setData((p) => ({
               ...p,
               isCollaboratorLock: !p?.isCollaboratorLock,
            }));
            toast.success("Capsule updated successfully");
         } else {
            toast.error("Error updating capsule");
         }
      } catch (error) {
         toast.error("Error updating capsule");
      } finally {
         setLoading(false);
      }
   };

   const handleAddMedia = async (files: any) => {
      setLoading(true);
      const formData = new FormData();

      if (id) {
         formData.append("capsuleId", id);
      } else {
         toast.error("Capsule ID is missing");
         setLoading(false);
         return;
      }

      files.forEach((file: any) => {
         formData.append("media", file);
      });

      try {
         const res = await api.patch("/api/capsule/add-media", formData);
         if (res.data.success) {
            toast.success("Media added successfully");
         }
      } catch (error) {
         toast.error("Error adding media");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="text-foreground">
         <Dialog
            open={showPasswordDialog}
            onOpenChange={(open) => {
               if (!open) {
                  setShowPasswordDialog(true);
               }
            }}
         >
            <DialogContent className="border-border max-w-[90vw] rounded-lg">
               <DialogHeader>
                  <DialogTitle>Enter Access Code</DialogTitle>
               </DialogHeader>
               <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                  <input
                     type="password"
                     value={accessCode}
                     onChange={(e) => setAccessCode(e.target.value)}
                     placeholder="Enter access code"
                     className="w-full px-4 py-2 rounded-md bg-card text-card-foreground border-input focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder-muted-foreground"
                     autoFocus
                  />
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  >
                     {loading ? "Verifying..." : "Submit"}
                  </button>
               </form>
            </DialogContent>
         </Dialog>

         {data && (
            <CapsulePage
               id={id!}
               data={data}
               onAddRecipient={handleAddRecipient}
               onAddMedia={handleAddMedia}
               onAddCollaborator={handleAddCollaborator}
               onUpdateCollaboratorLock={handleUpdateCollaborativeLock}
            />
         )}
      </div>
   );
};

export default Capsule;
