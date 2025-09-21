"use client"

import { cn } from "@/lib/utils"

interface TickerProps {
  images: string[]
  direction?: "left" | "right"
  speed?: "slow" | "medium" | "fast" | "extra-slow" | number
  className?: string
  imageAlt?: string
}

// PropertyControls for design tools
export const TickerPropertyControls = {
  images: {
    type: "array" as const,
    title: "Images",
    items: {
      type: "string" as const,
    },
    default: [],
  },
  direction: {
    type: "enum" as const,
    title: "Direction",
    options: ["left", "right"],
    default: "left",
  },
  speed: {
    type: "enum" as const,
    title: "Speed",
    options: ["slow", "medium", "fast", "extra-slow"],
    default: "slow",
  },
  imageAlt: {
    type: "string" as const,
    title: "Image Alt Text",
    default: "Image",
  },
}

export function Ticker({
  images,
  direction = "left",
  speed = "medium",
  className,
  imageAlt = "Image"
}: TickerProps) {
  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full overflow-hidden", className)}>
        <div className="text-center py-8 text-white/60">
          No images provided
        </div>
      </div>
    )
  }

  // Use enough images for smooth infinite scrolling
  const totalImages = images.length * 20 // 20 sets for smooth looping
  const containerWidth = "2000%" // 20 duplications = 2000% width

  // Calculate animation duration based on speed
  const getDuration = (speed: string) => {
    switch (speed) {
      case "extra-slow": return "263s" // 202s * 1.3 = 263s (30% slower than slow)
      case "slow": return "202s" // Base slow speed
      case "fast": return "30s"
      default: return "60s"
    }
  }

  const duration = getDuration(speed)
  const animationName = direction === "right" ? "scroll-right" : "scroll-left"

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div
        className="flex gap-2"
        style={{
          width: containerWidth,
          animation: `${animationName} ${duration} linear infinite`,
        }}
      >
        {/* Render enough images to fill viewport and create seamless loop */}
        {Array.from({ length: totalImages }, (_, index) => {
          const imageIndex = index % images.length
          return (
            <div key={`image-${index}`} className="flex-shrink-0 w-64 h-40">
              <div className="w-full h-full p-2 rounded-xl border border-border" style={{ backgroundColor: "#00151A" }}>
                <img
                  src={images[imageIndex] || "/placeholder.svg"}
                  alt={`${imageAlt} ${imageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
