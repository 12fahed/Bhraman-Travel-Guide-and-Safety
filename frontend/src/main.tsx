import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./components/ui/sonner.tsx";
import ScreenshotPreventionWrapper from "./utils/PreventScreenshot.tsx";
import TravelTabs from "./travel.tsx";
import TravelVenture from "./Landing_page.tsx";
import HouseholdForm from "./Person-Form.tsx";
import TrafficMap from "./components/Congestion.tsx";
import ImageGallery from "./components/MemoryBasedSuggestion.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster />
          {/* <App /> */}
          {/* <HouseholdForm /> */}
          <TravelTabs />
          {/* <TravelVenture /> */}
          {/* <TrafficMap /> */}
          {/* <ImageGallery /> */}
        </ScreenshotPreventionWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);