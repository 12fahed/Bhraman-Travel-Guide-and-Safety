import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VoiceGenerator from "./review-page"

const dummyTimeCapsules = [
  { id: 1, title: "Summer Vacation 2022", date: "2023-08-01" },
  { id: 2, title: "Graduation Day", date: "2024-06-15" },
  { id: 3, title: "Wedding Anniversary", date: "2025-02-14" },
]

export default function TimeCapsules() {
  return (
    <div className="mt-8">
        <VoiceGenerator/>
      <h2 className="text-2xl font-semibold mb-4">Time Capsules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyTimeCapsules.map((capsule) => (
          <Card key={capsule.id}>
            <CardHeader>
              <CardTitle>{capsule.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Unlock date: {capsule.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

