import { SpanBadge } from "@/components/span-badge"
import { KidsAscensionTicker } from "@/components/kids-ascension-ticker"
import { PrimaryButton } from "@/components/primary-button"

export function KidsAscensionPromo() {
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
              <PrimaryButton>Zu Kids Ascension</PrimaryButton>
            </div>
          </div>

          {/* Right side - Ticker */}
          <div>
            <KidsAscensionTicker />
          </div>
        </div>
      </div>
    </section>
  )
}
