"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanDesign from "@/components/span-design"

export default function ImprintPage() {
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
            Impressum
          </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Angaben gemäß §5 TMG - Transparente Informationen über Ozean Licht Akademie
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Verantwortliche Stelle Section */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Verantwortliche Stelle
            </h2>

            <div className="space-y-8">
              {/* Vereinsinformationen */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vereinsinformationen</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Ozean Licht Akademie - Bildungsverein für Kosmisches Bewusstsein, Multidimensionale Spiritualität und Selbstentfaltung im Einklang mit der universellen Weisheit
                </p>
              </div>

              {/* Vereinssitz */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vereinssitz</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Lilienfelderstraße 54/2/1<br />
                  3150 Wilhelmsburg<br />
                  Österreich
                </p>
              </div>

              {/* Kontakt */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Kontakt</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  E-Mail: info@ozean-licht.com
                </p>
              </div>

              {/* Vereinsregisterdaten */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vereinsregisterdaten</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  ZVR-Zahl: 1231052962<br />
                  Zuständige Behörde: Bezirkshauptmannschaft St.Pölten
                </p>
              </div>

              {/* Vertretungsbefugte Personen */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vertretungsbefugte Personen</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Präsidentin: Julia Lohmann<br />
                  Vizepräsident: Nemanja Stojakovic
                </p>
              </div>

              {/* Vereinszweck */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Vereinszweck</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Der Verein Ozean Licht Akademie – Bildungsverein für Kosmisches Bewusstsein und Selbstentfaltung verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Vereinsgesetzes. Alle Tätigkeiten dienen der Förderung von Bildung, Bewusstsein und Spiritualität. Der Verein ist nicht gewinnorientiert.
                </p>
              </div>

              {/* Hinweis auf Gemeinnützigkeit */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Hinweis auf Gemeinnützigkeit</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Dieser Verein ist gemäß § 35 BAO als gemeinnützig anerkannt.
                </p>
              </div>

              {/* Streitschlichtung */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Streitschlichtung</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Streitigkeiten aus dem Vereinsverhältnis werden durch das vereinsinterne Schiedsgericht gemäß §16 der Vereinsstatuten behandelt.
                </p>
              </div>

              {/* EU-Streitschlichtung */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Hinweis zur EU-Streitschlichtung</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    className="text-primary hover:text-primary/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
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
