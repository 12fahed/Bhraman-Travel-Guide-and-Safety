export interface MediaFile {
   id: string;
   url: string;
   alt?: string;
   type: "image" | "video" | "audio";
   thumbnail?: string;
   timestamp?: number;
}

export interface User {
   _id: string;
   name: string;
   email: string;
   password: string;
   googleId?: string;
   phone: string;
   isVerified: boolean;
   createdAt: Date;
   friends: string[];
   groups: string[];
   dob: Date;
   updatedAt: Date;
   username: string;
}

export interface Media {
   _id: string;
   url: string;
   metadata: {
      type: string;
      timestamp?: number;
      tags?: string[];
      description?: string;
      inPictures?: User[];
      location?: {
         type: string;
         coordinates: [number, number];
      };
   };
   AIGeneratedSummary?: string;
}

export interface Capsule {
   _id?: string;
   title?: string;
   description?: string;
   unlockDate?: Date;
   creator?: User;
   media?: File[] | Media[];
   recipients?: User[]; // self id always
   accessCode?: string; //If permanent is false then only code and password should be emailed to receiptents
   isCollaborative?: boolean;
   contributors?: User[];
   isInstagramUpload?: boolean; //10 images or videos
   isPermanentLock?: boolean;
   isCollaboratorLock?: boolean; // Creator wants to lock(in)
   isRequiredUpdates?: boolean;
   createdAt?: Date;
}

export interface Group {
   _id: string;
   name: string;
   owner: User;
   members: User[];
   createdAt: Date;
   updatedAt: Date;
}
