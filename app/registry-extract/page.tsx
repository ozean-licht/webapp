"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanDesign from "@/components/span-design"

export default function RegistryExtractPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <SpanDesign>Transparent & Offen</SpanDesign>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance mb-6">
              Vereinsregister
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Ozean Licht Akademie - Bildungsverein für Kosmisches Bewusstsein, Multidimensionale Spiritualität und Selbstentfaltung im Einklang mit der universellen Weisheit
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Stand: Oktober 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Download Section */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Vollständiger Registerauszug
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Hier können Sie den vollständigen Registerauszug des Vereins herunterladen. Dieser enthält alle offiziellen Angaben zur Rechtsform, Vertretungsbefugnis und aktuellen Eintragungen im Vereinsregister.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Der Registerauszug dient der Transparenz und Nachvollziehbarkeit unserer Vereinsstruktur und bestätigt unsere ordnungsgemäße Registrierung als gemeinnütziger Verein.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 text-lg">
                  Vollständigen Registerauszug herunterladen
                </button>
              </div>
            </div>
          </section>

          {/* Registry Information */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Vereinsregister-Informationen
            </h2>

            <div className="space-y-8">
              {/* Grunddaten */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Grunddaten des Vereins</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Vereinsname</p>
                    <p className="text-foreground body-m">
                      Ozean Licht Akademie - Bildungsverein für Kosmisches Bewusstsein, Multidimensionale Spiritualität und Selbstentfaltung im Einklang mit der universellen Weisheit
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">ZVR-Zahl</p>
                    <p className="text-foreground body-m">1231052962</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Sitz</p>
                    <p className="text-foreground body-m">Wilhelmsburg, Österreich</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Registergericht</p>
                    <p className="text-foreground body-m">Bezirkshauptmannschaft St.Pölten</p>
                  </div>
                </div>
              </div>

              {/* Vertretungsbefugte Personen */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vertretungsbefugte Personen</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Julia Lohmann</p>
                      <p className="text-muted-foreground text-sm">Präsidentin</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Nemanja Stojakovic</p>
                      <p className="text-muted-foreground text-sm">Vizepräsident</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rechtliche Informationen */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Rechtliche Informationen</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-muted-foreground body-m leading-relaxed">
                      <span className="text-primary font-medium">Gemeinnützigkeit:</span> Der Verein ist gemäß § 35 BAO als gemeinnützig anerkannt und verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke.
                    </p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-muted-foreground body-m leading-relaxed">
                      <span className="text-primary font-medium">Vereinszweck:</span> Förderung von Bildung, Bewusstsein und Spiritualität im Einklang mit der universellen Weisheit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transparency Notice */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Transparenz und Nachvollziehbarkeit
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Als gemeinnütziger Verein legen wir größten Wert auf Transparenz und Nachvollziehbarkeit unserer Strukturen und Aktivitäten. Der Registerauszug bestätigt unsere ordnungsgemäße Registrierung und ermöglicht es Interessierten, unsere Vereinsstruktur zu überprüfen.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Bereitstellung dieser Informationen dient der Vertrauensbildung und zeigt unser Bekenntnis zu transparenter Kommunikation mit allen Stakeholdern.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-primary font-medium text-center">
                  💡 Bei Fragen zum Registerauszug oder unserer Vereinsstruktur stehen wir Ihnen gerne zur Verfügung.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
