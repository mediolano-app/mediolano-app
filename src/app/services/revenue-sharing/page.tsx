"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

// This is a redirect page that will automatically redirect to the management page
export default function RevenueSharing() {
  const router = useRouter()

  useEffect(() => {
    router.push("/revenue-sharing/management")
  }, [router])

  return null
}
