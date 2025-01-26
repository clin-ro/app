"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../loading-spinner"

interface Specialist {
  id: string
  name: string
  role: string
  image_url: string
}

interface ProviderSpecialistsProps {
  providerId: string
}

export function ProviderSpecialists({ providerId }: ProviderSpecialistsProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpecialists = async () => {
      const { data, error } = await supabase.from("specialists").select("*").eq("provider_id", providerId)

      if (error) {
        console.error("Error fetching specialists:", error)
      } else {
        setSpecialists(data)
      }
      setIsLoading(false)
    }

    fetchSpecialists()
  }, [providerId])

  if (isLoading) {
    return <LoadingSpinner size={24} />
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Alege specialist</h2>
      <div className="space-y-4">
        {specialists.map((specialist) => (
          <div key={specialist.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={specialist.image_url || "/placeholder.svg"}
                alt={specialist.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">{specialist.name}</h3>
                <p className="text-sm text-muted-foreground">{specialist.role}</p>
              </div>
            </div>
            <Button variant="secondary">Alege</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

