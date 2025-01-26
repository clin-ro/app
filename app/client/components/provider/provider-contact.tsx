import { Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface ProviderContactProps {
  provider: {
    address: string
    city: string
    working_hours?: Record<string, string>
  }
}

export function ProviderContact({ provider }: ProviderContactProps) {
  const days = [
    { key: "monday", label: APP_STRINGS.provider.days.monday },
    { key: "tuesday", label: APP_STRINGS.provider.days.tuesday },
    { key: "wednesday", label: APP_STRINGS.provider.days.wednesday },
    { key: "thursday", label: APP_STRINGS.provider.days.thursday },
    { key: "friday", label: APP_STRINGS.provider.days.friday },
    { key: "saturday", label: APP_STRINGS.provider.days.saturday },
    { key: "sunday", label: APP_STRINGS.provider.days.sunday },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{APP_STRINGS.provider.contact}</h2>
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
              provider.address + ", " + provider.city,
            )}&layer=mapnik`}
            width="100%"
            height="100%"
            className="border-0"
          />
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            {provider.address}, {provider.city}
          </div>
        </div>
        <Button className="w-full">{APP_STRINGS.provider.seeDirections}</Button>
      </div>

      {provider.working_hours && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">{APP_STRINGS.provider.workingHours}</h3>
          </div>
          <div className="space-y-2 text-sm">
            {days.map((day) => (
              <div key={day.key} className="flex justify-between">
                <span className="text-muted-foreground">{day.label}</span>
                <span className="font-medium">{provider.working_hours?.[day.key] || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

