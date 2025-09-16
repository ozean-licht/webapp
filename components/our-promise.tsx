import { SpanDesign } from "@/components/span-design"
import { InfoCard } from "@/components/info-card"

export function OurPromise() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <SpanDesign>Dein Weg mit mir</SpanDesign>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground text-balance">
            Mein Versprechen an dich
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty leading-relaxed text-slate-300 font-light">
            Wir begleiten dich auf deinem Weg zu mehr Selbstvertrauen und innerer Stärke. Mit individuellen
            Coaching-Ansätzen und einer unterstützenden Community findest du zu deiner wahren Kraft und lebst das Leben,
            das du dir wirklich wünschst.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 justify-items-center max-w-4xl mx-auto">
          <InfoCard
            heading="Persönliche Begleitung"
            paragraph="Individuelle Coaching-Sessions, die auf deine einzigartigen Bedürfnisse und Ziele abgestimmt sind. Gemeinsam finden wir deinen Weg zu mehr Selbstvertrauen und innerer Stärke."
          />
          <InfoCard
            heading="Ganzheitlicher Ansatz"
            paragraph="Körper, Geist und Seele im Einklang. Wir arbeiten mit bewährten Methoden, die dich auf allen Ebenen stärken und zu nachhaltiger Transformation führen."
          />
          <InfoCard
            heading="Sichere Atmosphäre"
            paragraph="Ein geschützter Raum, in dem du dich öffnen und wachsen kannst. Hier findest du Verständnis, Akzeptanz und die Unterstützung, die du brauchst."
          />
          <InfoCard
            heading="Nachhaltige Veränderung"
            paragraph="Langfristige Erfolge durch tiefgreifende Arbeit an deinen Mustern und Überzeugungen. Wir schaffen gemeinsam eine solide Basis für dein neues Leben."
          />
          <InfoCard
            heading="Community & Support"
            paragraph="Teil einer unterstützenden Gemeinschaft werden. Tausche dich mit Gleichgesinnten aus und erfahre, dass du nicht allein auf deinem Weg bist."
          />
          <InfoCard
            heading="Authentisches Wachstum"
            paragraph="Entdecke deine wahre Essenz und lebe authentisch. Wir helfen dir dabei, deine Einzigartigkeit zu erkennen und selbstbewusst zu leben."
          />
        </div>
      </div>
    </section>
  )
}
