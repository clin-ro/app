"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface VerifyAuthScreenProps {
  phoneNumber: string
  onBack: () => void
  onSubmit: (code: string) => void
  onResend: () => void
}

export function VerifyAuthScreen({ phoneNumber, onBack, onSubmit, onResend }: VerifyAuthScreenProps) {
  const [timeLeft, setTimeLeft] = useState(59)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const code = formData.get("code") as string
    onSubmit(code)
  }

  const handleResend = () => {
    if (!canResend) return
    setTimeLeft(59)
    setCanResend(false)
    onResend()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-4">
      <div className="flex h-14 items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-4">
        <h1 className="mb-2 text-center text-2xl font-semibold">{APP_STRINGS.auth.verification.title}</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          {APP_STRINGS.auth.verification.subtitle} {phoneNumber}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              name="code"
              placeholder={APP_STRINGS.auth.verification.placeholder}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {APP_STRINGS.auth.verification.verify}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              {APP_STRINGS.auth.verification.timer} {timeLeft} {APP_STRINGS.auth.verification.seconds}
            </p>
          ) : (
            <button onClick={handleResend} className="text-sm font-medium text-primary">
              {APP_STRINGS.auth.verification.resend}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

