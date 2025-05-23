// components/Nav.js
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Nav() {
  return (
    <div className="z-50 p-4 bg-glass backdrop-blur-2xl sticky top-0 bg-black text-white">
      <nav className="sticky top-0 flex items-center justify-between bg-glass backdrop-blur-2xl">
        <div className="flex items-center">
          <span className="text-orange-500 font-bold text-xl sm:text-2xl">Bh</span>
          <span className="font-bold text-xl sm:text-2xl">raman</span>
        </div>
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <Link to="/travel" className="hover:text-orange-500">Travel</Link>
          <Link to="/ai" className="hover:text-orange-500">AI</Link>
          <Link to="/create-group" className="hover:text-orange-500">Get Group</Link>
          <Link to="/recommendation" className="hover:text-orange-500">Recommendations</Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
         
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 rounded-lg px-4 sm:px-6"
          >
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </div>
      </nav>
    </div>
  )
}
