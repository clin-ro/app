"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { APP_STRINGS } from "@/lib/constants/app-strings"
import { parsePhoneNumber, AsYouType, type CountryCode, getExampleNumber } from "libphonenumber-js"
import { getCountries, getCountryCallingCode } from "libphonenumber-js/max"
import examples from "libphonenumber-js/examples.mobile.json"

function getCountryFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

interface CountryOption {
  code: CountryCode
  name: string
  flag: string
  callingCode: string
}

interface PhoneAuthScreenProps {
  onBack: () => void
  onSubmit: (phoneNumber: string) => void
}

export function PhoneAuthScreen({ onBack, onSubmit }: PhoneAuthScreenProps) {
  const [country, setCountry] = useState<CountryCode>("RO")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [formattedNumber, setFormattedNumber] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const countryOptions: CountryOption[] = useMemo(() => {
    return getCountries().map((code) => ({
      code: code as CountryCode,
      name: new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code,
      flag: getCountryFlagEmoji(code),
      callingCode: getCountryCallingCode(code as CountryCode),
    }))
  }, [])

  const filteredCountryOptions = useMemo(() => {
    return countryOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.callingCode.includes(searchQuery) ||
        option.code.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [countryOptions, searchQuery])

  useEffect(() => {
    const asYouType = new AsYouType(country)
    const formatted = asYouType.input(phoneNumber)
    setFormattedNumber(formatted)
  }, [country, phoneNumber])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const phoneNumber = parsePhoneNumber(formattedNumber, country)
      if (phoneNumber && phoneNumber.isValid()) {
        onSubmit(phoneNumber.format("E.164"))
      } else {
        // Handle invalid phone number
        console.error("Invalid phone number")
      }
    } catch (error) {
      console.error("Error parsing phone number:", error)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const countryCode = `+${getCountryCallingCode(country)}`
    const input = e.target.value.slice(countryCode.length).replace(/\D/g, "")
    const asYouType = new AsYouType(country)
    const formatted = asYouType.input(input)

    setPhoneNumber(input)
    setFormattedNumber(countryCode + formatted)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-4">
      <div className="flex h-14 items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-4">
        <h1 className="mb-8 text-center text-2xl font-semibold">{APP_STRINGS.auth.phoneNumber.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{APP_STRINGS.auth.phoneNumber.label}</label>
            <div className="flex flex-col space-y-2">
              <Select value={country} onValueChange={(value) => setCountry(value as CountryCode)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder={APP_STRINGS.auth.phoneNumber.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full"
                    />
                  </div>
                  <ScrollArea className="h-[300px]">
                    {filteredCountryOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.flag}</span>
                          <span>{option.name}</span>
                          <span className="ml-auto text-muted-foreground">+{option.callingCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  type="tel"
                  value={`+${getCountryCallingCode(country)}${phoneNumber}`}
                  onChange={(e) => {
                    const inputValue = e.target.value
                    const countryCode = `+${getCountryCallingCode(country)}`
                    if (inputValue.startsWith(countryCode)) {
                      setPhoneNumber(inputValue.slice(countryCode.length))
                    }
                  }}
                  placeholder={
                    getExampleNumber(country, examples)
                      ?.formatNational()
                      .slice(getCountryCallingCode(country).length + 1) || APP_STRINGS.auth.phoneNumber.placeholder
                  }
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            {APP_STRINGS.auth.phoneNumber.continue}
          </Button>
        </form>
      </div>
    </div>
  )
}

