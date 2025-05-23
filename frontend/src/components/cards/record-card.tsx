import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "../ui/dialog";
import { MediaRecorder } from "@/components/media-recorder";
import { X, Play, Pause } from "lucide-react";
import { useMediaStorage } from "../hooks/use-media-storage";

interface RecordCardProps {
   icon: React.ElementType;
   title: string;
   description: string;
   type: "photo" | "video" | "audio";
}

export const RecordCard: React.FC<RecordCardProps> = ({
   icon: Icon,
   title,
   description,
   type,
}) => {
   const [mediaPreview, setMediaPreview] = useState<{
      url: string;
   } | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isPlaying, setIsPlaying] = useState(false);
   const audioRef = useRef<HTMLAudioElement>(null);

   const { addMediaToStorage } = useMediaStorage();

   const handleCapture = (media: string | Blob) => {
      const url = media instanceof Blob ? URL.createObjectURL(media) : media;
      setMediaPreview({ url });
      setIsDialogOpen(false);

      addMediaToStorage({ url, type });
   };

   const toggleAudioPlayback = () => {
      if (audioRef.current) {
         if (isPlaying) {
            audioRef.current.pause();
         } else {
            audioRef.current.play();
         }
         setIsPlaying(!isPlaying);
      }
   };

   const handleAudioEnded = () => {
      setIsPlaying(false);
   };

   const clearPreview = () => {
      if (type !== "photo" && mediaPreview?.url) {
         URL.revokeObjectURL(mediaPreview.url);
      }
      setMediaPreview(null);
      setIsPlaying(false);
   };

   return (
      <Card className="relative overflow-hidden group hover:border-primary transition-colors">
         <CardContent className="p-6 text-center space-y-4">
            <Icon className="w-12 h-12 mx-auto" />
            <div>
               <h3 className="font-semibold">{title}</h3>
               <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {mediaPreview && (
               <div className="relative">
                  {type === "photo" && (
                     <img
                        src={mediaPreview.url}
                        alt="Captured photo"
                        className="w-full rounded-lg"
                     />
                  )}
                  {type === "video" && (
                     <video
                        src={mediaPreview.url}
                        controls
                        className="w-full rounded-lg"
                     />
                  )}
                  {type === "audio" && (
                     <div className="flex flex-col items-center space-y-2">
                        <audio
                           ref={audioRef}
                           src={mediaPreview.url}
                           onEnded={handleAudioEnded}
                           className="hidden"
                        />
                        <Button
                           variant="outline"
                           size="icon"
                           onClick={toggleAudioPlayback}
                           className="h-12 w-12 rounded-full"
                        >
                           {isPlaying ? (
                              <Pause className="h-6 w-6" />
                           ) : (
                              <Play className="h-6 w-6" />
                           )}
                        </Button>
                     </div>
                  )}
                  <Button
                     variant="secondary"
                     size="icon"
                     className="absolute top-2 right-2"
                     onClick={clearPreview}
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
               <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                     {mediaPreview ? "Retake" : "Open Camera"}
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-2xl">
                  <DialogHeader>
                     <DialogTitle>Record {title}</DialogTitle>
                  </DialogHeader>
                  <MediaRecorder type={type} onCapture={handleCapture} />
               </DialogContent>
            </Dialog>
         </CardContent>
      </Card>
   );
};
