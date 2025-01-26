"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthRequired } from "../components/auth-required"
import { supabase } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/supabase/auth"
import { LoadingSpinner } from "../components/loading-spinner"

interface Appointment {
  id: string
  service: {
    name: string
  }
  provider: {
    name: string
    address: string
  }
  appointment_date: string
  appointment_time: string
  status: "confirmed" | "completed" | "cancelled"
}

export default function AppointmentsPage() {
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
            service:services (name),
            provider:providers (name, address)
          `)
          .eq("user_id", user.id)
          .order("appointment_date", { ascending: true })

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

  const handleCancelAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id)

    if (error) {
      console.error("Error cancelling appointment:", error)
    } else {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: "cancelled" } : appointment,
        ),
      )
    }
  }

  if (isLoading) {
    return <LoadingSpinner size={32} />
  }

  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "confirmed")
  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "completed" || appointment.status === "cancelled",
  )

  return (
    <AuthRequired>
      <main className="container pt-4">
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">{APP_STRINGS.appointments.upcoming}</TabsTrigger>
            <TabsTrigger value="past">{APP_STRINGS.appointments.past}</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4 pt-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{appointment.service.name}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.provider.name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>
                    Cancel
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.provider.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="past" className="space-y-4 pt-4">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{appointment.service.name}</h3>
                    <span className="text-sm text-muted-foreground capitalize">{appointment.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{appointment.provider.name}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.provider.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </AuthRequired>
  )
}

