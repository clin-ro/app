"use client"

import { useEffect, useState } from "react"
import { Heart, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import Image from "next/image"
import { AuthRequired } from "../components/auth-required"
import { supabase } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/supabase/auth"
import { LoadingSpinner } from "../components/loading-spinner"

interface FavoriteProvider {
  id: string
  name: string
  rating: number
  reviews_count: number
  address: string
  city: string
  image_url: string
}

export default function FavoritesPage() {
  const [favoriteProviders, setFavoriteProviders] = useState<FavoriteProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = await getCurrentUser()
      if (user) {
        const { data, error } = await supabase
          .from("favorites")
          .select(`
            provider:providers (
              id,
              name,
              rating,
              reviews_count,
              address,
              city,
              image_url
            )
          `)
          .eq("user_id", user.id)

        if (error) {
          console.error("Error fetching favorites:", error)
        } else {
          setFavoriteProviders(data.map((item) => item.provider) as FavoriteProvider[])
        }
      }
      setIsLoading(false)
    }

    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (providerId: string) => {
    const user = await getCurrentUser()
    if (user) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("provider_id", providerId)

      if (error) {
        console.error("Error removing favorite:", error)
      } else {
        setFavoriteProviders(favoriteProviders.filter((provider) => provider.id !== providerId))
      }
    }
  }

  if (isLoading) {
    return <LoadingSpinner size={32} />
  }

  return (
    <AuthRequired>
      <main className="container space-y-6 pt-4">
        <h1 className="text-xl font-semibold">{APP_STRINGS.navigation.favorites}</h1>

        <div className="space-y-4">
          {favoriteProviders.map((provider) => (
            <div key={provider.id} className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={provider.image_url || "/placeholder.svg"}
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => handleRemoveFavorite(provider.id)}
                >
                  <Heart className="h-5 w-5 fill-primary text-primary" />
                </Button>
              </div>
              <div className="space-y-1 px-1">
                <h3 className="font-semibold">{provider.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{provider.rating.toFixed(2)}</span>
                  <span className="text-muted-foreground">({provider.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {provider.address}, {provider.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AuthRequired>
  )
}

