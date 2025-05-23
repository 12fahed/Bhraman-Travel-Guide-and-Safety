import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./theme/theme-toggle";

export default function Navbar() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <nav className="sticky top-0 bg-primary text-primary-foreground p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Name */}
        <a
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold font-serif cursor-pointer"
        >
          bhraman
        </a>

        {/* Icons */}
        <div className="flex items-center space-x-2 shadow-none">
          {/* Notifications Icon */}
          <Button
            variant={
              currentPath.endsWith("notifications") ? "secondary" : "default"
            } // Active state
            size="icon"
            onClick={() => navigate("/dashboard/notifications")}
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile Icon */}
          <Button
            variant={currentPath.endsWith("profile") ? "secondary" : "default"} // Active state
            size="icon"
            onClick={() => navigate("/dashboard/profile")}
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
