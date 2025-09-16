import { SpanBadge } from "./span-badge"
import { PrimaryButton } from "./primary-button"

export function BookPromo() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Book Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Kosmische_Codes.png"
                alt="Kosmische Codes Buch von Lia Lohmann"
                className="w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <SpanBadge icon="sparkle" text="Alles, was du nie wissen solltest" />

            <h2 className="font-cinzel text-4xl md:text-5xl text-white leading-tight">Kosmische Codes</h2>

            <p className="text-gray-300 font-montserrat-alt text-lg leading-relaxed">
              Das ist nicht nur ein Buch ... und dieses Wissen sollte niemals geteilt werden. Ursprünglich durften die
              Menschen niemals davon erfahren, denn dieses Buch trägt Wissen in sich, das dich ein für alle Mal aus dem
              Tiefschlaf erweckt und dir deine Kraft zurückgibt.
            </p>

            <div className="space-y-4">
              <PrimaryButton>Auf Amazon Bestellen</PrimaryButton>
              <p className="text-gray-400 font-montserrat-alt text-sm">
                Oder{" "}
                <a
                  href="https://www.amazon.de/Interstellar-Insights-Supposed-Understanding-Universe/dp/B0DCJJCGY6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  Englische Version bestellen
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookPromo
