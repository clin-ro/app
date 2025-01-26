"use client"

import { useEffect, useState } from "react"
import { User, Bell, Settings, CreditCard, Calendar, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import Link from "next/link"
import { AuthRequired } from "../components/auth-required"
import { supabase } from "@/lib/supabase/client"
import { getCurrentUser, signOut } from "@/lib/supabase/auth"
import { LoadingSpinner } from "../components/loading-spinner"

interface UserProfile {
  first_name: string
  last_name: string
  email: string
}

const menuItems = [
  {
    href: "/client/profile/account",
    label: APP_STRINGS.profile.accountDetails,
    icon: User,
  },
  {
    href: "/client/appointments",
    label: APP_STRINGS.profile.appointments,
    icon: Calendar,
  },
  {
    href: "/client/profile/notifications",
    label: APP_STRINGS.profile.notifications,
    icon: Bell,
    badge: 5,
  },
  {
    href: "/client/profile/memberships",
    label: APP_STRINGS.profile.memberships,
    icon: CreditCard,
  },
  {
    href: "/client/profile/settings",
    label: APP_STRINGS.profile.notificationSettings,
    icon: Settings,
  },
  {
    href: "/client/profile/support",
    label: APP_STRINGS.profile.support,
    icon: HelpCircle,
  },
]

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await getCurrentUser()
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching user profile:", error)
        } else {
          setUserProfile(data)
        }
      }
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error("Error signing out:", error)
    } else {
      // Redirect to home page or login page after sign out
      window.location.href = "/"
    }
  }

  if (isLoading) {
    return <LoadingSpinner size={32} />
  }

  return (
    <AuthRequired>
      <main className="container space-y-6 pt-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold">
            {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "Loading..."}
          </h1>
          {userProfile && <p className="text-sm text-muted-foreground">{userProfile.email}</p>}
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
            <LogOut className="mr-3 h-5 w-5" />
            {APP_STRINGS.auth.signOut}
          </Button>
        </div>
      </main>
    </AuthRequired>
  )
}

