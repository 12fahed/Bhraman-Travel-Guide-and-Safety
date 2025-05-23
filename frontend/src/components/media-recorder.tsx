import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Video, Mic, StopCircle } from "lucide-react";

// Props for the base RecordCard component

// Props for the MediaRecorder component
interface MediaRecorderProps {
   type: "photo" | "video" | "audio";
   onCapture: (media: string | Blob) => void;
}

// The actual recording component that handles media capture
export const MediaRecorder = ({ type, onCapture }: MediaRecorderProps) => {
   const videoRef = useRef<HTMLVideoElement>(null);
   const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
   const chunksRef = useRef<Blob[]>([]);

   const [error, setError] = useState<string | null>(null);
   const [isRecording, setIsRecording] = useState(false);

   useEffect(() => {
      const setupMedia = async () => {
         try {
            if (type === "audio") {
               const stream = await navigator.mediaDevices.getUserMedia({
                  audio: true,
               });
               mediaRecorderRef.current = new (window.MediaRecorder as any)(
                  stream
               );
            } else {
               const stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: type === "video",
               });
               if (videoRef.current) {
                  videoRef.current.srcObject = stream;
               }
            }
         } catch (err) {
            setError(
               `Unable to access ${type} device: ${(err as Error).message}`
            );
         }
      };

      setupMedia();

      return () => {
         if (videoRef.current?.srcObject) {
            const tracks = (
               videoRef.current.srcObject as MediaStream
            ).getTracks();
            tracks.forEach((track) => track.stop());
         }
      };
   }, [type]);

   const takePhoto = () => {
      if (videoRef.current) {
         const canvas = document.createElement("canvas");
         canvas.width = videoRef.current.videoWidth;
         canvas.height = videoRef.current.videoHeight;

         const ctx = canvas.getContext("2d");
         if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            onCapture(canvas.toDataURL("image/jpeg"));
         }
      }
   };

   const startRecording = () => {
      chunksRef.current = [];

      if (type === "audio") {
         if (mediaRecorderRef.current) {
            mediaRecorderRef.current.ondataavailable = (event) => {
               if (event.data.size > 0) {
                  chunksRef.current.push(event.data);
               }
            };

            mediaRecorderRef.current.onstop = () => {
               const audioBlob = new Blob(chunksRef.current, {
                  type: "audio/webm",
               });
               onCapture(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
         }
      } else if (videoRef.current?.srcObject) {
         const mediaRecorder = new (window.MediaRecorder as any)(
            videoRef.current.srcObject as MediaStream
         );

         mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
               chunksRef.current.push(event.data);
            }
         };

         mediaRecorder.onstop = () => {
            const videoBlob = new Blob(chunksRef.current, {
               type: "video/webm",
            });
            onCapture(videoBlob);
         };

         mediaRecorder.start();
         mediaRecorderRef.current = mediaRecorder;
         setIsRecording(true);
      }
   };

   const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
         mediaRecorderRef.current.stop();
         setIsRecording(false);
      }
   };

   if (error) {
      return (
         <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
         </Alert>
      );
   }

   if (type === "photo") {
      return (
         <div className="space-y-4">
            <video
               ref={videoRef}
               autoPlay
               playsInline
               className="w-full aspect-video rounded-lg border h-96"
            />
            <Button onClick={takePhoto} variant="outline" className="w-full">
               <Camera className="mr-2 h-4 w-4" />
               Take Photo
            </Button>
         </div>
      );
   }

   if (type === "video") {
      return (
         <div className="space-y-4">
            <video
               ref={videoRef}
               autoPlay
               playsInline
               className="w-full aspect-video rounded-lg border h-96"
            />
            {!isRecording ? (
               <Button
                  onClick={startRecording}
                  variant="outline"
                  className="w-full"
               >
                  <Video className="mr-2 h-4 w-4" />
                  Start Recording
               </Button>
            ) : (
               <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="w-full"
               >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
               </Button>
            )}
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center space-y-4">
         <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center">
            <Mic
               className={`h-12 w-12 ${
                  isRecording ? "text-red-500" : "text-primary"
               }`}
            />
         </div>
         {!isRecording ? (
            <Button
               onClick={startRecording}
               variant="outline"
               className="w-full"
            >
               <Mic className="mr-2 h-4 w-4" />
               Start Recording
            </Button>
         ) : (
            <Button
               onClick={stopRecording}
               variant="destructive"
               className="w-full"
            >
               <StopCircle className="mr-2 h-4 w-4" />
               Stop Recording
            </Button>
         )}
      </div>
   );
};
