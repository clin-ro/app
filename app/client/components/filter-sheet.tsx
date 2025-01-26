"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { APP_STRINGS } from "@/lib/constants/app-strings"

interface FilterSheetProps {
  children: React.ReactNode
  onFilterChange?: (value: string) => void
}

export function FilterSheet({ children, onFilterChange }: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle>{APP_STRINGS.filters.title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="mt-4">
          <RadioGroup defaultValue="all" onValueChange={onFilterChange}>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal">
                {APP_STRINGS.filters.allResults}
              </Label>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="discounts" id="discounts" />
              <Label htmlFor="discounts" className="font-normal">
                {APP_STRINGS.filters.discounts}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </SheetContent>
    </Sheet>
  )
}

