import { FooterNav } from "./footer-nav"
import { LegalNav } from "./legal-nav"

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-[#0E282E] py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Logo and Main Text Section */}
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <img
              src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Akadmie%20Komprimiert.png"
              alt="Ozean Licht Logo"
              className="h-24 w-auto"
            />
          </div>

          <p className="text-lg leading-relaxed max-w-3xl mx-auto font-light text-slate-300">
            Wir verankern kosmisches Wissen und Weisheit, unterstützen dich dabei dein volles Potenzial und deine
            Meisterschaft zu verkörpern. Lass uns deine Welt mit dem Licht deines Herzens erfüllen ♥
          </p>
        </div>

        {/* Navigation Section */}
        <div className="mt-16 mb-12">
          <FooterNav />
        </div>

        {/* Legal Navigation */}
        <LegalNav />

        {/* Disclaimer Section */}
        <div className="border-t border-[#0E282E] pt-8 mt-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm leading-relaxed max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> Unsere Events stellen keinen Ersatz für professionelle medizinische,
              psychologische oder rechtliche Beratung dar. Alle Inhalte unserer Webseite, Events und öffentlichen Kanäle
              unterliegen dem Urheberrecht. Deren Weitergabe oder Verwendung in jeglicher Form ist ohne Genehmigung
              nicht erlaubt und kann strafrechtliche Folgen haben.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
