import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentlyUnlocked = [
  { id: 1, title: "Birthday Party Photos", date: "2023-05-15" },
  { id: 2, title: "New Year Resolutions", date: "2023-01-01" },
]

const upcomingUnlocks = [
  { id: 1, title: "Summer Vacation 2022", daysLeft: 30 },
  { id: 2, title: "Graduation Day", daysLeft: 180 },
]

export default function NotificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recently Unlocked</h2>
          {recentlyUnlocked.map((item) => (
            <Card key={item.id} className="mb-2">
              <CardHeader>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Unlocked on: {item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Countdown to Unlock</h2>
          {upcomingUnlocks.map((item) => (
            <Card key={item.id} className="mb-2">
            <CardHeader>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
            </CardHeader>
              <CardContent>
                <p>{item.daysLeft} days left to unlock</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

