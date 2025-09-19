"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LanguagePickerProps {
  className?: string
}

const languages = [
  { code: "de", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/german.svg", name: "Deutsch" },
  { code: "en", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/united_kingdom.svg", name: "English" },
  { code: "es", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/spain.svg", name: "Español" },
  { code: "pt", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/portugal.svg", name: "Português" },
  { code: "ru", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/russia.svg", name: "Русский" },
  { code: "el", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/greek.svg", name: "Ελληνικά" },
  { code: "fr", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/france.svg", name: "Français" },
  { code: "it", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/italy.svg", name: "Italiano" },
  { code: "tr", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/turkey.svg", name: "Türkçe" },
  { code: "ja", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/japan.svg", name: "日本語" },
  { code: "zh", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/china.svg", name: "中文" },
  { code: "ar", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/arab.svg", name: "العربية" },
  { code: "hi", flag: "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Flags%20/india.svg", name: "हिन्दी" },
]

export function LanguagePicker({ className }: LanguagePickerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <div className="w-[71px] h-[32px] bg-[#0A1A1A] border-[#0E282E] rounded-md p-1.5 flex items-center justify-center">
        <div className="w-6 h-4 bg-gray-600 rounded-sm animate-pulse"></div>
      </div>
    )
  }

  return (
    <Select defaultValue="de">
      <SelectTrigger className="w-[71px] h-[32px] bg-[#0A1A1A] border-[#0E282E] rounded-md hover:border-primary/50 transition-colors p-1.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="bg-[#0A1A1A] border-[#0E282E] rounded-md max-h-[300px] overflow-y-auto w-[80px]"
      >
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E] h-14 flex items-center justify-center p-1"
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className="w-8 h-6 object-cover rounded-sm"
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
