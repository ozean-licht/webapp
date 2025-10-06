import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CourseCardModern } from '@/components/course-card-modern'

export const dynamic = 'force-dynamic'

async function getUserCourses(userId: string) {
  const supabase = await createClient()
  
  // Get all courses user has access to via paid orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      course_id,
      order_date,
      source,
      courses (
        id,
        title,
        subtitle,
        description,
        slug,
        thumbnail_url_desktop,
        thumbnail_url_mobile,
        tags,
        price
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'paid')
    .not('course_id', 'is', null)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching user courses:', error)
    return []
  }
  
  // Filter out null courses and flatten
  return orders
    .filter(order => order.courses)
    .map(order => ({
      ...order.courses,
      purchase_date: order.order_date,
      source: order.source
    }))
}

export default async function BibliotheKPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirect=/bibliothek')
  }
  
  // Get user's courses
  const courses = await getUserCourses(user.id)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#000000]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Meine Bibliothek
              </h1>
              <p className="text-gray-400">
                {courses.length} {courses.length === 1 ? 'Kurs' : 'Kurse'} verfügbar
              </p>
            </div>
            
            <Link
              href="/courses"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              Weitere Kurse entdecken
            </Link>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {courses.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Noch keine Kurse in deiner Bibliothek
            </h2>
            
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Entdecke unsere Kurse und starte deine Reise in die erweiterte Metaphysik.
            </p>
            
            <Link
              href="/courses"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 font-semibold"
            >
              Kurse durchstöbern
            </Link>
          </div>
        ) : (
          // Course Grid
          <div>
            <div className="mb-8">
              <p className="text-gray-400">
                Hier findest du alle Kurse, die du erworben hast. Setze dein Lernen fort und vertiefe dein Wissen.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => (
                <div key={course.id} className="relative group">
                  <CourseCardModern
                    title={course.title}
                    subtitle={course.subtitle}
                    description={course.description}
                    slug={course.slug}
                    thumbnailDesktop={course.thumbnail_url_desktop}
                    thumbnailMobile={course.thumbnail_url_mobile}
                    tags={course.tags}
                    price={course.price}
                  />
                  
                  {/* Overlay mit "Weiter lernen" Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-6">
                    <Link
                      href={`/courses/${course.slug}/learn`}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 font-semibold text-center"
                    >
                      Weiter lernen →
                    </Link>
                  </div>
                  
                  {/* Badge für Quelle */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                    {course.source === 'ablefy' ? 'Legacy' : 'Neu'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
