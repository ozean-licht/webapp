"use client"

import { SpanDesign } from "@/components/span-design"
import { CourseCard } from "@/components/course-card"
import { PrimaryButton } from "@/components/primary-button"

export function CoursePreview() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <SpanDesign>Einblick & Vorschau</SpanDesign>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel text-white mb-6 text-balance">
            {"Unsere aktuellen Weiterbildungskurse"}
          </h2>
          <p className="text-white/70 font-montserrat-alt text-lg max-w-2xl mx-auto">
            Sollte es einmal finanziell knapp sein - die meisten von uns kenn das - mach dir keine Sorgen. Wir finden
            eine Lösung. Spreche mich offen und EHRLICH darauf an und ich schaue was ich für dich tun kann, denn jeder
            soll die Möglichkeit haben glücklich zu sein!
          </p>
        </div>

        {/* Default Course Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <CourseCard />
          <CourseCard />
        </div>

        {/* Small Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <CourseCard variant="small" />
          <CourseCard variant="small" />
          <CourseCard variant="small" />
        </div>

        <div className="text-center">
          <PrimaryButton>Alle Kurse sehen</PrimaryButton>
        </div>
      </div>
    </section>
  )
}
