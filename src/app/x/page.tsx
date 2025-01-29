import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Coins, TrendingUp, Award, Gift, Zap, Shield, Rocket, Star, Clock, CheckCircle2, Flag, ArrowRight, ScrollText, LayoutGrid } from 'lucide-react'
import XVerification from "@/components/XVerification";

export default function XVPage() {
  

  return (
    <>
    <div className="container mx-auto p-4 space-y-8 mt-10 mb-20">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Verify your account with X</h1>
        <span className="text-lg">Linking your X (Twiiter) account should increase your social credibility and can help promote your content. All stored data is encrypted so that only you have access.</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        <XVerification />
        </div>
    </div>
    </>
  )
}