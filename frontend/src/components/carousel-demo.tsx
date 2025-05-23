import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Unlock, Users, Palette, MoveRight } from "lucide-react";
import { type CarouselApi } from "@/components/ui/carousel";

const features = [
  {
    title: "",
    description:
      "",
    cta: "Thanks for downloading !",
    image: "./bhraman.png",
  },
  {
    title: "Scheduled Unlocking",
    description:
      "Set a specific future date to reveal your time capsule, creating a surprise for yourself or your recipients.",
    cta: "Start Planning",
    icon: Unlock,
    image: "./flowers.jpg",
  },
  {
    title: "Media Upload & Collaboration",
    description:
      "Store messages, photos, videos, and audio. Collaborate with friends or family to create shared time capsules.",
    cta: "Upload Memories",
    icon: Users,
    image: "./csipeeps.jpg",
  },
  {
    title: "Personalized Themes & Notifications",
    description:
      "Customize with themes like 'Graduation' or 'Anniversary' and enjoy countdowns and reminders as the unlock date approaches.",
    cta: "Customize Now",
    icon: Palette,
    image: "./themes.gif",
  },
];

export function OnboardingCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!api) return;

    const updateSlide = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", updateSlide);

    return () => {
      api.off("select", updateSlide);
    };
  }, [api]);

  const handleCTA = () => {
    if (currentSlide === features.length - 1) {
      navigate("/auth/register");
    } else {
      api?.scrollNext();
    }
  };

  const handleSkip = () => {
    navigate("/auth/register");
  };

  return (
    <div className="relative w-full h-screen bg-background text-foreground">
      <Carousel className="w-full h-screen" setApi={setApi}>
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="h-screen">
              <Card className="relative h-full border-none rounded-none overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/80" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-between p-6 text-secondary-foreground md:p-10 lg:p-16">
                  {/* Icon */}
                  {feature.icon && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full flex justify-center pt-10 md:pt-16"
                    >
                      <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-4" />
                    </motion.div>
                  )}

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center space-y-3 max-w-xs sm:max-w-md md:space-y-4"
                  >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                      {feature.title}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg">
                      {feature.description}
                    </p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-full max-w-xs sm:max-w-md mt-6 mb-10 md:mt-10 space-y-4"
                  >
                    <Button
                      className="w-full h-12 text-sm sm:text-base lg:text-lg bg-secondary text-secondary-foreground hover:bg-secondary-foreground/90"
                      onClick={handleCTA}
                    >
                      {feature.cta} <MoveRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-sm sm:text-base lg:text-lg hover:bg-muted/10"
                      onClick={handleSkip}
                    >
                      Skip
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Active Bubble Indicator */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-2">
        {features.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-secondary-foreground" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
