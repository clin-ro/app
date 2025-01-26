"use client"

import { MapPin, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HomeHeader() {
  return (
    <div className="relative">
      <Image
        src="/placeholder.svg?height=150&width=1000"
        alt="Cover image"
        width={1000}
        height={150}
        className="w-full h-[150px] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] mb-2">CLIN</h1>
          <div className="flex w-full max-w-sm">
            <div className="relative flex-1">
              <Input type="text" placeholder={APP_STRINGS.home.searchPlaceholder} className="rounded-r-none pl-10" />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <Button asChild variant="secondary" className="rounded-l-none">
              <Link href="/client/searching">
                <MapPin className="mr-2 h-4 w-4" />
                {APP_STRINGS.home.selectCity}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

