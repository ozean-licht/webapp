"use client"

import { useRef } from "react"

interface VideoThumbnail {
  id: string
  title: string
  thumbnail: string
}

export function YouTubeTicker() {
  const tickerRef = useRef<HTMLDivElement>(null)

  // Placeholder video data - replace with real YouTube API data
  const videos: VideoThumbnail[] = [
    {
      id: "1",
      title: "Spirituelle Transformation",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
    {
      id: "2",
      title: "Bewusstseinserweiterung",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
    {
      id: "3",
      title: "Energetische Heilung",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
    {
      id: "4",
      title: "Chakra Aktivierung",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
    {
      id: "5",
      title: "Meditation & Achtsamkeit",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
    {
      id: "6",
      title: "Lichtarbeit Grundlagen",
      thumbnail:
        "https://framerusercontent.com/images/JXAmqsHCzmh4ZoKcGp353O9vWI0.webp?scale-down-to=1024&width=1080&height=608",
    },
  ]

  // Only render original videos once - the animation will create the continuous loop

  return (
    <section className="w-full py-16 overflow-hidden">
      <div className="relative">
        <div
          ref={tickerRef}
          className="flex gap-6"
          style={{
            animation: "continuous-scroll 30s linear infinite",
          }}
        >
          {/* Render videos twice for seamless loop */}
          {[...videos, ...videos].map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="flex-shrink-0 w-80 bg-[#0A1A1A] rounded-lg overflow-hidden border border-[#0E282E] hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-[20px] h-[20px] text-[#0EC2BC] rounded-sm"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        boxShadow: "0 4px 12px rgba(0, 18, 18, 0.42)",
                        filter: "drop-shadow(0 4px 12px rgba(0, 18, 18, 0.42))",
                      }}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-montserrat-alt text-lg font-normal line-clamp-2">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes continuous-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  )
}
