import { sampleImages } from "@/lib/data";
import { MediaFile } from "@/lib/types";

const MEDIA_STORAGE_KEY = "timeCapsule_media";

export const useMediaStorage = () => {
   const addMediaToStorage = (file: {
      url: string;
      type: "photo" | "video" | "audio";
   }) => {
      const savedMedia = sessionStorage.getItem(MEDIA_STORAGE_KEY);
      const mediaFiles = savedMedia ? JSON.parse(savedMedia) : sampleImages;

      const newMedia: MediaFile = {
         id: `recorded-${Date.now()}`,
         url: file.url,
         type: file.type === "photo" ? "image" : file.type,
         alt: `Recorded ${file.type}`,
         thumbnail: file.type === "photo" ? file.url : undefined,
         timestamp: Date.now(),
      };

      const updatedMedia = [newMedia, ...mediaFiles];
      sessionStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updatedMedia));

      return newMedia;
   };

   return { addMediaToStorage };
};
