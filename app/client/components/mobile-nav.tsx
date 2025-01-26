"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Calendar, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_STRINGS } from "@/lib/constants/app-strings"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/client",
      label: APP_STRINGS.navigation.home,
      icon: Home,
    },
    {
      href: "/client/search",
      label: APP_STRINGS.navigation.search,
      icon: Search,
    },
    {
      href: "/client/appointments",
      label: APP_STRINGS.navigation.appointments,
      icon: Calendar,
    },
    {
      href: "/client/favorites",
      label: APP_STRINGS.navigation.favorites,
      icon: Heart,
    },
    {
      href: "/client/profile",
      label: APP_STRINGS.navigation.profile,
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

