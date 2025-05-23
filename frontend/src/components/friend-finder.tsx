import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SkipForward } from "lucide-react";
import FriendList from "./friend-list";
import type { Friend } from "../../types/friend";
import { useNavigate } from "react-router-dom";

export default function FriendFinder() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [invitedFriends, setInvitedFriends] = useState<number[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Simulating API call to fetch friends
    setTimeout(() => {
      setFriends(generateDummyFriends());
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowercasedFilter) ||
        friend.username.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredFriends(filtered);
  }, [searchTerm, friends]);

  const handleInvite = (id: number) => {
    setInvitedFriends((prev) =>
      prev.includes(id) ? prev.filter((friendId) => friendId !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    console.log("Invited friend IDs:", invitedFriends);
    navigate('/dashboard')
  };

  const handleSkip = () => {
    console.log("Skipped invitation process");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/peeps.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/20"></div>
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col h-screen">
        <h1 className="text-4xl md:text-5xl text-white mb-8 animate-fade-in text-center">
          <span className="font-sans font-bold text-4xl">Find your</span>
          <br />
          <span className="font-serif text-8xl">peeps</span>
        </h1>
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 text-white placeholder-white/50 border-white/20 focus:border-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
        </div>
        <FriendList
          friends={filteredFriends}
          isLoading={isLoading}
          onInvite={handleInvite}
          invitedFriends={invitedFriends}
        />
        <div className="mt-6 flex flex-col space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Continue
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full text-white border-white hover:bg-white/20"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateDummyFriends(): Friend[] {
  const indianNames = [
    "Aarav",
    "Aditi",
    "Arjun",
    "Diya",
    "Ishaan",
    "Kavya",
    "Neha",
    "Rohan",
    "Sanya",
    "Vihaan",
    "Zara",
    "Advait",
    "Ananya",
    "Dhruv",
    "Isha",
  ];
  return indianNames.map((name, index) => ({
    id: index + 1,
    name,
    username: name.toLowerCase(),
    avatar: `/placeholder.svg?height=40&width=40`,
  }));
}
