"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, MapPin, Search, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../components/loading-spinner"

interface SearchResult {
  id: string
  name: string
  rating: number
  reviews_count: number
  address: string
  city: string
  logo_url: string
}

interface AggregatedData {
  cities: string[]
  categories: string[]
}

export default function SearchingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCitySelection, setShowCitySelection] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "")
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({ cities: [], categories: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)

  useEffect(() => {
    const fetchAggregatedData = async () => {
      try {
        const { data: providersData, error: providersError } = await supabase
          .from("providers")
          .select("city, categories(name)")
          .not("city", "is", null)

        if (providersError) throw providersError

        const cities = Array.from(new Set(providersData.map((item) => item.city)))
        const categories = Array.from(new Set(providersData.flatMap((item) => item.categories?.name || [])))

        setAggregatedData({ cities, categories })
      } catch (error) {
        console.error("Error fetching aggregated data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAggregatedData()
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return

      setIsLoadingResults(true)
      try {
        const { data, error } = await supabase
          .from("providers")
          .select("id, name, rating, reviews_count, address, city, logo_url")
          .ilike("name", `%${searchQuery}%`)
          .order("rating", { ascending: false })
          .limit(5)

        if (error) throw error

        setSearchResults(data)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setIsLoadingResults(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery])

  const handleSearch = (query: string) => {
    if (query) {
      router.push(
        `/client/search?q=${encodeURIComponent(query)}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ""}`,
      )
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setShowCitySelection(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background">
        <div className="flex h-14 items-center gap-4 border-b px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <span className="text-lg font-semibold">{APP_STRINGS.search.title}</span>
        </div>

        <div className="space-y-2 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={APP_STRINGS.search.searchPlaceholder}
              className="pl-10 ring-2 ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={clearSearch}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 ring-2 ring-primary"
            onClick={() => setShowCitySelection(true)}
          >
            <MapPin className="h-5 w-5" />
            {selectedCity || APP_STRINGS.search.selectCity}
          </Button>
        </div>
      </div>

      <div className="px-4">
        {isLoading ? (
          <LoadingSpinner size={32} />
        ) : showCitySelection ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 py-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span>{APP_STRINGS.search.yourLocation}</span>
            </div>
            <div className="space-y-4">
              {aggregatedData.cities.map((city) => (
                <button
                  key={city}
                  className="flex w-full items-center gap-3 py-2"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="space-y-4">
            {isLoadingResults ? (
              <LoadingSpinner size={32} />
            ) : (
              searchResults.map((result) => (
                <button
                  key={result.id}
                  className="flex w-full items-center gap-4 py-4"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-1 items-start justify-between">
                    <div className="space-y-1 text-left">
                      <div className="font-medium">{result.name}</div>
                      {result.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{result.rating.toFixed(2)}</span>
                          <span className="text-muted-foreground">
                            ({result.reviews_count} {APP_STRINGS.search.reviews})
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {result.address}, {result.city}
                      </div>
                    </div>
                    {result.logo_url && (
                      <Image
                        src={result.logo_url || "/placeholder.svg"}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {aggregatedData.categories.map((category) => (
              <button
                key={category}
                className="flex w-full items-center gap-3 py-2"
                onClick={() =>
                  router.push(
                    `/client/search?category=${encodeURIComponent(category)}${
                      selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ""
                    }`,
                  )
                }
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <span>{category}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

