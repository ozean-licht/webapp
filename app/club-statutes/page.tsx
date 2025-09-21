"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanDesign from "@/components/span-design"

export default function ClubStatutesPage() {
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
              Unsere Statuten
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
              Vereinsstatuten
            </h2>

            <div className="space-y-4">
              <p className="text-muted-foreground body-m leading-relaxed">
                Der vollständige Text der Vereinsstatuten steht Ihnen hier zum Download zur Verfügung:
              </p>

              <div className="flex justify-center">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
                  Download
                </button>
              </div>
            </div>
          </section>

          {/* Wesentliche Auszüge */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Wesentliche Auszüge aus den Statuten
            </h2>

            <div className="space-y-8">
              {/* § 1: Name, Sitz und Tätigkeitsbereich */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">§ 1: Name, Sitz und Tätigkeitsbereich</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Der Verein führt den Namen "Ozean Licht Akademie – Bildungsverein für Kosmisches Bewusstsein, Multidimensionale Spiritualität im Einklang mit der universellen Weisheit" und hat seinen Sitz in Wilhelmsburg. Seine Tätigkeit erstreckt sich auf Österreich und kann bei Bedarf auf beliebige andere Länder ausgedehnt werden.
                </p>
              </div>

              {/* § 2: Zweck */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">§ 2: Zweck</h3>
                <p className="text-muted-foreground body-m leading-relaxed mb-4">
                  Der Verein ist nicht auf Gewinn ausgerichtet und verfolgt folgende begünstigte und mildtätige Zwecke:
                </p>
                <ul className="text-muted-foreground body-m leading-relaxed space-y-2 ml-6">
                  <li>• Kosmische Bildung und spirituelles Bewusstsein für alle Altersgruppen</li>
                  <li>• Förderung der pragmatischen Selbsthilfe</li>
                  <li>• Volksbildung im spirituellen Bereich</li>
                  <li>• Gemeinschaft und spirituelle Vernetzung für Jung und Alt</li>
                  <li>• Mildtätigkeit und Unterstützung von Bedürftigen</li>
                </ul>
              </div>

              {/* § 5: Mitgliedschaft */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">§ 5: Mitgliedschaft</h3>
                <p className="text-muted-foreground body-m leading-relaxed mb-4">
                  Die Mitglieder des Vereins gliedern sich in:
                </p>
                <ul className="text-muted-foreground body-m leading-relaxed space-y-2 ml-6">
                  <li>• Ordentliche Mitglieder</li>
                  <li>• Außerordentliche Mitglieder (Fördermitglieder und Ehrenmitglieder)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Vollständige Statuten Übersicht */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Vollständige Vereinsstatuten
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Für die vollständigen Vereinsstatuten mit allen Details zu Mitgliedschaft, Organisation, Beitragshöhe, Rechten und Pflichten sowie dem genauen Ablauf der Vereinsführung laden Sie bitte das vollständige Dokument herunter.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Vereinsstatuten regeln alle wichtigen Aspekte des Vereinslebens und stellen sicher, dass alle Mitglieder fair und transparent behandelt werden. Sie bilden die rechtliche Grundlage für alle Aktivitäten der Ozean Licht Akademie.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 text-lg">
                  Vollständige Statuten herunterladen
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
