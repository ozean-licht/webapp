"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface CourseFilterProps {
  className?: string
  onFilterChange?: (filter: string) => void
}

export function CourseFilter({ className, onFilterChange }: CourseFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    onFilterChange?.(value)
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-white font-montserrat-alt text-sm">Kategorie:</span>
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px] bg-[#0A1A1A] border-[#0E282E] text-white hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Alle Kurse" />
        </SelectTrigger>
        <SelectContent className="bg-[#0A1A1A] border-[#0E282E]">
          <SelectItem value="all" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Alle Kurse
          </SelectItem>
          <SelectItem value="lcq" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            LCQ - Channeling Events
          </SelectItem>
          <SelectItem value="basis" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Basis
          </SelectItem>
          <SelectItem value="aufbau" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Aufbau
          </SelectItem>
          <SelectItem value="fortgeschritten" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Fortgeschritten
          </SelectItem>
          <SelectItem value="master" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Master
          </SelectItem>
          <SelectItem value="interview" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Interview
          </SelectItem>
          <SelectItem value="q&a" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Q&A
          </SelectItem>
          <SelectItem value="kostenlos" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Kostenlos
          </SelectItem>
          <SelectItem value="intensiv" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Intensiv
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
