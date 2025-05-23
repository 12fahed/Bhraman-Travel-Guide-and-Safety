"use client"

import { useState } from "react"
import { Search, Plus, Check } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
const users = [
  { id: 1, name: "Sushmit Sanyal", email: "sushmit@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Chinmay Tullu", email: "chinmay@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Fahed Khan", email: "fahed@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Siddhima De", email: "siddhima@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Adhisekh Naik", email: "adhisekh@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 6, name: "Tanmay Sarode", email: "tanmay@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 7, name: "User 7", email: "user7@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 8, name: "User 8", email: "user8@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 9, name: "User 9", email: "user9@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 10, name: "User 10", email: "user10@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 11, name: "User 11", email: "user11@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 12, name: "User 12", email: "user12@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 13, name: "User 13", email: "user13@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 14, name: "User 14", email: "user14@example.com", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 15, name: "User 15", email: "user15@example.com", avatar: "/placeholder.svg?height=40&width=40" },
];

export default function GroupMaker() {
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [filter, setFilter] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<typeof users>([])
  const [isNameDescriptionSet, setIsNameDescriptionSet] = useState(false)
  const [isGroupCreated, setIsGroupCreated] = useState(false)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) || user.email.toLowerCase().includes(filter.toLowerCase())
  )

  const toggleUserSelection = (user: (typeof users)[number]) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
    )
  }

  const handleCreateGroup = () => {
    if (groupName && groupDescription && selectedUsers.length > 0) {
      setIsGroupCreated(true)
      toast({
        title: "Group Created",
        description: `${groupName} has been created with ${selectedUsers.length} members.`
      })
    }
  }

  if (isGroupCreated) {
    return (
      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle>{groupName}</CardTitle>
          <CardDescription>{groupDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-bold mb-4">Group Members</h2>
          <div className="flex items-center space-x-2">
            {selectedUsers.slice(0, 3).map((user, index) => (
              <Avatar key={user.id} className={index !== 0 ? "-ml-4" : ""}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {selectedUsers.length > 3 && (
              <Avatar className="-ml-4">
                <AvatarFallback>+{selectedUsers.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{selectedUsers.length} members</p>
        </CardContent>
      </Card>
    )
  }

  if (!isNameDescriptionSet) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Group Details</h2>
        <div className="space-y-2">
          <Input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <Textarea
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>
        <Button  className="w-full"onClick={() => setIsNameDescriptionSet(true)} disabled={!groupName || !groupDescription}>
          Next
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 mt-6">
      <h2 className="text-lg font-bold mb-4">Select Users</h2>
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {selectedUsers.some((u) => u.id === user.id) ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{selectedUsers.length} users selected</p>
        <Button onClick={handleCreateGroup} disabled={selectedUsers.length === 0}>
          Create Group
        </Button>
      </div>
    </div>
  )
}

