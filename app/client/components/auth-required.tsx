"use client"

import { useState, useEffect } from "react"
import { AuthScreen } from "./auth/auth-screen"
import { getCurrentUser } from "@/lib/supabase/auth"

interface AuthRequiredProps {
  children: React.ReactNode
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return <AuthScreen mode="login" onAuthSuccess={() => setIsAuthenticated(true)} />
}

