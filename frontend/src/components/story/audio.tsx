import React, { useRef, useEffect } from "react";
import { Music } from "lucide-react";

interface AudioStoryProps {
   url: string;
}

const AudioStory: React.FC<AudioStoryProps> = ({ url }) => {
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.play();
      }
   }, [url]);

   return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <Music className="text-white w-24 h-24" />
         <audio ref={audioRef} src={url} className="hidden" controls autoPlay />
      </div>
   );
};

export default AudioStory;
