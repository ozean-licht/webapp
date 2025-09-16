"use client"

export function KidsAscensionTicker() {
  const images = Array(6).fill(
    "https://framerusercontent.com/images/LAF8aaIuGc1A1R1GwtVzeomvyvM.webp?scale-down-to=1024&width=1920&height=1080",
  )

  return (
    <div
      className="w-full overflow-hidden space-y-4 p-4 rounded-[10%] border border-[#0E282E] border-border"
      style={{ backgroundColor: "#00151A" }}
    >
      {/* First ticker - moving right */}
      <div className="flex animate-scroll-right">
        {images.slice(0, 3).map((src, index) => (
          <div key={`right-${index}`} className="flex-shrink-0 w-64 h-40 mx-2">
            <div className="w-full h-full p-2 rounded-xl border-border border" style={{ backgroundColor: "#00151A" }}>
              <img
                src={src || "/placeholder.svg"}
                alt={`Kids ascension ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {images.slice(0, 3).map((src, index) => (
          <div key={`right-dup-${index}`} className="flex-shrink-0 w-64 h-40 mx-2">
            <div className="w-full h-full p-2 rounded-xl" style={{ backgroundColor: "#00151A" }}>
              <img
                src={src || "/placeholder.svg"}
                alt={`Kids ascension ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Second ticker - moving left */}
      <div className="flex animate-scroll-left">
        {images.slice(3, 6).map((src, index) => (
          <div key={`left-${index}`} className="flex-shrink-0 w-64 h-40 mx-2">
            <div className="w-full h-full p-2 rounded-xl border border-border" style={{ backgroundColor: "#00151A" }}>
              <img
                src={src || "/placeholder.svg"}
                alt={`Kids ascension ${index + 4}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {images.slice(3, 6).map((src, index) => (
          <div key={`left-dup-${index}`} className="flex-shrink-0 w-64 h-40 mx-2">
            <div className="w-full h-full p-2 rounded-xl" style={{ backgroundColor: "#00151A" }}>
              <img
                src={src || "/placeholder.svg"}
                alt={`Kids ascension ${index + 4}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
