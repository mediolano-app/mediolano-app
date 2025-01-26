"use client"

import { useState } from "react"

import { ProfileHeader } from "@/components/marketplace/UserProfile"
import { FeaturedItems } from "@/components/marketplace/FeaturedItens"
import { Collections } from "@/components/marketplace/Collections"
import { Items } from "@/components/marketplace/Items"
import { Offers } from "@/components/marketplace/ItemOffers"
import { Deals } from "@/components/marketplace/UserDeals"
import { Activities } from "@/components/marketplace/UserActivities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("featured")

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-8">
        <ProfileHeader />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          <TabsContent value="featured">
            <FeaturedItems />
          </TabsContent>
          <TabsContent value="collections">
            <Collections />
          </TabsContent>
          <TabsContent value="items">
            <Items />
          </TabsContent>
          <TabsContent value="offers">
            <Offers />
          </TabsContent>
          <TabsContent value="deals">
            <Deals />
          </TabsContent>
          <TabsContent value="activities">
            <Activities />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

