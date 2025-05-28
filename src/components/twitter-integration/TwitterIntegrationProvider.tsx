"use client"

import React, { createContext, useContext } from "react"
import { useTwitterIntegration, type TwitterIntegrationContextType } from "@/hooks/useTwitterIntegration"

const TwitterIntegrationContext = createContext<TwitterIntegrationContextType | null>(null)

export const useTwitterIntegrationContext = () => {
  const context = useContext(TwitterIntegrationContext)
  if (!context) {
    throw new Error('useTwitterIntegrationContext must be used within a TwitterIntegrationProvider')
  }
  return context
}

export const TwitterIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const integration = useTwitterIntegration()
  return (
    <TwitterIntegrationContext.Provider value={integration}>
      {children}
    </TwitterIntegrationContext.Provider>
  )
}