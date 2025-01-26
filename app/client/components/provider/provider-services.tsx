"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../loading-spinner"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  discount_price: number | null
}

interface ProviderServicesProps {
  providerId: string
}

export function ProviderServices({ providerId }: ProviderServicesProps) {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*").eq("provider_id", providerId).order("name")

      if (error) {
        console.error("Error fetching services:", error)
      } else {
        setServices(data)
      }
      setIsLoading(false)
    }

    fetchServices()
  }, [providerId])

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return <LoadingSpinner size={24} />
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={APP_STRINGS.provider.searchService}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <h3 className="font-medium">{service.name}</h3>
              <div className="text-sm text-muted-foreground">{service.duration} min</div>
              {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
            </div>
            <div className="text-right">
              {service.discount_price ? (
                <div className="space-y-1">
                  <Badge variant="destructive" className="bg-pink-100 text-pink-700 hover:bg-pink-100">
                    -50%
                  </Badge>
                  <div className="space-y-0.5">
                    <div className="text-sm line-through text-muted-foreground">{service.price} lei</div>
                    <div className="font-medium text-pink-600">{service.discount_price} lei</div>
                  </div>
                </div>
              ) : (
                <div className="font-medium">{service.price} lei</div>
              )}
              <Button className="mt-2 bg-blue-600 hover:bg-blue-700">{APP_STRINGS.provider.schedule}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

