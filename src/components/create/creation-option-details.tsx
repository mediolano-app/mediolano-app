"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, TrendingUp, CheckCircle, ArrowRight, Sparkles, Shield } from "lucide-react"
import Link from "next/link"

interface CreationOptionDetailsProps {
  option: {
    id: string
    title: string
    description: string
    estimatedTime: string
    estimatedFee: number
    popularity: string
    benefits?: string[]
    process?: string[]
    useCase?: string
    href: string
  }
}

export function CreationOptionDetails({ option }: CreationOptionDetailsProps) {
  // Guard against undefined option
  if (!option) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Select an option to see details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {option.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{option.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="text-sm font-medium">{option.estimatedTime}</div>
              <div className="text-xs text-muted-foreground">Est. Time</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="text-sm font-medium">{option.popularity}</div>
              <div className="text-xs text-muted-foreground">Popularity</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Network Fee</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {option.estimatedFee}
            </Badge>
          </div>

          <Link href={option.href}>
            <Button className="w-full" size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Benefits */}
      {option.benefits && option.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {option.benefits.slice(0, 4).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Process */}
      {option.process && option.process.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {option.process.slice(0, 4).map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Use Case */}
      {option.useCase && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfect For</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{option.useCase}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
