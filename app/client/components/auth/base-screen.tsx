"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface BaseAuthScreenProps {
  mode: "login" | "signup"
  onSocialAuth: (provider: "facebook" | "google" | "apple") => void
  onPhoneAuth: () => void
}

export function BaseAuthScreen({ mode, onSocialAuth, onPhoneAuth }: BaseAuthScreenProps) {
  const isLogin = mode === "login"
  const title = isLogin ? APP_STRINGS.auth.signInTitle : APP_STRINGS.auth.signUpTitle
  const subtitle = isLogin ? APP_STRINGS.auth.signInSubtitle : APP_STRINGS.auth.signUpSubtitle

  return (
    <div className="flex min-h-screen flex-col bg-background px-4">
      <div className="flex h-14 items-center justify-between">
        <div></div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-5 w-5" />
          <span className="sr-only">{APP_STRINGS.auth.close}</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground max-w-[250px]">{subtitle}</p>
        </div>

        <div className="w-full max-w-[400px] space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={() => onSocialAuth("facebook")}
          >
            <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
            </svg>
            {APP_STRINGS.auth.continueWithFacebook}
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => onSocialAuth("google")}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {APP_STRINGS.auth.continueWithGoogle}
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => onSocialAuth("apple")}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91-.83 0-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53c-1.75 3-.46 7.5 1.26 10 .85 1.2 1.85 2.54 3.18 2.5 1.27-.05 1.76-.82 3.3-.82s2 .82 3.3.79c1.37 0 2.24-1.22 3.08-2.45a11 11 0 0 0 1.4-2.85 4.41 4.41 0 0 1-2.75-4.03z" />
            </svg>
            {APP_STRINGS.auth.continueWithApple}
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={onPhoneAuth}>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {APP_STRINGS.auth.continueWithPhone}
          </Button>
        </div>
      </div>
    </div>
  )
}

