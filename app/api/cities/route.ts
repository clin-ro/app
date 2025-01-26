import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  const { data, error } = await supabase.from("providers").select("city").not("city", "is", null)

  if (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }

  const cityCounts = data.reduce((acc: Record<string, number>, provider) => {
    acc[provider.city] = (acc[provider.city] || 0) + 1
    return acc
  }, {})

  const sortedCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([city]) => city)

  return NextResponse.json(sortedCities)
}

