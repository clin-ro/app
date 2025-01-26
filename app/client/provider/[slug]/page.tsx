"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ProviderHeader } from "../../components/provider/provider-header"
import { ProviderServices } from "../../components/provider/provider-services"
import { ProviderSpecialists } from "../../components/provider/provider-specialists"
import { ProviderReviews } from "../../components/provider/provider-reviews"
import { ProviderContact } from "../../components/provider/provider-contact"
import { ProviderGallery } from "../../components/provider/provider-gallery"
import { ProviderGiftCard } from "../../components/provider/provider-gift-card"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../../components/loading-spinner"

interface Provider {
  id: string
  name: string
  description: string
  address: string
  city: string
  rating: number
  reviews_count: number
  logo_url: string
  working_hours: Record<string, string>
}

export default function ProviderPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [activeSection, setActiveSection] = useState("services")
  const [isLoading, setIsLoading] = useState(true)

  const servicesRef = useRef<HTMLDivElement>(null)
  const specialistsRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProvider = async () => {
      const { data, error } = await supabase.from("providers").select("*").eq("id", params.slug).single()

      if (error) {
        console.error("Error fetching provider:", error)
        router.push("/client/search")
      } else {
        setProvider(data)
      }
      setIsLoading(false)
    }

    fetchProvider()
  }, [params.slug, router])

  const scrollToSection = (section: string) => {
    const refs = {
      services: servicesRef,
      specialists: specialistsRef,
      reviews: reviewsRef,
      contact: contactRef,
    }

    const ref = refs[section as keyof typeof refs]
    if (ref?.current) {
      const headerOffset = 120
      const elementPosition = ref.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "services", ref: servicesRef },
        { id: "specialists", ref: specialistsRef },
        { id: "reviews", ref: reviewsRef },
        { id: "contact", ref: contactRef },
      ]

      const currentSection = sections.find((section) => {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading || !provider) {
    return <LoadingSpinner size={32} />
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="sticky top-0 z-50 bg-background">
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold truncate">{provider.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs value={activeSection} className="w-full" onValueChange={scrollToSection}>
          <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
            <TabsTrigger value="services" className="flex-1">
              Servicii
            </TabsTrigger>
            <TabsTrigger value="specialists" className="flex-1">
              Specialiști
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Recenzii
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1">
              Contact
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <ProviderHeader provider={provider} />
        <ProviderGallery providerId={provider.id} />
        <ProviderGiftCard provider={provider} />

        <div ref={servicesRef} id="services">
          <ProviderServices providerId={provider.id} />
        </div>

        <div ref={specialistsRef} id="specialists">
          <ProviderSpecialists providerId={provider.id} />
        </div>

        <div ref={reviewsRef} id="reviews">
          <ProviderReviews providerId={provider.id} />
        </div>

        <div ref={contactRef} id="contact">
          <ProviderContact provider={provider} />
        </div>
      </div>
    </main>
  )
}

