import { SpanDesign } from "./span-design"
import { FaqItem } from "./faq-item"

const faqData = [
  {
    question: "Was ist anders in Ozean Licht?",
    answer:
      "Ozean Licht bietet eine einzigartige Kombination aus spiritueller Weisheit und praktischen Techniken, die speziell darauf ausgelegt sind, deine Seele zu nähren und dein Bewusstsein zu erweitern.",
  },
  {
    question: "Was machen die Kurse so einzigartig?",
    answer:
      "Unsere Kurse verbinden alte Weisheitstraditionen mit modernen Erkenntnissen und bieten dir eine transformative Reise zu deinem wahren Selbst durch personalisierte Begleitung und kraftvolle Energiearbeit.",
  },
  {
    question: "Was muss ich beachten wenn ich einen Kurs bei dir besuche?",
    answer:
      "Bringe eine offene Herzenshaltung mit und sei bereit für Veränderung. Alles andere lernst du während des Kurses. Keine Vorerfahrung nötig - nur die Bereitschaft, dich auf deine spirituelle Reise einzulassen.",
  },
  {
    question: "Was muss ich während dem Kurs tun?",
    answer:
      "Folge den angeleiteten Meditationen, nimm an den Energieübungen teil und erlaube dir, vollständig präsent zu sein. Jeder Schritt wird liebevoll begleitet und an dein individuelles Tempo angepasst.",
  },
  {
    question: "Bietest du auch private Sitzungen an?",
    answer:
      "Ja, ich biete individuelle Sessions für persönliche Heilung und spirituelle Beratung an. Diese können sowohl online als auch vor Ort stattfinden, je nach deinen Bedürfnissen und Wünschen.",
  },
  {
    question: "Sind meine Kurse für jeden geeignet?",
    answer:
      "Meine Kurse sind für alle Menschen gedacht, die bereit sind, ihr Bewusstsein zu erweitern und ihre spirituelle Reise zu vertiefen - unabhängig von Vorerfahrung oder spirituellem Hintergrund.",
  },
]

export function QuickFaq() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <SpanDesign>FAQ</SpanDesign>
          <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-6 mt-6">Hier Ein Paar Antworten</h2>
          <p className="text-gray-300 font-montserrat-alt text-lg max-w-3xl mx-auto leading-relaxed">
            Du bist neu hier in meiner Energie und ich möchte dir ein helfen ein paar Fragen vorab zu beantworten,
            sodass du schnell deinen Weg findest der für dich stimmig ist.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickFaq
