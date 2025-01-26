"use client"

import { useState } from "react"
import { BaseAuthScreen } from "./base-screen"
import { PhoneAuthScreen } from "./phone-screen"
import { VerifyAuthScreen } from "./verify-screen"
import { signInWithPhone, verifyPhoneOTP } from "@/lib/supabase/auth"

type AuthMode = "login" | "signup" | "phone" | "verify"

interface AuthScreenProps {
  mode: "login" | "signup"
  onAuthSuccess: () => void
}

export function AuthScreen({ mode: initialMode, onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSocialAuth = async (provider: "facebook" | "google" | "apple") => {
    // Implement social auth here using Supabase
    console.log(`Authenticating with ${provider}`)
    // After successful auth, call onAuthSuccess
    onAuthSuccess()
  }

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone)
    const { error } = await signInWithPhone(phone)
    if (error) {
      console.error("Phone authentication error:", error.message)
      // Handle error (e.g., show error message to user)
    } else {
      setMode("verify")
    }
  }

  const handleVerificationSubmit = async (code: string) => {
    const { error } = await verifyPhoneOTP(phoneNumber, code)
    if (error) {
      console.error("Verification error:", error.message)
      // Handle error (e.g., show error message to user)
    } else {
      onAuthSuccess()
    }
  }

  const handleBack = () => {
    if (mode === "verify") {
      setMode("phone")
    } else if (mode === "phone") {
      setMode(initialMode)
    }
  }

  if (mode === "phone") {
    return <PhoneAuthScreen onBack={handleBack} onSubmit={handlePhoneSubmit} />
  }

  if (mode === "verify") {
    return (
      <VerifyAuthScreen
        phoneNumber={phoneNumber}
        onBack={handleBack}
        onSubmit={handleVerificationSubmit}
        onResend={() => handlePhoneSubmit(phoneNumber)}
      />
    )
  }

  return <BaseAuthScreen mode={initialMode} onSocialAuth={handleSocialAuth} onPhoneAuth={() => setMode("phone")} />
}

