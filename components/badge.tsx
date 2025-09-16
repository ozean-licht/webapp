import type React from "react"
import { ArrowRight } from "lucide-react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "colorful"
  className?: string
}

export function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const baseClasses =
    "relative inline-flex items-center gap-3 px-3 py-1.5 rounded-full text-base font-medium transition-all duration-300"

  const variantClasses = {
    primary: "text-white border border-white/10",
    colorful: "text-white border border-white/10",
  }

  const backgroundClasses = {
    primary: "bg-[#0EA6C1]/12",
    colorful: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600",
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${backgroundClasses[variant]} ${className}`}>
      <div
        className="absolute -inset-px rounded-full transition-opacity duration-300 hover:opacity-[0.72]"
        style={{
          background: "linear-gradient(0deg, #B38728 0%, #662D91 50%, #A02163 75%, #1B3B6F 90%)",
          filter: "blur(12px)",
          zIndex: 0,
          overflow: "visible",
          opacity: 0.42,
        }}
      />
      <span className="font-montserrat-alternates relative z-10">{children}</span>
      <ArrowRight className="w-4 h-4 relative z-10" />
    </div>
  )
}
