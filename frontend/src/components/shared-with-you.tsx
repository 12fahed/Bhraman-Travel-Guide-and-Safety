import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Capsule } from "@/lib/types";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { useUser } from "./hooks/use-user";

export default function SharedWithYou() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/capsule/get-received");

        if (res.data.success) {
          setCapsules(res.data.data);
        } else {
          toast.error("Error fetching capsules");
        }
      } catch (error) {
        toast.error("An error occurred while fetching capsules");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid gap-6">
      {capsules.length > 0 ? (
        capsules.map((item) => (
          <div key={item._id}>
            <Link
              to={
                item?.creator === user?._id
                  ? `/capsule/${item._id}`
                  : `/unlocking/${item._id}`
              }
            >
              <Card className="relative overflow-hidden h-64">
                <img
                  src={(item?.media?.[0] as any).url || "/placeholder.svg"}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90"></div>
                <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                  <div>
                    <CardTitle className="text-white mb-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {item.description}
                    </CardDescription>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden">
                    {item?.recipients?.map((user, index) => (
                      <Avatar
                        key={index}
                        className="inline-block border-2 border-background"
                      >
                        <AvatarFallback>
                          {user.name[0].charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Nothing to see here!
          </h2>
          <p className="text-gray-500">
            No capsules have been shared with you yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
