"use client"

import { Info } from "@phosphor-icons/react"

interface NotificationProps {
  title: string
  description: string | React.ReactNode
  className?: string
}

export function Notification({ title, description, className = "" }: NotificationProps) {
  return (
    <div className={`bg-[#001212]/60 border border-[#0E282E] rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Info size={20} className="text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium mb-1" style={{ fontFamily: "var(--font-montserrat-alternates)" }}>
            {title}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
