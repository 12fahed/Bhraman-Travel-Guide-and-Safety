import React, { useRef, useEffect } from "react";

interface VideoStoryProps {
   url: string;
}

const VideoStory: React.FC<VideoStoryProps> = ({ url }) => {
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      if (videoRef.current) {
         videoRef.current.play();
      }
   }, [url]);

   return (
      <div className="absolute inset-0 flex items-center justify-center">
         <video
            ref={videoRef}
            src={url}
            className="max-w-full max-h-full object-contain"
            loop
            muted
            playsInline
         />
      </div>
   );
};

export default VideoStory;
