import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageGallery from "@/components/MemoryBasedFetching";
import MemoryBasedCityCard from "@/components/MemoryBasedCityCard";


const AppRoutes: React.FC = () => {
    return (
      <BrowserRouter>
        <Routes >
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/MemoryBasedFetching" element={<ImageGallery />} />
          <Route path="/viewCity" element={<MemoryBasedCityCard />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default AppRoutes;