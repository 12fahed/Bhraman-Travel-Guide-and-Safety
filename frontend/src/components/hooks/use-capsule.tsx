import { create } from "zustand";
import { Capsule } from "@/lib/types";

interface CapsuleStore {
   capsule: Capsule | null;
   setCapsule: (capsule: Capsule) => void;
}

export const useCapsule = create<CapsuleStore>((set) => ({
   capsule: null,
   setCapsule: (capsule: Capsule) => set({ capsule }),
}));
