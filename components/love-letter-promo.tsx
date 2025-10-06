import Link from "next/link"
import { SpanBadge } from "@/components/span-badge"
import { PrimaryButton } from "@/components/primary-button"

export function LoveLetterPromo() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Static Image */}
          <div>
            <div className="p-2 rounded-xl border border-border" style={{ backgroundColor: "#00151A" }}>
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/love-letter-promo.webp"
                alt="Love Letter Promo"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            {/* Removed the highest span-badge "Kosmische Impluse" */}

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel-decorative text-white text-balance">Love Letter</h2>

            <p className="text-white/70 font-montserrat-alt text-lg">
              Möchtest du regelmäßig sanfte Wellen der Inspiration empfangen, die dein inneres Licht nähren? Unser Love
              Letter bringt dir Erkenntnisse, praktische Übungen und herzöffnende Gedanken direkt in deinen digitalen
              Raum – wie eine Botschaft aus der kosmischen Heimat.
            </p>

            <div className="flex flex-wrap gap-3 flex-col items-start">
              <SpanBadge icon="moon" text="Alle 3 Monde" />
              <SpanBadge icon="star" text="Community Beiträge" />
              <SpanBadge icon="heart" text="Love to Go" />
            </div>

            <div className="pt-4">
              <Link href="/love-letter">
                <PrimaryButton>Beitrag einreichen →</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
