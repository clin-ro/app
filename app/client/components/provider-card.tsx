import { Heart, MapPin, Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface Provider {
  id: string
  name: string
  rating: number
  reviews_count: number
  address: string
  city: string
  image_url: string
  logo_url: string
  promoted: boolean
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image src={provider.image_url || "/placeholder.svg"} alt="" fill className="object-cover" />
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 bg-white/50 hover:bg-white/75">
            <Heart className="h-5 w-5" />
          </Button>
          {provider.promoted && (
            <Badge variant="secondary" className="absolute left-2 top-2 bg-primary/10 text-primary">
              {APP_STRINGS.search.promoted}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold">{provider.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{provider.rating.toFixed(2)}</span>
              <span className="text-muted-foreground">
                ({provider.reviews_count} {APP_STRINGS.search.reviews})
              </span>
            </div>
          </div>
          {provider.logo_url && (
            <Image
              src={provider.logo_url || "/placeholder.svg"}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {provider.address}, {provider.city}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

