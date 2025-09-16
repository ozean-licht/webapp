import type React from "react"

interface SpanDesignProps {
  children: React.ReactNode
  className?: string
}

export { SpanDesign }
export default function SpanDesign({ children, className = "" }: SpanDesignProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Left decorative element */}
      <div className="flex-shrink-0">
        <img
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/SpanAccent.png"
          alt="Decorative accent"
          className="w-[41px] h-[17px] object-cover"
        />
      </div>

      {/* Text content */}
      <span
        className="text-[#0ec2bc] text-lg font-normal whitespace-nowrap"
        style={{ fontFamily: "var(--font-montserrat-alternates)" }}
      >
        {children}
      </span>

      {/* Right decorative element (mirrored) */}
      <div className="flex-shrink-0">
        <img
          src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/SpanAccent.png"
          alt="Decorative accent"
          className="w-[41px] h-[17px] object-cover scale-x-[-1]"
        />
      </div>
    </div>
  )
}
