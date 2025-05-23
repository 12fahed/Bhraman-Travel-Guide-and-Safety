import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const convertToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });
};

export const base64ToFile = (base64: string, fileName: string) => {
   const base64Match = base64.match(/^data:(.*?);base64,(.+)$/);

   if (!base64Match) {
      throw new Error("Invalid base64 string");
   }

   const mimeType = base64Match[1] || "application/octet-stream";
   const base64Content = base64Match[2];

   const binaryString = window.atob(base64Content);
   const byteArray = new Uint8Array(binaryString.length);

   for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
   }

   return new File([byteArray], fileName, { type: mimeType });
};

export const identifyFileType = (url: string) => {
   const extension = url.split(".").pop()?.toLowerCase();
   if (extension === "mp4") return "video";
   if (extension === "jpg" || extension === "jpeg" || extension === "png")
      return "image";
   if (extension === "mp3") return "audio";
   return "file";
};
