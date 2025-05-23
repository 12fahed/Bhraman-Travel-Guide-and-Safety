import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import debounce from "lodash/debounce";
import { api } from "@/lib/api";
import { Loader2, PlusIcon, UserPlus } from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
}

export function SearchUsers({
  onUserSelect,
  title,
  existingUsers = []
}: {
  title: string;
  onUserSelect: (userId: string) => void;
  existingUsers?: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = useCallback(
    async (query: string) => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/api/auth/search?query=${query}`);
        if (res.data.success) {
          // Filter out existing users
          const filteredUsers = res.data.users.filter(
            (user: User) => !existingUsers.includes(user._id)
          );
          setSearchResults(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    },
    [existingUsers]
  );

  // Memoize debounced search with stable reference
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchSearchResults(query);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleUserSelect = (userId: string) => {
    onUserSelect(userId);
    // Optional: You might want to clear search results after selection
    setSearchQuery("");
    setSearchResults([]);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <UserPlus className="w-6 h-6 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full p-4 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-secondary-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Search by username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-secondary-foreground" />
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-md border border-secondary hover:bg-primary-foreground transition cursor-pointer"
                  onClick={() => handleUserSelect(user._id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-secondary-foreground">
                        {user.username}
                      </p>
                      <p className="text-xs text-secondary-foreground/80">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  
}
