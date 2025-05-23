import { api } from "@/lib/api";
import { Capsule, Media } from "@/lib/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import StoryViewer from "@/components/story/story";

const Story = () => {
   const { id } = useParams();
   const [capsule, setCapsule] = useState<Capsule | null>(null);
   const [stories, setStories] = useState<Media[]>([]);
   const [loading, setLoading] = useState(true);
   const [isLocked, setIsLocked] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      const fetchStories = async () => {
         try {
            const res = await api.get(`/api/capsule/get/${id}`);

            if (res.data.success) {
               const capsuleData = res.data.data;
               setCapsule(capsuleData);

               const unlockDate = new Date(capsuleData.unlockDate);
               const currentDate = new Date();
               console.log({ unlockDate, currentDate });

               if (unlockDate > currentDate) {
                  setIsLocked(true);
                  toast.error("This story is locked");
                  navigate(`/unlocking/${id}`);
                  return;
               }

               setStories(capsuleData.media);
               setIsLocked(false);
            } else if (res.data.redirect) {
               setIsLocked(true);
               navigate(`/unlocking/${id}`);
            }
         } catch (error) {
            toast.error("Something went wrong");
            navigate("/");
         } finally {
            setLoading(false);
         }
      };

      fetchStories();
   }, [id, navigate]);

   if (loading || isLocked) {
      return (
         <div className="flex items-center justify-center h-screen">
            <Loader2 className="size-9 animate-spin" />
         </div>
      );
   }

   if (!capsule || !stories.length) {
      return (
         <div className="flex items-center justify-center h-screen flex-col">
            <AlertTriangle />
            <span>Capsule not found</span>
         </div>
      );
   }

   return (
      <div>
         <StoryViewer items={stories} />
      </div>
   );
};

export default Story;
