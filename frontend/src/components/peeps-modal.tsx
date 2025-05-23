import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PeepsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Peep {
  id: number
  name: string
  username: string
  isFriend: boolean
}

const dummyPeeps: Peep[] = [
  { id: 1, name: "Aarav Kumar", username: "aarav", isFriend: true },
  { id: 2, name: "Diya Patel", username: "diya", isFriend: false },
  { id: 3, name: "Vihaan Singh", username: "vihaan", isFriend: true },
  { id: 4, name: "Ananya Sharma", username: "ananya", isFriend: false },
]

export default function PeepsModal({ isOpen, onClose }: PeepsModalProps) {
  const [peeps, setPeeps] = useState(dummyPeeps)

  const toggleFriendship = (id: number) => {
    setPeeps(peeps.map((peep) => (peep.id === id ? { ...peep, isFriend: !peep.isFriend } : peep)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Peeps</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {peeps.map((peep) => (
            <div key={peep.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={peep.name} />
                  <AvatarFallback>{peep.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{peep.name}</p>
                  <p className="text-sm text-gray-500">@{peep.username}</p>
                </div>
              </div>
              <Button
                onClick={() => toggleFriendship(peep.id)}
                variant={peep.isFriend ? "destructive" : "default"}
                size="sm"
              >
                {peep.isFriend ? "Unfriend" : "Friend"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

