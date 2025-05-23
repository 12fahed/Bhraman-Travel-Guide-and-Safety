import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Lock, Key, Brain } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "@/lib/api";

const Unlocking = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const correctPassword = "mysecret123";
  const securityQuestion = "What was your first pet's name?";
  const correctAnswer = "fluffy";

  const navigate = useNavigate()

  const fetchCapsuleData = async () => {
    try {
      const res = await api.get(`/api/capsule/get/${id}?isTimeNeeded=true`);

      setData(res.data.data);
    } catch (error) {
      toast.error("Error fetching capsule");
    }
  };

  useEffect(() => {
    fetchCapsuleData();
  }, []);

  const unlockDate = data ? new Date(data) : new Date();
  const timeLeft = useTimeLeft(unlockDate, id);

  const handlePasswordUnlock = () => {
    if (password === correctPassword) {
      navigate(`/story/${id}`)
      setUnlocked(true);
      toast.success("Time Capsule Unlocked! 🎉");
    } else {
      toast.error("Incorrect Password. Please try again.");
    }
  };

  const handleQuizUnlock = () => {
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      navigate(`/story/${id}`)
      setUnlocked(true);
      toast.success("Time Capsule Unlocked! 🎉");
    } else {
      toast.error("Incorrect Answer. Please try again.");
    }
  };

  if (unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Time Capsule Unlocked! 🎉
            </CardTitle>
            <CardDescription className="text-center">
              Your memories await...
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b flex justify-center items-center from-background to-muted p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Digital Time Capsule
            </CardTitle>
            <CardDescription>
              Your memories are waiting to be rediscovered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <TimeUnit value={timeLeft.days} unit="Days" />
              <TimeUnit value={timeLeft.hours} unit="Hours" />
              <TimeUnit value={timeLeft.minutes} unit="Minutes" />
              <TimeUnit value={timeLeft.seconds} unit="Seconds" />
            </div>

            <Tabs defaultValue="password" className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="password" className="space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Password</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Security Question</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4">
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter unlock password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button className="w-full" onClick={handlePasswordUnlock}>
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock with Password
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm font-medium">{securityQuestion}</p>
                  <Input
                    type="text"
                    placeholder="Enter your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleQuizUnlock}>
                    <Brain className="w-4 h-4 mr-2" />
                    Unlock with Answer
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="text-center p-2 bg-background rounded-md border-2">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{unit}</div>
    </div>
  );
}

function useTimeLeft(unlockDate: Date, id: string | undefined) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference =
      unlockDate.getTime() - new Date().getTime() > 0
        ? unlockDate.getTime() - new Date().getTime()
        : 0;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if time has run out and navigate to story page
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        if (id) {
          navigate(`/story/${id}`);
        }
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate, id, navigate]);

  return timeLeft;
}

export default Unlocking;