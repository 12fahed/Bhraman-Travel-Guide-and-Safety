import type { Friend } from "../../types/friend"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, UserPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FriendListProps {
  friends: Friend[]
  isLoading: boolean
  onInvite: (id: number) => void
  invitedFriends: number[]
}

export default function FriendList({ friends, isLoading, onInvite, invitedFriends }: FriendListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    )
  }

  if (friends.length === 0) {
    return <div className="text-center text-white text-lg mt-8">No friends found</div>
  }

  return (
    <div className="overflow-y-auto flex-1 -mx-4 px-4 custom-scrollbar">
      <AnimatePresence>
        {friends.map((friend) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <img
                src={friend.avatar || "/placeholder.svg"}
                alt={friend.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-white font-semibold">{friend.name}</h2>
                <p className="text-white/70 text-sm">@{friend.username}</p>
              </div>
            </div>
            <Button
              onClick={() => onInvite(friend.id)}
              variant={invitedFriends.includes(friend.id) ? "destructive" : "secondary"}
              size="sm"
              className="ml-4"
            >
              {invitedFriends.includes(friend.id) ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Uninvite
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

