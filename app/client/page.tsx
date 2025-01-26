import Image from "next/image"
import Link from "next/link"
import { HomeHeader } from "./components/home-header"
import { AppointmentsSlider } from "./components/appointments-slider"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { supabase } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
  image_url: string
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, image_url")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

export default async function ClientHome() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen pb-20">
      <HomeHeader />

      <div className="mt-4">
        <AppointmentsSlider />
      </div>

      <div className="mt-6 px-4">
        <h2 className="mb-4 text-xl font-semibold">{APP_STRINGS.home.bookOnline}</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/client/search?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-sm font-medium text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

