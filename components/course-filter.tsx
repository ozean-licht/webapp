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
          <SelectItem value="free" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Kostenlos
          </SelectItem>
          <SelectItem value="basic" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Basis Kurse
          </SelectItem>
          <SelectItem value="advanced" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Fortgeschritten
          </SelectItem>
          <SelectItem value="premium" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Premium
          </SelectItem>
          <SelectItem value="spiritual" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Spirituell
          </SelectItem>
          <SelectItem value="quantum" className="text-white hover:bg-[#0E282E] focus:bg-[#0E282E]">
            Quanten-Transformation
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
