"use client"

import { motion } from "framer-motion"
import { appFeatures } from "@/lib/mockFfeatureData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AppFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appFeatures.map((feature, index) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="h-full hover:shadow transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

