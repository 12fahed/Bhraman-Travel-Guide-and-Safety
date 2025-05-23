import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateGroupPage from "@/components/groups/CreateGroup";
import axios from "axios";
import { useUser } from "@/components/hooks/use-user";
import { SearchUsers } from "@/components/groups/searchUser";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";

interface Group {
  _id: string;
  name: string;
  owner: {
    username: string;
  };
  members: {
    _id: string;
    username: string;
  }[];
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { user } = useUser();

  const fetchGroups = async () => {
    try {
      if (!user?._id) return;

      const response = await axios.post(
        "http://localhost:3000/api/group/getgroups",
        { userId: user._id }
      );

      setGroups(response.data.groups);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddMembers = async (selectedUsers: User[]) => {
    if (!selectedGroup) return;

    try {
      const userIds = selectedUsers.map((user) => user._id);

      const response = await axios.put(
        "http://localhost:3000/api/group/update",
        {
          groupId: selectedGroup._id,
          userIds: userIds,
        }
      );

      // Update local state to reflect new members
      setGroups((currentGroups) =>
        currentGroups.map((group) =>
          group._id === selectedGroup._id
            ? {
                ...group,
                members: [
                  ...group.members,
                  ...selectedUsers.map((user) => ({
                    _id: user._id,
                    username: user.username,
                  })),
                ],
              }
            : group
        )
      );

      toast.success("Members added successfully");

      setSelectedGroup(null);
    } catch (error) {
      toast.error("Failed to add members");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user?._id]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <Button onClick={() => setIsCreatingGroup(!isCreatingGroup)}>
          {isCreatingGroup ? <XIcon size={16}/> : <PlusIcon size={16} />}
        </Button>
      </div>

      {isCreatingGroup ? (
        <CreateGroupPage />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group._id}>
              <CardHeader>
                <CardTitle className="flex-1 justify-between items-center ">
                  <p className="text-xl font-semibold truncate pb-2 ">

                  {group.name}
                  </p>
                  <hr className="py-1"/>
                  <SearchUsers
                  title="Update Group Members"
                    onUserSelect={(user: any) => {
                      setSelectedGroup(group);
                      handleAddMembers([user]);
                    }}
                    existingUsers={group.members.map(member => member._id)}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Members: {group.members.length}</p>
                {/* <div className="mt-2">
                  <h4 className="text-sm font-semibold">Members:</h4>
                  <ul className="text-xs text-gray-600">
                    {group.members.map((member) => (
                      <li key={member._id}>{member.username}</li>
                    ))}
                  </ul>
                </div> */}
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
