import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const InvitationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    alert(`username's invitation accepted!`);
    navigate("/time-capsule");
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="max-w-lg mx-auto p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Username has invited you to collaborate on a Time Capsule
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center my-4">
          <p className="text-gray-600">
            Would you like to join the collaboration?
          </p>
        </CardContent>
        <CardFooter className="flex justify-around">
          <Button variant="default" onClick={handleAccept}>
            Accept Invitation
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default InvitationPage;
