import { supabase } from "./client"

export async function getAppointments(userId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })
  return { data, error }
}

export async function createAppointment(appointmentData: any) {
  const { data, error } = await supabase.from("appointments").insert(appointmentData).select()
  return { data, error }
}

export async function updateAppointment(id: number, appointmentData: any) {
  const { data, error } = await supabase.from("appointments").update(appointmentData).eq("id", id).select()
  return { data, error }
}

export async function deleteAppointment(id: number) {
  const { error } = await supabase.from("appointments").delete().eq("id", id)
  return { error }
}

