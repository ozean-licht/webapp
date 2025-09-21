import Link from "next/link"
import { SpanBadge } from "@/components/span-badge"
import { Ticker } from "@/components/ticker"
import { PrimaryButton } from "@/components/primary-button"

export function KidsAscensionPromo() {
  // Images for upper ticker (promo-1, promo-2, promo-5)
  const upperImages = [
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-1.webp",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-2.webp",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-5.webp",
  ]

  // Images for lower ticker (promo-3, promo-4, promo-6)
  const lowerImages = [
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-3.webp",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-4.webp",
    "https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/kids-ascension/promo-preview/promo-6.webp",
  ]

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            {/* Removed the highest span-badge "Non-Profit Projekt" */}

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel text-white text-balance">Kids AscensioN</h2>

            <p className="text-white/70 font-montserrat-alt text-lg">
              Entdecke, wie wir allen Kindern helfen, ihr volles Potenzial zu entfalten und ihr inneres Licht zum
              Leuchten zu bringen.
            </p>

            <div className="flex flex-wrap gap-3 flex-col items-start">
              <SpanBadge icon="star" text="Ganzheitliche Entwicklung" />
              <SpanBadge icon="magicwand" text="Spirituelle & Magische Schule" />
              <SpanBadge icon="lightbulb" text="Kreative Entfaltung" />
            </div>

            <div className="pt-4">
              <Link href="https://kids-ascension.org" target="_blank" rel="noopener noreferrer">
                <PrimaryButton>Zu Kids Ascension →</PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Right side - Two separate tickers */}
          <div className="w-full">
            <div
              className="w-full overflow-hidden space-y-2 rounded-[10%] border border-[#0E282E] border-border"
              style={{ backgroundColor: "#00151A", padding: "16px 2px" }}
            >
              {/* Upper ticker - moving right (extra-slow - 30% slower than slow) */}
              <div className="py-2">
                <Ticker
                  images={upperImages}
                  direction="right"
                  speed="extra-slow"
                  imageAlt="Kids Ascension Upper"
                />
              </div>

              {/* Lower ticker - moving left (very slow - 20% slower than base slow) */}
              <div className="py-2">
                <Ticker
                  images={lowerImages}
                  direction="left"
                  speed="slow"
                  imageAlt="Kids Ascension Lower"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
