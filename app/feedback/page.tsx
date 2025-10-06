import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import SpanBadge from "@/components/span-badge"
import { SpanDesign } from "@/components/span-design"
import PrimaryButton from "@/components/primary-button"
import TestimonialCard from "@/components/testimonial-card"
import FeedbackForm from "@/components/feedback-form"
import { CTA1 } from "@/components/cta-1"
import { LoveLetterPromo } from "@/components/love-letter-promo"
import { KidsAscensionPromo } from "@/components/kids-ascension-promo"
import { ArrowRight } from "lucide-react"

export default function FeedbackPage() {
  const testimonials = [
    {
      name: "Tanny",
      location: "Spanien",
      testimonial:
        "Danke liebe Lia, dass du mich erinnerst wer ich wirklich bin. Ich genieße jeden Kurs und jedes Channeling mit dir und deinem Team, die mich immer wieder auf eine neue Ebene bringen. Was ich durch dich erfahren durfte, ist was multidimensional bedeutet auf allen Ebenen. Selbst wenn ich mir Monate später die Kurse nochmal anhöre, erlebe ich es jedesmal neu und noch viel tiefer. Aber besonders berührt hast du mich im Herzen. Noch nie zuvor habe ich so eine schöne Herzöffnung erlebt wie bei dir. Ich danke dir und deinem wundervollen Team und freue mich auf weitere Tiefe und wundervolle Momente mit euch. Von Herzen",
    },
    {
      name: "Tina Malsy",
      location: "Deutschland",
      testimonial:
        "Der ET-Kontakt Kurs war ein Transformationsprozess für die ganze Familie! Die hohen Energien, die Lia über die gesamte Dauer des Seminars kanalisiert, sind deutlich spürbar und sie ist ein reiner, kraftvoller Kanal für Lichtenergien und Weisheiten aus höheren Dimensionen. Lia versteht es auf fantastische, liebevolle und sehr humorvolle Weise ihr grandioses, tiefgründiges Wissen über ETs und spirituelle Zusammenhänge weiterzugeben und die Teilnehmer im Herzen zu berühren. Vielen herzlichen Dank für Deine so wertvolle Arbeit im Dienste des Lichtes des Erwachens!",
    },
    {
      name: "Alexandra R.",
      location: "Frankfurt, Deutschland",
      testimonial:
        "Ich danke Dir aus gottes tiefsten Herzen für Dein Sein, für UNS, für mich, für ALLE! Jeshuas Channeling das du als Kanal, als Geschenk des Himmels, was du für mich und für viele Seelen noch sein wirst, kann niemals in Worten wiedergegeben werden! SEINE LIEBE hallt in mir nach...und ich zehre noch immer davon. Es hat mich förmlich mitgerissen! Du bist ein Kanal Gottes! Ich hoffe und bete, dass dein Wirken in noch so vielen Seelen Anklang finden wird und Gott schickt sie alle zu dir die deine Hilfe in Anspruch nehmen werden! ich bete für dich, dein Wirken und dein Sein. Gott segne Dich und deine Familie. In Liebe gegrüßt und von Herzen gesegnet.",
    },
    {
      name: "Julia Rahm",
      location: "Deutschland",
      testimonial:
        "Wow, was Lia bei mir bewirkt hat ist der absolute Wahnsinn. Von der Bewusstseinserweiterung angefangen bis zu telepathischen Bildern, elektronischen voice phaenomenen bis hin zur Bewusstwerdung meines galaktischen Ursprungs. Ich bin ihr so unendlich DANKBAR was sie mit mir innerhalb von 3 Wochen gemacht hat. Ich bin ein ganz anderer Mensch geworden. Ich bin so froh auf sie gestoßen zu sein. So ein toller und liebevoller Mensch. Vielen vielen Dank für alles. I ♡ you.",
    },
    {
      name: "Nicole",
      location: "Frankfurt, Deutschland",
      testimonial:
        "Ich habe bereits an mehreren Kursen und Einzelcoachings bei Lia teilgenommen. Sie ist super sympathisch, offen, liebevoll und findet immer die richtigen Worte! Lia beherrscht die Kunst des Channelns perfekt! In der Vergangenheit war ich bereits bei anderen Coaches, doch nach der Sitzung kamen mir manche Aussagen nicht stimmig vor, eher wie die Vermischung von der eigenen Meinung und etwas Gechanneltem. Dies ist bei Lia nicht der Fall!! Während des Vorgangs verlässt sie ihren Körper und Wesen aus höheren Dichten sprechen durch sie durch. Die Botschaften waren für mich bis jetzt immer total stimmig und kraftvoll. Außerdem kommt man durch die starken Heilenergien sehr schnell zu Klarheit, Lösungen und ins Tun. Vielen Dank für dein Wirken liebe Lia!",
    },
    {
      name: "Maria",
      location: "Berlin, Deutschland",
      testimonial:
        "Lia kennenzulernen, online und live stellt für mich ein ganz besonderen Punkt in diesem Leben dar. Das Live Event mit Lia and dem ich teilnehmen durfte brachte mich zurück in das Gefühl, das man als Kind fühlt, wo alles besonders ist, neu und magisch. Ich habe hier Seelenfamilie wiedergetroffen. Die Energien die ich durch das Wochenende erfuhr, haben so viel Bewusstsein und Wissen zurück gebracht, dass sogar Familie und Freunde die Veränderung in mir wahrnehmen konnten. Auch noch Tage nach dem Event schwingen die Energien und Lias Strahlen nach und bringen Entwicklungen und Aktivierungen. Eine tiefe Reise zurück zu mir selbst. Ich danke dir so sehr liebe Lia für deinen Service und deine Kraft. Von ganzem Herzen ❤️",
    },
    {
      name: "Regina H.",
      location: "Aschaffenburg",
      testimonial:
        "Die Energien sind der absolute Hammer!! Ich hab in 10 Min. Channeled Reading mehr Themen auflösen und bearbeiten können, als in den letzten zehn Jahren zusammen. Ich fühle mich unglaublich unterstützt und supported auf unbeschreibliche Weise. Selten habe ich so viel Energien in einer Sitzung gespürt.",
    },
    {
      name: "Ursula",
      location: "Deutschland",
      testimonial:
        "Lia hat mich mit ihrer wunderbaren natürlichen Art in höhere Sphären mitgenommen. Sie gab mir einen sehr interessanten Einblick in das Leben der ETs und hat mir einige sehr wertvollen Erkenntnisse zum Thema Bewusstsein, Unterbewusstsein, 3D, 5D Matrix etc. vermittelt. Ich würde sagen, mein Horizont hat sich enorm erweitert. Ich habe das Gefühl, als hätte eine Initiierung stattgefunden, die mir mein eigenes Potenzial, mein eigenes Wirken für mich selbst und für das Kollektiv offenbart hat. Obwohl ich schon viel theoretisch wusste, habe ich die Erkenntnis gespürt, wie mächtig wir Menschen sind und wie wir unser Leben selbst zum Guten gestalten können. Ich kann Lia nur empfehlen. Ich bin mir sicher, dass das nicht die letzte Begegnung mit ihr war. Ganz lieben Dank, liebe Lia..",
    },
    {
      name: "Gabriele",
      location: "Deutschland",
      testimonial:
        "Meine Reise mit Dir liebe Lia ist eine wunderbare Erfahrung, die ich nicht missen möchte. Kraftvolle Energien durfte ich beim Channeling spüren, neue Sichtweisen werden eröffnet, die Energien halten an und arbeiten weiter. Mit deiner liebevollen Energie und deinem Humor, ist es mir gelungen mich weiter zu entwickeln, Muster erkennen und transformieren, Blockaden lösen. Deine Ho'oponopono Meditation ist für mich eine ganz besonders stark transformierende Energie, ich durfte damit eine Situation lösen...",
    },
    {
      name: "Katrin A.",
      location: "Deutschland",
      testimonial:
        "Liebe Lia, von Herzen Danke für Deine Arbeit und dass du mir hilfst aus meinen Möglichkeiten Wirklichkeit werden zu lassen! Du hast eine ganz große Gabe und ich bewundere Dich für Deinen Mut sie einzusetzen! Danke für dein Sein und Wirken! Ich kann es kaum erwarten bis der 5D Masterkurs endlich anfängt!",
    },
    {
      name: "Franziska",
      location: "Deutschland",
      testimonial:
        "Liebe Lia, ich möchte mich von Herzen bei dir und dem Rat Acturus bedanken für die wundervolle Zeit, die wir gemeinsam zum Vollmondevent gestern verbringen durften. Es war das erste Mal, dass ich dich und dein galaktisches Team sowie ein Channeling LIVE erleben durfte und es war nochmal sooo viel intensiver und kraftvoller, als ich es erwartet habe. Es hat alles übertroffen und mich um Welten in meinem Ascensionprozess nach vorne gebracht. Dafür tausend Dank! Es hat sich sooo gelohnt dabei gewesen zu sein ♥.",
    },
    {
      name: "Johannes D.",
      location: "Deutschland",
      testimonial:
        "Auf meiner Reise der Selbsterkenntnis und des Erwachens habe ich mit vielen internationalen, wundervollen spirituellen Lehrern und Lehrerinnen zusammen gearbeitet, unzählige Meditationen, Aktivierungen und diverse Techniken erlernt, jedes Channelling, was ich fand, aufgesaugt, mich mit Quantenphysik und der Natur der Realität auseinander gesetzt. Bis ich Lia entdeckt habe. Vom ersten Moment an spürte ich Lias Energie, Liebe und Freude, Ihr tiefes Wissen über unser Universum und Ihre Mission die Verbindung zu den höheren Räumen mit uns zu teilen und uns Menschen das Geschenk der eigenen Stärke und Liebe zu offenbaren. Die Arbeit mit Lia ist von enormen Mitgefühl und Weisheit geprägt. Sie sieht unser Potential, unseren wahren Kern und hat mir immer den Raum zugestanden ich zu sein auf meinem Weg. Auch wenn es mir mal nicht gut ging, war Sie mit einem offenen Ohr, ohne Urteil und bedingungsloser Liebe für mich da. Es gibt im deutschsprachigen Raum keine vergleichbare Person und nur ganz wenige international, die solche high level Informationen, Bewusstseinsarbeit und Herzöffnung anbieten. Seit ich mit Lia zusammenarbeite habe ich tiefe Wunden heilen können, habe mich noch mehr mit meinen galaktischen Familie verbunden und bin ein friedvoller, liebender, mutiger und vor allem ein freudvoller Mensch geworden. Durch Lia habe ich erkannt und fühle die Wahrheit, dass ich ein Engel bin, dass wir alle Engel sind. Für dieses Geschenk Danke ich Dir zutiefst aus der Essenz meines Seins. Liebe und Licht für Dich.",
    },
    {
      name: "Stina",
      location: "Deutschland",
      testimonial:
        "Empfehlung auf voller Linie! Lia hat mir in einer schweren Zeit sehr geholfen. Ich habe durch sie viel über mich selbst gelernt & viel an mir arbeiten können. Nach jedem Coaching-Unterricht, Transformationssitzung und Licht Seminar hat sich viel in meinem Leben zum Positiven geändert. Ich bin so unsagbar froh & dankbar sie in meinem Leben zu haben. Von ganzem Herzen Danke & eine klare Empfehlung für all die, die in einer schwierigen Phase sind und oder an sich arbeiten bzw. mehr über sich lernen möchten",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />
      <main className="space-y-20">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <SpanDesign>Community Feedbacks</SpanDesign>

            <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Das Sagen Unsere
              <br />
              Soulfamily Members
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
              Ich bin unendlich Dankbar für so viel Liebe und positives Feedback meiner Mitglieder - ich nenne sie lieber Soulfamily Members.
              <br />
              <br />
              Ich liebe Jeden einzelnen, der mit mir in Kontakt kommt und noch kommen wird. Jeder von euch ist wertvoll und es ist mir eine Ehre euch auf eurem Weg ein Stück begleiten zu dürfen!
            </p>
          </div>
        </section>

        {/* Feedback Form */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <FeedbackForm />
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl text-white mb-4">
                Erfahrungsberichte
              </h2>
              <p className="text-gray-300 text-lg">
                Das sagen unsere Soulfamily Members über ihre Erfahrungen mit Ozean Licht
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  location={testimonial.location}
                  testimonial={testimonial.testimonial}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA 1 */}
        <CTA1 />

        {/* Love Letter Promo */}
        <LoveLetterPromo />

        {/* Kids Ascension Promo */}
        <KidsAscensionPromo />

        {/* Footer Spacer */}
        <div className="h-[50px]"></div>
      </main>
      <Footer />
    </div>
  )
}
