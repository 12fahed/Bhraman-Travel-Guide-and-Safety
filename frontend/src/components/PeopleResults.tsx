import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const dummyPeople = [
  { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Diana Ross", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function PeopleResults() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">People</h2>
      <ul className="space-y-4">
        {dummyPeople.map((person) => (
          <li key={person.id} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback>
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{person.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

