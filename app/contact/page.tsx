import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-cinzel text-white mb-8">
            Kontakt
          </h1>

          <div className="text-lg text-[#C4C8D4] leading-relaxed space-y-6">
            <p>
              Haben Sie Fragen oder möchten Sie in Kontakt treten? Wir freuen uns auf Ihre Nachricht.
            </p>

            <p>
              Diese Kontaktseite wird in Kürze mit detaillierten Kontaktinformationen und einem Formular aktualisiert.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
