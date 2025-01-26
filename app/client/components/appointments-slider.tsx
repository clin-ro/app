"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { supabase } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/supabase/auth"
import { LoadingSpinner } from "./loading-spinner"

interface Appointment {
  id: string
  provider: {
    name: string
    logo_url: string
  }
  appointment_date: string
  appointment_time: string
  status: "confirmed" | "completed" | "cancelled"
}

export function AppointmentsSlider() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = await getCurrentUser()
      if (user) {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            provider:providers (name, logo_url)
          `)
          .eq("user_id", user.id)
          .order("appointment_date", { ascending: true })
          .limit(5)

        if (error) {
          console.error("Error fetching appointments:", error)
        } else {
          setAppointments(data as Appointment[])
        }
      }
      setIsLoading(false)
    }

    fetchAppointments()
  }, [])

  if (isLoading) {
    return <LoadingSpinner size={24} />
  }

  if (appointments.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="flex overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="mr-3 flex min-w-[280px] items-center gap-3 rounded-lg border bg-white p-3"
          >
            <Image
              src={appointment.provider.logo_url || "/placeholder.svg"}
              alt={appointment.provider.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="space-y-1">
              <div className="text-sm font-medium">{appointment.provider.name}</div>
              <div className="text-xs text-gray-500">
                {appointment.appointment_date} - {appointment.appointment_time}
              </div>
              <div className="text-xs font-medium text-blue-600">
                {APP_STRINGS.home.appointments[appointment.status === "confirmed" ? "upcoming" : "completed"]}
              </div>
            </div>
          </div>
        ))}
        <Link href="/client/appointments" className="flex items-center justify-center gap-2 rounded-lg p-3">
          <span className="text-sm font-medium text-blue-600">{APP_STRINGS.home.appointments.viewAll}</span>
          <ArrowRight className="h-5 w-5 text-blue-600" />
        </Link>
      </div>
    </div>
  )
}

