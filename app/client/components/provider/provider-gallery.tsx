"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../loading-spinner"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface GalleryImage {
  id: string
  url: string
}

interface ProviderGalleryProps {
  providerId: string
}

export function ProviderGallery({ providerId }: ProviderGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from("provider_gallery").select("id, url").eq("provider_id", providerId)

      if (error) {
        console.error("Error fetching gallery:", error)
      } else {
        setImages(data)
      }
      setIsLoading(false)
    }

    fetchGallery()
  }, [providerId])

  if (isLoading) {
    return <LoadingSpinner size={24} />
  }

  if (images.length === 0) {
    return null
  }

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-1 p-1">
        {images.map((image, index) => (
          <div key={image.id} className="aspect-square relative cursor-pointer" onClick={() => setSelectedImage(index)}>
            <Image src={image.url || "/placeholder.svg"} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-full h-full sm:max-w-[90vw] sm:max-h-[90vh] p-0">
          <div className="relative h-full">
            {selectedImage !== null && (
              <Image src={images[selectedImage].url || "/placeholder.svg"} alt="" fill className="object-contain" />
            )}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/75"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/75"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/75"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full">
              {selectedImage !== null ? `${selectedImage + 1} / ${images.length}` : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

