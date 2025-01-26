import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift } from "lucide-react"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface ProviderGiftCardProps {
  provider: {
    name: string
  }
}

export function ProviderGiftCard({ provider }: ProviderGiftCardProps) {
  return (
    <Card className="mx-4 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-blue-600" />
            <div className="space-y-1">
              <h3 className="font-medium">{APP_STRINGS.provider.giftCard.title}</h3>
              <p className="text-sm text-muted-foreground">
                {APP_STRINGS.provider.giftCard.subtitle} {provider.name}
              </p>
            </div>
          </div>
          <Button variant="outline" className="text-blue-600">
            {APP_STRINGS.provider.giftCard.seeDetails}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

