"use client"

import { useState } from "react"

import { ProfileHeader } from "@/components/profile/user-profile"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("featured")

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        <ProfileHeader />
        
      </main>
    </div>
  )
}

