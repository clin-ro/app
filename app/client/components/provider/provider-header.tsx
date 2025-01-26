import { Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ProviderHeaderProps {
  provider: {
    name: string
    rating: number
    reviews_count: number
    logo_url: string
    address: string
    city: string
    description: string
  }
}

export function ProviderHeader({ provider }: ProviderHeaderProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Image
          src={provider.logo_url || "/placeholder.svg"}
          alt={provider.name}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="space-y-1 flex-1">
          <h2 className="font-semibold text-xl">{provider.name}</h2>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{provider.rating.toFixed(2)}</span>
            <span className="text-muted-foreground">({provider.reviews_count} reviews)</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {provider.address}, {provider.city}
          </div>
        </div>
      </div>
      {provider.description && <p className="text-sm text-muted-foreground">{provider.description}</p>}
    </div>
  )
}

