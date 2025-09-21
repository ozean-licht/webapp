"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanDesign from "@/components/span-design"

export default function UserRulesPage() {
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
              Teilnahmebedingungen
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Mit unserer Vereinsordnung möchten wir einen klaren und vertrauensvollen Rahmen für unsere Mitglieder schaffen.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Inhaltsverzeichnis */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Inhaltsverzeichnis
            </h2>

            <ol className="text-muted-foreground body-m leading-relaxed space-y-2">
              <li>1. Anwendungsbereich der Teilnahmebedingungen</li>
              <li>2. Beitritt und Anmeldung zu Vereinsangeboten</li>
              <li>3. Rücktrittsrecht und Stornierungsbedingungen</li>
              <li>4. Teilnahmegebühren und Beitragsregelungen</li>
              <li>5. Bereitstellung von Bildungsmaterialien</li>
              <li>6. Nutzungsrechte an Vereinsmaterialien</li>
              <li>7. Qualitätssicherung der Bildungsangebote</li>
              <li>8. Nutzung von Fördergutscheinen</li>
              <li>9. Verwendung von Teilnahmegutscheinen</li>
              <li>10. Rechtliche Grundlagen</li>
              <li>11. Schlichtungsverfahren im Vereinskontext</li>
              <li>12. Vereinsmitgliedschaft und Bildungsangebote</li>
            </ol>
          </section>

          {/* 1) Anwendungsbereich der Teilnahmebedingungen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              1. Anwendungsbereich der Teilnahmebedingungen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Diese Teilnahmebedingungen des Vereins "Ozean Licht Akademie - Bildungsverein für Kosmisches Bewusstsein, Multidimensionale Spiritualität und Selbstentfaltung im Einklang mit der universellen Weisheit" (ZVR-Zahl: 1231052962), mit Sitz in Lilienfelderstraße 54/2/1, 3150 Wilhelmsburg, Österreich (nachfolgend "Verein"), gelten für alle Vereinbarungen über die Teilnahme an Bildungsangeboten und die Bereitstellung von Bildungsmaterialien, die eine natürliche Person (nachfolgend "Teilnehmer" oder "Mitglied") mit dem Verein hinsichtlich der auf der Vereinsplattform dargestellten Bildungsangebote und Lernmaterialien eingeht.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Für die Bereitstellung von Teilnahmegutscheinen gelten diese Teilnahmebedingungen entsprechend, sofern insoweit nicht ausdrücklich etwas Abweichendes geregelt ist.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Mit der Anmeldung zu einem Bildungsangebot oder dem Erwerb von Lernmaterialien wird der Teilnehmer für die Dauer des jeweiligen Angebots automatisch außerordentliches Mitglied des Vereins, sofern er nicht bereits Mitglied ist. Die Teilnahmebedingungen gelten für alle Personen, unabhängig davon, ob sie zu privaten oder beruflichen Zwecken am Bildungsangebot teilnehmen.
                </p>
              </div>
            </div>
          </section>

          {/* 2) Beitritt und Anmeldung zu Vereinsangeboten */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              2. Beitritt und Anmeldung zu Vereinsangeboten
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die auf der Vereinsplattform dargestellten Bildungsangebote und Materialien stellen keine verbindlichen Angebote seitens des Vereins dar, sondern dienen zur Abgabe eines verbindlichen Angebots durch das (potenzielle) Mitglied.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Das (potenzielle) Mitglied kann das Angebot über das in die Vereinsplattform integrierte Online-Anmeldeformular abgeben. Dabei gibt das (potenzielle) Mitglied, nachdem es die ausgewählten Bildungsangebote in die Auswahl gelegt und den elektronischen Anmeldeprozess durchlaufen hat, durch Klicken des den Anmeldeprozess abschließenden Buttons ein rechtlich verbindliches Angebot zur Teilnahme an den ausgewählten Bildungsangeboten ab. Ferner kann das (potenzielle) Mitglied das Angebot auch telefonisch oder per E-Mail gegenüber dem Verein abgeben.
                </p>
              </div>
            </div>
          </section>

          {/* 3) Rücktrittsrecht und Stornierungsbedingungen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              3. Rücktrittsrecht und Stornierungsbedingungen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Der Teilnehmer hat das Recht, bis zu 14 Tage nach Vertragsschluss vom Vertrag zurückzutreten, wenn er Verbraucher im Sinne des KSchG ist. Die Rücktrittserklärung hat schriftlich zu erfolgen und ist an die im Impressum angeführte Adresse des Vereins zu richten.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Nach Ablauf der 14-tägigen Rücktrittsfrist ist ein Rücktritt nur aus wichtigen Gründen möglich. Als wichtige Gründe gelten insbesondere Krankheit, Unfall oder andere unvorhersehbare Ereignisse, die eine Teilnahme unmöglich machen. Der Verein behält sich vor, in diesen Fällen eine Bearbeitungsgebühr in Höhe von 10% des Teilnahmebeitrags einzubehalten.
                </p>
              </div>
            </div>
          </section>

          {/* 4) Teilnahmegebühren und Beitragsregelungen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              4. Teilnahmegebühren und Beitragsregelungen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Teilnahmegebühren für die einzelnen Bildungsangebote ergeben sich aus den auf der Vereinsplattform angegebenen Preisen. Diese beinhalten bereits die gesetzliche Mehrwertsteuer und die Fördermitgliedschaftsgebühr.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Zahlungen sind grundsätzlich im Voraus zu leisten. Bei Ratenzahlungen werden die vereinbarten Raten termingerecht fällig. Bei Zahlungsverzug behält sich der Verein vor, die Leistungen zu sperren.
                </p>
              </div>
            </div>
          </section>

          {/* 5) Bereitstellung von Bildungsmaterialien */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              5. Bereitstellung von Bildungsmaterialien
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Nach erfolgreicher Zahlung und Annahme des Angebots durch den Verein erhält der Teilnehmer Zugang zu den gebuchten Bildungsmaterialien über die Vereinsplattform. Der Zugang wird für die Dauer des gebuchten Angebots gewährt.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Alle Videos, Aufzeichnungen und Zugangsdaten sind Eigentum der Ozean Licht Akademie. Ein Teilen oder Weiterleiten der Zugangsdaten ist nicht gestattet und kann zum sofortigen Ausschluss führen.
                </p>
              </div>
            </div>
          </section>

          {/* 6) Nutzungsrechte an Vereinsmaterialien */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              6. Nutzungsrechte an Vereinsmaterialien
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die vom Verein bereitgestellten Materialien sind urheberrechtlich geschützt. Der Teilnehmer erhält ein einfaches, nicht übertragbares Nutzungsrecht für die persönliche Bildung und den privaten Gebrauch.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Eine kommerzielle Nutzung, Vervielfältigung oder Weitergabe der Materialien ist ohne ausdrückliche schriftliche Genehmigung des Vereins untersagt.
                </p>
              </div>
            </div>
          </section>

          {/* 7) Qualitätssicherung der Bildungsangebote */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              7. Qualitätssicherung der Bildungsangebote
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Der Verein verpflichtet sich zur kontinuierlichen Qualitätssicherung seiner Bildungsangebote. Alle Inhalte werden von qualifizierten Fachkräften erstellt und regelmäßig aktualisiert.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Bei berechtigten Qualitätsmängeln hat der Teilnehmer das Recht auf Nachbesserung oder, im Falle der Unmöglichkeit, auf Vertragsauflösung.
                </p>
              </div>
            </div>
          </section>

          {/* 8) Nutzung von Fördergutscheinen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              8. Nutzung von Fördergutscheinen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Fördergutscheine können für die teilweise oder vollständige Deckung der Teilnahmegebühren eingesetzt werden. Die genauen Bedingungen für die Einlösung ergeben sich aus dem jeweiligen Gutschein.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Fördergutscheine sind nicht übertragbar und können nur einmal eingelöst werden. Eine Barauszahlung ist ausgeschlossen.
                </p>
              </div>
            </div>
          </section>

          {/* 9) Verwendung von Teilnahmegutscheinen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              9. Verwendung von Teilnahmegutscheinen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Teilnahmegutscheine berechtigen zur Teilnahme an bestimmten Bildungsangeboten des Vereins. Die Gültigkeitsdauer und Nutzungsbedingungen sind auf dem Gutschein angegeben.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Bei Verlust oder Diebstahl von Gutscheinen übernimmt der Verein keine Haftung. Eine Ersatzleistung erfolgt nur bei Nachweis des Verlustes.
                </p>
              </div>
            </div>
          </section>

          {/* 10) Rechtliche Grundlagen */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              10. Rechtliche Grundlagen
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist der Sitz des Vereins, soweit gesetzlich zulässig.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Sollten einzelne Bestimmungen dieser Teilnahmebedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
              </div>
            </div>
          </section>

          {/* 11) Schlichtungsverfahren im Vereinskontext */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              11. Schlichtungsverfahren im Vereinskontext
            </h2>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Streitigkeiten aus diesen Teilnahmebedingungen werden nach Möglichkeit gütlich beigelegt. Bei Bedarf kann das vereinsinterne Schiedsgericht angerufen werden.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground body-m leading-relaxed">
                  Bei Verbraucherstreitigkeiten besteht die Möglichkeit der Online-Streitbeilegung über die Plattform der Europäischen Kommission.
                </p>
              </div>
            </div>
          </section>

          {/* 12) Vereinsmitgliedschaft und Bildungsangebote */}
          <section className="bg-[#00151a] backdrop-blur-sm border border-border rounded-lg p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              12. Vereinsmitgliedschaft und Bildungsangebote
            </h2>

            <div className="space-y-8">
              {/* Fördermitgliedschaft */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Fördermitgliedschaft</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Mit der Anmeldung zu einem Bildungsangebot oder dem Erwerb von Bildungsmaterialien des Vereins wird der Teilnehmer automatisch Fördermitglied des Vereins für die Dauer des jeweiligen Angebots, sofern er nicht bereits Mitglied ist.
                </p>
              </div>

              {/* Ordentliche Mitgliedschaft */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Ordentliche Mitgliedschaft</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Eine ordentliche Mitgliedschaft im Verein mit erweiterten Rechten und Pflichten kann durch gesonderten Antrag erworben werden. Ordentliche Mitglieder können an der Mitgliederversammlung teilnehmen und genießen Stimmrecht.
                </p>
              </div>

              {/* Beitragsregelungen */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-primary">Beitragsregelungen</h3>
                <p className="text-muted-foreground body-m leading-relaxed">
                  Die Höhe des Jahresmitgliedsbeitrags für ordentliche Mitglieder wird von der Mitgliederversammlung festgelegt und in der aktuellen Beitragsordnung des Vereins veröffentlicht.
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
