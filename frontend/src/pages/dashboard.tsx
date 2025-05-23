import Nav from "@/newNav";
import { Outlet } from "react-router";

export default function Dashboard() {
   return (
      <div className="pb-14 ">
         <Nav />
         <Outlet />
      </div>
   );
}
