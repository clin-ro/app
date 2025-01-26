"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../loading-spinner"

interface Review {
  id: string
  user: {
    name: string
    image_url: string
  }
  rating: number
  comment: string
  created_at: string
}

interface ProviderReviewsProps {
  providerId: string
}

export function ProviderReviews({ providerId }: ProviderReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          user:users (
            name,
            image_url
          )
        `)
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
      } else {
        setReviews(data)
      }
      setIsLoading(false)
    }

    fetchReviews()
  }, [providerId])

  if (isLoading) {
    return <LoadingSpinner size={24} />
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recenzii și evaluări</h2>
        <Button variant="outline">Adaugă recenzie</Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Image
                src={review.user.image_url || "/placeholder.svg"}
                alt={review.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{review.user.name}</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

