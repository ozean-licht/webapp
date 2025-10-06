import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InfoCardWithButton } from "@/components/info-card"
import { SpanDesign } from "@/components/span-design"
import { FaqItem } from "@/components/faq-item"
import { CTA1 } from "@/components/cta-1"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <SpanDesign>Kontakt</SpanDesign>
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white mb-8">
            Kontaktiere Uns
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Nimm Kontakt zu Uns auf und lass uns zusammen dein inneres Licht zum Strahlen bringen - wir sind für dich da.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <InfoCardWithButton
              heading=""
              paragraph="Benötigst du Hilfe und / oder Informationen zu unseren Kursen?"
              buttonText="Schreibe eine Mail"
              buttonHref="mailto:info@ozean-licht.com"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <InfoCardWithButton
              heading=""
              paragraph="Fühl dich frei uns auf Instagram zu schreiben. Wir sind auch dort aktiv."
              buttonText="@ozean_licht"
              buttonHref="https://instagram.com/ozean_licht"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 4.5c0 1.38-1.12 2.5-2.5 2.5S11 5.88 11 4.5 12.12 2 13.5 2 16 3.12 16 4.5zM9 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm8 0c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-6 6c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                </svg>
              }
            />
            <InfoCardWithButton
              heading=""
              paragraph="Trete unserer Gruppe auf Telegram bei. Hier klicken und mitmachen."
              buttonText="t.me/lialohmann"
              buttonHref="https://t.me/lialohmann"
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#001212]/60 border border-[#0E282E] rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-cinzel-decorative text-white mb-4">
                Formular Senden
              </h2>
              <p className="text-muted-foreground">
                Hast du ein wichtiges Anliegen? Dann melde dich über dieses Formular. Um Feedback zu senden klick bitte hier.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Vorname"
                    className="w-full px-4 py-3 bg-background border border-[#0E282E] rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nachname"
                    className="w-full px-4 py-3 bg-background border border-[#0E282E] rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-background border border-[#0E282E] rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <select className="w-full px-4 py-3 bg-background border border-[#0E282E] rounded-lg text-white focus:outline-none focus:border-primary transition-colors">
                  <option value="">Wähle bitte eines der folgenden Kategorien...</option>
                  <option value="bestellung">Bestellung</option>
                  <option value="anfrage">Allgemeine Anfrage</option>
                  <option value="ablefy">Fragen zu Ablefy</option>
                  <option value="bewerbung">Bewerbung</option>
                  <option value="content">Content Wünsche</option>
                  <option value="kids">Kids Ascension</option>
                  <option value="spenden">Spenden</option>
                  <option value="stornierung">Stornierung</option>
                  <option value="widerruf">Widerruf</option>
                  <option value="ko-kreationen">Ko-Kreationen</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Nachricht"
                  className="w-full px-4 py-3 bg-background border border-[#0E282E] rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="privacy" className="mt-1" />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    *Ich habe die Datenschutzerklärung gelesen und erkläre mich damit einverstanden.
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="newsletter" className="mt-1" />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                    Ich erkläre mich einverstanden, Angebote und Neuigkeiten per E-Mail zu erhalten.
                  </label>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary hover:bg-[#0FA8A3] text-white font-medium text-lg py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Senden
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6">
              <SpanDesign>Häufige Fragen</SpanDesign>
            </div>
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-white mb-6">
              Du hast Fragen? Wir haben Antworten.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hier findest du Antworten auf die häufigsten Fragen zu unseren Kursen und Dienstleistungen.
            </p>
          </div>

          <div className="space-y-4">
            <FaqItem
              question="Wie kann ich mich für einen Kurs anmelden?"
              answer="Du kannst dich ganz einfach über unsere Website anmelden. Wähle den gewünschten Kurs aus, klicke auf 'Kurs öffnen' und folge den Anweisungen zur Registrierung und Zahlung."
            />
            <FaqItem
              question="Bieten Sie auch persönliche Beratungsgespräche an?"
              answer="Ja, wir bieten persönliche Beratungsgespräche an. Du kannst uns über das Kontaktformular erreichen oder direkt per E-Mail kontaktieren. Wir melden uns innerhalb von 24 Stunden bei dir."
            />
            <FaqItem
              question="Gibt es eine Rückerstattungspolitik?"
              answer="Wir bieten eine 14-tägige Rückerstattungsgarantie für alle unsere Kurse. Wenn du nicht zufrieden bist, kontaktiere uns einfach und wir erstatten dir den vollen Betrag zurück."
            />
            <FaqItem
              question="Sind die Kurse auch auf Deutsch verfügbar?"
              answer="Ja, alle unsere Kurse sind sowohl auf Deutsch als auch auf Englisch verfügbar. Du kannst in deinem Profil die gewünschte Sprache auswählen."
            />
            <FaqItem
              question="Wie lange habe ich Zugriff auf die Kursmaterialien?"
              answer="Du hast lebenslangen Zugriff auf alle Kursmaterialien. Du kannst die Lektionen in deinem eigenen Tempo durcharbeiten und jederzeit darauf zugreifen."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="flex justify-center">
          <CTA1 />
        </div>
      </section>

      <Footer />
    </div>
  )
}
