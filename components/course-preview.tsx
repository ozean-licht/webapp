import { SpanDesign } from "@/components/span-design"
import { CourseCard } from "@/components/course-card"
import { PrimaryButton } from "@/components/primary-button"
import { getCoursesFromEdge, getCoursesFromAirtable } from "@/lib/supabase"
import Link from "next/link"

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

async function getFeaturedCourses(): Promise<Course[]> {
  try {
    // Versuche zuerst Airtable für direkte Bild-URLs
    console.log('🚀 CoursePreview attempting Airtable...')
    const courses = await getCoursesFromAirtable(5)
    console.log(`✅ CoursePreview received ${courses.length} courses from Airtable`)
    return courses
  } catch (airtableError) {
    console.warn('⚠️ Airtable failed for CoursePreview, using Edge Function:', airtableError.message)

    try {
      console.log('🚀 CoursePreview calling Edge Function...')
      const courses = await getCoursesFromEdge(5)
      console.log(`✅ CoursePreview received ${courses.length} courses from Edge Function`)
      return courses
    } catch (edgeError) {
      console.error('💥 Both sources failed for CoursePreview:', edgeError)
      return []
    }
  }
}

export async function CoursePreview() {
  const courses = await getFeaturedCourses()
  const featuredCourses = courses.slice(0, 2) // First 2 courses for large cards
  const smallCourses = courses.slice(2, 5) // Next 3 courses for small cards

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

        {/* Featured Course Cards */}
        {featuredCourses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {featuredCourses.map((course) => (
              <CourseCard key={course.course_code} course={course} variant="preview" />
            ))}
          </div>
        )}

        {/* Small Course Cards */}
        {smallCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {smallCourses.map((course) => (
              <CourseCard key={course.course_code} course={course} variant="small" />
            ))}
          </div>
        )}

        {/* Show message if no courses available */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-white/70 text-lg mb-8">
              Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/courses">
            <PrimaryButton>Alle Kurse sehen</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
