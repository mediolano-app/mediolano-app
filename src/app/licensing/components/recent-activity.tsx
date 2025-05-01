import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { recentActivity } from "@/app/licensing/lib/mock-activity-data"
import { Button } from "@/components/ui/button"

export function RecentActivity() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={activity.userAvatar || "/placeholder.svg"} alt={activity.user} />
                  <AvatarFallback>{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{activity.user}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-muted-foreground"> {activity.assetName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {recentActivity.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">No recent activity to display.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
