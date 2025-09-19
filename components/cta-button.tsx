"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CtaButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function CtaButton({ children, onClick, className, disabled = false, type = "button" }: CtaButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-gradient-to-r from-primary via-[#0FA8A3] to-primary border-2 border-primary/50 hover:from-[#0FA8A3] hover:via-primary hover:to-[#0FA8A3] text-white text-lg px-8 py-[22px] rounded-full font-montserrat-alternates transition-all duration-200 shadow-lg hover:shadow-xl font-normal",
        className,
      )}
    >
      {children}
    </Button>
  )
}

export default CtaButton
