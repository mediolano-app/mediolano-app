import { useAccount } from "@starknet-react/core"
import { useState, useCallback } from "react"

// Simulated API functions (replace with actual implementations)
const connectXAccount = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
  
  return { success: true, username: "exampleUser" }
}

const verifyIdentity = async (username: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
  return { success: true, verified: true }
}

export type VerificationState = {
  connection:  "idle" | "connecting" | "connected" | "verifying" | "verified" | "error",
  verification:  "unchecked" | "checking" | "verified" | "error"
}

export const useXVerification = () => {
  const [state, setState] = useState<VerificationState>({
    connection: 'idle', verification: 'unchecked'
  })
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()
  const [currentUser, setCurrentUser] = useState<Record<string, string> | null>(null)

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, connection: 'connecting' }))
    setError(null)
    try {
      const res = await fetch(`api/auth/connect?address=${address}`)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const { authUrl, data } = await res.json()
      console.log(authUrl)

      setUsername(data.name)
      setCurrentUser(data)
      // Redirect to X
      console.log("connect went well")
      window.location.href = authUrl;
    } catch (err) {
      setError("Connection Failed")
      setState(prev => ({...prev, connection: 'error'}))
      console.log("connect did not go well")
      setCurrentUser(null)
    }
  }, [address])

  const verify = useCallback(async (user: string) => {
    // if 
    setState(prev => ({...prev, verification: 'checking'}))
    setError(null)
    try {
      // const res = await fetch(`/api/verify`)
      // const data = await res.json()

      setState(prev => ({...prev,
        verification: currentUser?.verified? "verified" : "unchecked"
      }))
      console.log("verify went well")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setState(prev => ({...prev, verification: 'error'}))
      console.log("verify did not go well")
    }
  }, [])

  const reset = useCallback(() => {
    setState(prev => ({...prev, connection: 'idle', verification: 'unchecked'}))
    setUsername("")
    setError(null)
  }, [])

  return { state, username, error, connect, verify, reset }
}

