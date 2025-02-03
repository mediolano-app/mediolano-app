import Image from "next/image"
import { user } from "@/lib/dataMktUserProfile"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Share2 } from "lucide-react"

export function ProfileHeader() {
  return (
    <Card>
      <div className="relative h-48 md:h-64 overflow-hidden rounded-t-lg">
        <Image src={user.banner || "/background.jpg"} alt="Profile banner" layout="fill" objectFit="cover" />
      </div>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:space-x-5">
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden ring-4 ring-background">
            <Image src={user.avatar || "/background.jpg"} alt={user.username} layout="fill" objectFit="cover" />
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-left flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">{user.id}</p>
          </div>
          <div className="mt-4 sm:mt-0">

          <div className="mt-4 flex justify-center sm:justify-start space-x-4">
          {user.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="h-5 w-5" />
            </a>
          ))}
        </div>


          </div>
        </div>
        <p className="mt-4 text-sm md:text-base">{user.bio}</p>
        <div className="mt-4 flex flex-wrap justify-between gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="text-sm md:text-base">Joined {user.registrationDate}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm md:text-base">
              <strong>{user.creations}</strong> creations
            </span>
            <span className="text-sm md:text-base">
              <strong>{user.collections}</strong> collections
            </span>
          </div>
        </div>
        
      </CardContent>
    </Card>
  )
}

