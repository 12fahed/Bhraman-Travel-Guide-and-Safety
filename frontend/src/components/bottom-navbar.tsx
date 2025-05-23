import { useNavigate } from "react-router-dom";
import { Home, Users, Pill, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/ai", label: "Ai", icon: Sparkles },
  { href: "/dashboard/creategroup", label: "Groups", icon: Users },
  { href: "/dashboard/createcapsule", label: "Capsule", icon: Pill },
];

export function BottomNav() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  // Utility function to remove "/dashboard" from paths
  const removeDashboardPrefix = (path: string): string =>
    path.replace(/^\/dashboard\//, "");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          // Determine active state
          const isActive = removeDashboardPrefix(pathname) === removeDashboardPrefix(item.href);
          const Icon = item.icon;

          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full h-14 relative flex flex-col items-center justify-center",
                "touch-manipulation min-h-[44px]",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 w-10 h-10 mx-auto my-auto bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isActive ? 0 : 1, y: isActive ? 10 : 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-xs mt-1"
              >
                {!isActive && <span>{item.label}</span>}
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
