"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function PrimaryButton({ children, onClick, className, disabled = false, type = "button" }: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-primary hover:bg-[#0FA8A3] text-[#E1E3E9] text-lg px-8 py-[22px] rounded-full font-montserrat-alternates transition-all duration-200 shadow-lg hover:shadow-xl text-foreground font-normal",
        className,
      )}
    >
      {children}
    </Button>
  )
}

export default PrimaryButton
