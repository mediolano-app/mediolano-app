"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

// This is a redirect page that will automatically redirect to the management page
export default function RevenueSharing() {
  const router = useRouter()

  useEffect(() => {
    router.push("/services/revenue-sharing/management")
  }, [router])

  return null
}
