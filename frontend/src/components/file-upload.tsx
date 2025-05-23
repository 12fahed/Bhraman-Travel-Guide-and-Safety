import { MediaFile } from "@/lib/types";
import { cn, convertToBase64 } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
   setMediaItems: React.Dispatch<React.SetStateAction<MediaFile[]>>;
}

export const FileUpload = ({ setMediaItems }: FileUploadProps) => {
   const onDrop = useCallback(
      (acceptedFiles: File[]) => {
         const processFiles = async (files: File[]) => {
            const newItems: MediaFile[] = await Promise.all(
               files.map(async (file) => ({
                  id: `upload-${file.name}`,
                  url: await convertToBase64(file),
                  alt: file.name,
                  type: "image",
               }))
            );
            setMediaItems((prev) => [...prev, ...newItems]);
         };

         processFiles(acceptedFiles);
      },
      [setMediaItems]
   );

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
         "video/*": [".mp4"],
         "audio/*": [".mp3"],
      },
      multiple: true,
   });

   return (
      <div
         {...getRootProps()}
         className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
               ? "border-primary bg-primary/5"
               : "border-muted-foreground/25 hover:border-primary/50"
         )}
      >
         <input {...getInputProps()} />
         <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
         <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive
               ? "Drop your photos here..."
               : "Drag & drop photos here, or click to select"}
         </p>
      </div>
   );
};
