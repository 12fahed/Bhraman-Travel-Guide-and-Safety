import React from "react";

interface ImageStoryProps {
   url: string;
}

const ImageStory: React.FC<ImageStoryProps> = ({ url }) => {
   return (
      <div className="absolute inset-0 flex items-center justify-center">
         <img
            src={url || "/placeholder.svg"}
            alt="Story"
            className="max-w-full max-h-full object-contain"
         />
      </div>
   );
};

export default ImageStory;
