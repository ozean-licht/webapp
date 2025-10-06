import Link from "next/link"
import { PrimaryButton } from "./primary-button"
import { SpanBadge } from "./span-badge"
import { SpanDesign } from "./span-design"

export function PartnerDealPromo() {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <SpanDesign>Für deinen Seelenpartner</SpanDesign>
        </div>

        <h2 className="font-cinzel-decorative text-4xl md:text-5xl text-white mb-6">Partner Special Deal</h2>

        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          Du hast eine/n Partner/in mit dem du die Kurse teilen möchtest?
          <br />
          Dieses Angebot ist für euch!
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <SpanBadge icon="heart" text="Gemeinsam Wachsen" />
          <SpanBadge icon="users" text="Für Paare" />
          <SpanBadge icon="sparkles" text="Sonderpreis" />
        </div>

        <div className="mb-8">
          <div className="inline-block p-2 rounded-3xl border-2" style={{ backgroundColor: "#00151A", borderColor: "#052a2a" }}>
            <img
              src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/partner-deal-cover-komprimiert.webp"
              alt="Happy couple - Partner Special Deal"
              className="w-full max-w-[600px] h-auto rounded-2xl object-cover"
            />
          </div>
        </div>

        <Link href="/partner-deal">
          <PrimaryButton>Zum Partner Deal →</PrimaryButton>
        </Link>
      </div>
    </section>
  )
}
