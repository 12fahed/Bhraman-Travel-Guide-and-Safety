import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import debounce from "lodash/debounce";
import { useCapsule } from "./hooks/use-capsule";
import { Capsule } from "@/lib/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Collaborator {
  _id: string;
  name: string;
  avatar: string;
}

interface CreateCapsuleProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCapsule = ({ isOpen, onClose }: CreateCapsuleProps) => {
  const [username, setUsername] = useState("");
  const [capsuleType, setCapsuleType] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState<
    Set<string>
  >(new Set());
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  const { capsule, setCapsule } = useCapsule();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/group/getgroups");
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollaborator = (id: string) => {
    setSelectedCollaborators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const navigate = useNavigate();
  const fetchSearchResults = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/auth/search?query=${query}`);
      console.log(res.data.data);

      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 300), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleCreateCapsule = async (capsule: Capsule) => {
    // Show a loading toast that persists until the operation completes
    const loadingToast = toast.loading("Creating capsule...", {
      // Optional: you can add duration if you want it to auto-dismiss
      duration: Infinity, // Stays until manually dismissed
    });

    setLoading(true);

    const formData = new FormData();

    if (capsule.title && capsule.description) {
      formData.append("title", capsule.title);
      formData.append("description", capsule.description);
    }

    if (capsule.media) {
      capsule.media.forEach((file) => {
        formData.append("media", file as File);
      });
    }

    try {
      const res = await api.post("/api/capsule/create", formData);

      if (res.data.success) {
        setCapsule({} as Capsule);

        // Dismiss the loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(res.data.message);

        navigate("/dashboard");
      }
    } catch (error) {
      // Dismiss the loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("Error creating capsule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Capsule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Capsule Type</Label>
            <RadioGroup
              value={capsuleType}
              onValueChange={setCapsuleType}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group">Group</Label>
              </div>
            </RadioGroup>
          </div>

          {capsuleType === "group" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Or Add Individual Collaborators</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collaborators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      searchResults?.map((collaborator) => (
                        <div
                          key={collaborator?._id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedCollaborators.has(collaborator._id)
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleCollaborator(collaborator._id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="h-8 w-8 bg-primary/20 text-primary text-lg">
                              {collaborator.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1">{collaborator.name}</span>
                          {selectedCollaborators.has(collaborator._id) && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
        <Button
          disabled={loading}
          className="w-full"
          onClick={() => {
            onClose();
            if (capsule) {
              handleCreateCapsule(capsule);
            }
          }}
        >
          {!loading ? (
            "Create Capsule"
          ) : (
            <Loader2 className="size-8 animate-spin" />
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCapsule;
