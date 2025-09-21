"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanDesign from "@/components/span-design"

export default function PrivacyPolicyPage() {
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
              Datenschutzerklärung
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Dein Vertrauen ist uns wichtig. Mit dieser Datenschutzerklärung möchten wir dir transparent und verständlich darlegen, wie wir mit deinen persönlichen Daten umgehen.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Datenschutz auf einen Blick */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              1. Datenschutz auf einen Blick
            </h2>

            <div className="space-y-8">
              {/* Allgemeine Hinweise */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Allgemeine Hinweise</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                </p>
              </div>
            </div>
          </section>

          {/* Datenerfassung auf dem Vereinsportal */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Datenerfassung auf dem Vereinsportal
            </h2>

            <div className="space-y-8">
              {/* Wer ist verantwortlich */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Wer ist verantwortlich für die Datenerfassung auf dieser Vereinsplattform?</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Datenverarbeitung auf dieser Vereinsplattform erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
                </p>
              </div>

              {/* Wie erfassen wir Ihre Daten */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Wie erfassen wir Ihre Daten?</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>
              </div>

              {/* Wofür nutzen wir Ihre Daten */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Wofür nutzen wir Ihre Daten?</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                </p>
              </div>

              {/* Welche Rechte haben Sie bezüglich Ihrer Daten */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                </p>
              </div>
            </div>
          </section>

          {/* Ablefy Section */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Ablefy
            </h2>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Auf dieser Website bieten wir unter anderem digitale Waren und Dienstleistungen zum Kauf an. Für den Verkauf dieser Produkte auf unserer Website nutzen wir elopage. Anbieter ist die elopage GmbH, Kurfürstendamm 208, 10719 Berlin, Deutschland (nachfolgend ablefy).
                </p>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Wenn Sie auf eines unserer Produkte klicken, werden Sie zu unserer Verkaufsseite auf ablefy weitergeleitet. Die Vertragsabwicklung erfolgt anschließend über ablefy. Details entnehmen Sie der Datenschutzerklärung von ablefy unter: <a href="https://elopage.com/privacy?locale=de" className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">https://elopage.com/privacy?locale=de</a>.
                </p>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Verwendung von ablefy erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an der Nutzung einer schnellen und professionellen Verkaufsseite zum Vertrieb unserer Produkte. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
                </p>
              </div>

              {/* Auftragsverarbeitung */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Auftragsverarbeitung</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
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
