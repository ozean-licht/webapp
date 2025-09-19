import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpanDesign } from "@/components/span-design"
import { PrimaryButton } from "@/components/primary-button"
import { CtaButton } from "@/components/cta-button"
import { getCourseFromEdge } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/badge"
import { SpanBadge } from "@/components/span-badge"
import { CTA1 } from "@/components/cta-1"
// Temporarily disable framer-motion to avoid export issues
// import { motion } from "framer-motion"
import type { Metadata } from "next"

interface Course {
  slug: string
  title: string
  description: string
  price: number
  is_published: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  created_at: string
  updated_at: string
}

interface CoursePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    return {
      title: 'Kurs nicht gefunden | Ozean-Licht Metaphysik Akademie',
      description: 'Der gesuchte Kurs ist aktuell nicht verfügbar.',
    }
  }

  return {
    title: `${course.title} | Ozean-Licht Metaphysik Akademie`,
    description: course.description?.substring(0, 160) || 'Entdecke transformative Kurse zu Metaphysik und Quanten-Transformation.',
    keywords: ['Metaphysik', 'Quanten-Transformation', 'Spirituelle Entwicklung', course.title],
    openGraph: {
      title: course.title,
      description: course.description?.substring(0, 160) || 'Transformative Kurse für spirituelles Wachstum.',
      images: [
        {
          url: course.thumbnail_url_desktop || '/api/placeholder/1200/630',
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description?.substring(0, 160) || 'Transformative Kurse für spirituelles Wachstum.',
      images: [course.thumbnail_url_desktop || '/api/placeholder/1200/630'],
    },
  }
}

async function getCourse(slug: string): Promise<Course | null> {
  try {
    console.log(`🚀 Calling Edge Function for course: ${slug}`)
    const course = await getCourseFromEdge(slug)

    if (!course) {
      console.log(`⚠️ Course not found: ${slug}`)
      return null
    }

    console.log(`✅ Received course from Edge Function: ${course.title}`)
    return course
  } catch (error) {
    console.error('💥 Error in getCourse:', error)
    return null
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <SpanDesign>Basis Kurs</SpanDesign>
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white leading-tight mt-6 mx-auto max-w-4xl">
              {course.title}
            </h1>
          </div>

          {/* Video Section with max-width 1000px */}
          <div className="max-w-[1000px] mx-auto mb-16">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <Image
                src={course.thumbnail_url_desktop || "/api/placeholder/800/450"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
                  <svg className="w-12 h-12 text-white ml-1 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
          </div>

          {/* Content Layout: Beschreibung/Badges links, Buttons rechts - max 1000px */}
          <div className="max-w-[1000px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Beschreibung und Badge */}
              <div className="lg:col-span-2 space-y-8">
                <p className="text-lg text-white/90 font-montserrat-alt leading-relaxed">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <SpanBadge>Kostenlos</SpanBadge>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <div className="text-sm text-white/70">Lebenslanger Zugang</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">HD</div>
                    <div className="text-sm text-white/70">Qualität</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-white/70">Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Buttons */}
              <div className="space-y-6">
                <PrimaryButton className="w-full text-xl px-12 py-6 rounded-full bg-gradient-to-r from-[#5DABA3]/30 to-[#5DABA3]/40 border border-[#5DABA3]/50 hover:from-[#5DABA3]/40 hover:to-[#5DABA3]/50 transition-all duration-300 shadow-lg hover:shadow-xl opacity-80">
                  <span className="relative z-10">Trailer Ansehen</span>
                </PrimaryButton>
                <CtaButton className="w-full text-xl px-12 py-6 rounded-full">
                  <span className="relative z-10">Ticket Kaufen - €{course.price}</span>
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SpanDesign>Was du lernst</SpanDesign>
            <h2 className="text-3xl md:text-4xl font-cinzel text-white mt-6">
              Kursinhalt & Struktur
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module Preview Cards */}
            {[1, 2, 3, 4, 5, 6].map((module) => (
              <div
                key={module}
                className="bg-[#0A1A1A] border border-[#0E282E] rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">{module}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Modul {module}: Spirituelle Grundlagen
                </h3>
                <p className="text-white/70 text-sm">
                  Entdecke die fundamentalen Prinzipien der Quanten-Transformation und wie sie dein Leben bereichern.
                </p>
                <div className="mt-4 flex items-center text-sm text-primary">
                  <span>3 Lektionen</span>
                  <span className="mx-2">•</span>
                  <span>45 Min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#0A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SpanDesign>Erfahrungen</SpanDesign>
            <h2 className="text-3xl md:text-4xl font-cinzel text-white mt-6">
              Was unsere Teilnehmer sagen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div
                key={testimonial}
                className="bg-background border border-[#0E282E] rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">A</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-white font-semibold">Anna M.</div>
                    <div className="text-white/60 text-sm">Teilnehmerin</div>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  "Dieser Kurs hat mein Leben komplett verändert. Die Erkenntnisse über Quanten-Transformation sind einfach unglaublich."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with CTA-1 Component */}
      <section className="py-20 px-4">
        <CTA1 />
      </section>

      <Footer />
    </div>
  )
}
