import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCapsule } from "@/components/hooks/use-capsule";
import { useUser } from "@/components/hooks/use-user";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function TimeCapsuleDialog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isValid = title && description;

  const { setCapsule } = useCapsule();
  const { user } = useUser();

  const handleCreateCapsule = async () => {
    if (user) {
      setCapsule({
        _id: "",
        title,
        description,
        creator: user,
        media: [],
        recipients: [],
        accessCode: "",
        contributors: [],
      });
      navigate("/dashboard/createcapsule/suggestions");
    } else {
      console.error("User is not logged in");
    }
  };

  const useCases = [
    {
      title: "Families",
      image:
        "https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Family memories",
      description:
        "Hold onto every precious memory before it fades, and send it back when they're older.",
    },
    {
      title: "Students",
      image:
        "https://plus.unsplash.com/premium_photo-1683135216954-ab7130031b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Student growth",
      description:
        "Capture growth, dreams, and early journeys as you navigate into who you want to be.",
    },
    {
      title: "Leaving a Legacy",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      alt: "Legacy",
      description:
        "Ensure your stories live on—share them with exactly who you choose, and when you want it delivered.",
    },
    {
      title: "Dear Future Me...",
      image:
        "https://images.unsplash.com/photo-1714273709972-f5b3606bf227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Future self",
      description:
        "Preserve the dreams, hopes, and memories that make this moment unique, and capture who you are today for your future self.",
    },
    {
      title: "Future Events",
      image:
        "https://images.unsplash.com/photo-1521356279905-e1d72a443574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
      alt: "Special events",
      description:
        "For the big moments that matter the most—keep those memories alive for years to come.",
    },
    {
      title: "Last Letter",
      image:
        "https://plus.unsplash.com/premium_photo-1661304840506-c97889ecf08a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Last letter",
      description:
        "Even when you're no longer by their side, continue to share your love, wisdom, and memories for the future.",
    },
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-11/12 max-w-3xl h-[90vh] p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Time Capsule
        </h1>

        <div className="space-y-6 mb-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter time capsule title"
              className="w-full"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your time capsule..."
              className="min-h-[100px] w-full"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full my-6"
          onClick={handleCreateCapsule}
          disabled={!isValid}
        >
          Create Capsule
        </Button>
      </div>
    </div>
  );
}
