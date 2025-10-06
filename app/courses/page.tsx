import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpanDesign } from "@/components/span-design"
import { CourseCardModern } from "@/components/course-card-modern"
import { CourseFilter } from "@/components/course-filter"
import { getCoursesFromEdge, getCoursesFromAirtable } from "@/lib/supabase"

interface Course {
  slug: string
  title: string
  description: string
  price: number
  is_public: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  created_at: string
  updated_at: string
}

async function getCourses(): Promise<Course[]> {
  try {
    // Lade Kurse direkt aus Supabase (kein Airtable Fallback)
    console.log('🚀 Loading courses from Supabase...')
    const courses = await getCoursesFromEdge(50)
    console.log(`✅ Loaded ${courses.length} courses from Supabase`)
    return courses
  } catch (error) {
    console.error('💥 Failed to load courses from Supabase:', error.message)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  // Ensure we have an array
  const safeCourses = Array.isArray(courses) ? courses : []

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Courses Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header Container with consistent spacing */}
          <div className="space-y-5 mb-16">
            <SpanDesign>Unsere Kurse</SpanDesign>

            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white leading-tight">
              Entdecke unsere<br />
              Weiterbildungskurse
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-muted-foreground font-light">
              Erweitere dein Bewusstsein und entdecke neue Möglichkeiten mit unseren umfassenden Kursen zu Metaphysik, Quanten-Transformation und kosmischem Wissen.
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-start max-w-5xl mx-auto mb-12">
            <CourseFilter />
          </div>

          {/* Course Grid */}
          <div className="w-full">
            {safeCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {safeCourses.map((course) => (
                  <CourseCardModern key={course.course_code} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-white/70 text-lg">
                  Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!
                  <br />
                  <small className="text-white/50 mt-2 block">
                    Debug: {courses?.length || 0} Kurse empfangen, {safeCourses.length} sicher verarbeitet
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
