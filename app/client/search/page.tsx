"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { FilterSheet } from "../components/filter-sheet"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { LoadingSpinner } from "../components/loading-spinner"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import InfiniteLoader from "react-window-infinite-loader"
import { ProviderSearchCard } from "../components/search/provider-search-card"

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

const ITEMS_PER_PAGE = 20
const CARD_HEIGHT = 380 // Adjusted height for the new card design

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const city = searchParams.get("city") || ""
  const category = searchParams.get("category")

  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(true)
  const pageRef = useRef(0)

  const displayText = query || category || ""
  const searchDisplay = city ? `${displayText} ${APP_STRINGS.search.inCity} ${city}` : displayText

  const fetchProviders = useCallback(async () => {
    if (!hasNextPage) return

    setIsLoading(true)
    let query = supabase
      .from("providers")
      .select("id, name, rating, reviews_count, address, city, image_url, logo_url, promoted")
      .order("promoted", { ascending: false })
      .order("rating", { ascending: false })
      .range(pageRef.current * ITEMS_PER_PAGE, (pageRef.current + 1) * ITEMS_PER_PAGE - 1)

    if (city) {
      query = query.eq("city", city)
    }

    if (category) {
      const { data: categoryData } = await supabase.from("categories").select("id").eq("name", category).single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching providers:", error)
    } else {
      setProviders((prevProviders) => [...prevProviders, ...data])
      setHasNextPage(data.length === ITEMS_PER_PAGE)
      pageRef.current += 1
    }
    setIsLoading(false)
  }, [city, category, hasNextPage])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const isItemLoaded = (index: number) => index < providers.length
  const itemCount = hasNextPage ? providers.length + 1 : providers.length

  const ProviderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const provider = providers[index]

    if (!provider) {
      return (
        <div style={style} className="p-4 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      )
    }

    return (
      <div style={style} className="p-4">
        <ProviderSearchCard provider={provider} />
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-2 border-b p-4">
          <div className="relative flex-1" onClick={() => router.push("/client/searching")}>
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input value={searchDisplay} className="pl-10" readOnly />
          </div>
          <FilterSheet>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </FilterSheet>
        </div>
      </div>

      <div className="h-[calc(100vh-80px)]">
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={fetchProviders}
              threshold={2}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className="List scrollbar-hide"
                  height={height}
                  itemCount={itemCount}
                  itemSize={CARD_HEIGHT}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  width={width}
                >
                  {ProviderRow}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </main>
  )
}

