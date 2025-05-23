"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SkillButton({ icon: Icon, label, isActive, onClick }: SkillButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center relative",
        "transition-all duration-300",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-primary/10"
      )}>
        {!isActive && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 animate-pulse" />
        )}
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </motion.button>
  );
}