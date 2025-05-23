import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { LoginForm } from "./components/login-form";
import TravelTabs from "./travel.tsx";
import Preferences from "./preferences.tsx";
import Language from "./languages.tsx";
import PlacesVisited from "./places-visited.tsx";
import CreateGroup from "./components/groups/CreateGroup.tsx";
import ItenaryPlanner from "./itenaryplanner.tsx"
import ActivityDestinationFilter from "./components/ActivityDestinationFilter.tsx";
import TravelVenture from "./Landing_page.tsx";
import HouseholdForm from "./Person-Form.tsx";
import JsonHostingUI from "./woww.jsx"
import Alternate from "@/alternate.tsx"
import ImageGallery from "@/components/MemoryBasedFetching";
import MemoryBasedCityCard from "@/components/MemoryBasedCityCard";
import { useLocation } from "react-router-dom";
import TrafficMap from "./components/Congestion.tsx";


function ViewCity() {
   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const cityName = params.get("name");
 
   return <MemoryBasedCityCard city={cityName} />;
 }

export default function App() {

   return (
      <>
         <Routes>
            <Route path="/" element={<Dashboard />}>
               <Route path="/" element={<TravelVenture />} />
               <Route path="/form" element={<HouseholdForm/>}/>
               <Route path="/travel" element={<TravelTabs />} />
               <Route path="/preferences" element={<Preferences />} />
               <Route path="/languages" element={<Language />} />
               <Route path="/placesvisited" element={<PlacesVisited />} />
               <Route path="/itenaryplanner" element={<ItenaryPlanner />} />
               <Route path="/activitydestinationfilter" element={<ActivityDestinationFilter />} />
               <Route path="create-group" element={<CreateGroup />} />  
               <Route path="sign-in" element={<LoginForm />} />   
               <Route path="wow" element={<JsonHostingUI/>}/>
               <Route path="alternate" element={<Alternate/>}/>
               <Route path="/MemoryBasedFetching" element={<ImageGallery />} />
               {/* <Route path="/viewCity" element={<MemoryBasedCityCard />} /> */}
               <Route path="/viewCity" element={<ViewCity />} />
               <Route path="/findCongestions" element={<TrafficMap />} />

               
               <Route
                  path="recommendation"
                  element={
                     <iframe
                        style={{ border: "none", width: "100vw", height: "100vh" }}
                        src="http://localhost:8000"
                     />
                  }
               />               <Route
                  path="ai"
                  element={
                     <iframe
                        style={{ border: "none", width: "100vw", height: "100vh" }}
                        src="http://localhost:8501"
                     />
                  }
               />
               </Route>
         </Routes>
      </>
   );
}
