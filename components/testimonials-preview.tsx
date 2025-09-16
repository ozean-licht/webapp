import SpanBadge from "./span-badge"
import PrimaryButton from "./primary-button"
import TestimonialCard from "./testimonial-card"
import { ArrowRight } from "lucide-react"

export default function TestimonialsPreview() {
  const testimonials = [
    {
      name: "Regina H",
      location: "Aschaffenburg, Deutschland",
      testimonial:
        "Die Energien sind der absolute Hammer!! Ich hab in 10 Min. Channeled Reading mehr Themen auflösen und bearbeiten können, als in den letzten zehn Jahren zusammen. Ich fühle mich unglaublich unterstützt und supported auf unbeschreibliche Weise. Selten habe ich so viel Energien in einer Sitzung gespürt.",
    },
    {
      name: "Katrin A",
      location: "Deutschland",
      testimonial:
        "Liebe Lia, von Herzen Danke für Deine Arbeit und dass du mir hilfst aus meinen Möglichkeiten Wirklichkeit werden zu lassen! Du hast eine ganz große Gabe und ich bewundere Dich für Deinen Mut sie einzusetzen! Danke für dein Sein und Wirken! Ich kann es kaum erwarten bis der 5D Masterkurs endlich anfängt!",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <SpanBadge icon="feedback" text="Feedback" />

            <h2 className="font-cinzel text-4xl md:text-5xl text-white leading-tight">
              Das Sagen Unsere
              <br />
              Soulmember
            </h2>

            {/* Statistics */}
            <div className="flex gap-12">
              <div>
                <div className="text-4xl md:text-5xl font-montserrat-alt font-bold text-white mb-2">100%</div>
                <div className="text-[#5DABA3] font-montserrat-alt text-base">Zufriedenheitsrate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-montserrat-alt font-bold text-white mb-2">60+</div>
                <div className="text-[#5DABA3] font-montserrat-alt text-base">Live Events</div>
              </div>
            </div>

            <PrimaryButton>
              Alle Feedbacks
              <ArrowRight className="w-4 h-4 ml-2" />
            </PrimaryButton>
          </div>

          {/* Right Testimonials */}
          <div className="space-y-6">
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
      </div>
    </section>
  )
}

export { TestimonialsPreview }
