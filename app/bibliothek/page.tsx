import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { SpanDesign } from '@/components/span-design'
import { CourseListWithFilter } from '@/components/course-list-with-filter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Play, 
  Sparkles,
  AlertCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserCourses(userId: string) {
  const supabase = await createClient()
  
  // Debug: Log user ID and auth state
  console.log('🔍 Fetching courses for user:', userId)
  
  // CRITICAL: Check if auth.uid() is set
  const { data: { user: authUser } } = await supabase.auth.getUser()
  console.log('🔐 Auth UID:', authUser?.id)
  console.log('🔐 User ID Match:', authUser?.id === userId)
  
  // Get all courses user has access to via paid orders
  // Note: Status can be 'paid', 'Erfolgreich', or 'partial' for Ablefy orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      course_id,
      order_date,
      source,
      status,
      buyer_email,
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
    .in('status', ['paid', 'Erfolgreich', 'partial'])
    .not('course_id', 'is', null)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('❌ Error fetching user courses:', error)
    return { courses: [], debug: { error: error.message } }
  }
  
  console.log(`✅ Found ${orders?.length || 0} paid orders for user`)
  console.log('Orders:', JSON.stringify(orders, null, 2))
  
  // Debug RLS
  if (orders?.length === 0) {
    console.log('⚠️ No orders found - checking RLS...')
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    console.log('📊 Total orders for user (bypassing SELECT):', count)
    if (countError) console.log('❌ Count error:', countError)
  }
  
  // Filter out null courses and flatten
  const courses = orders
    .filter(order => order.courses)
    .map(order => ({
      ...order.courses,
      purchase_date: order.order_date,
      source: order.source,
      order_id: order.id
    }))
  
  // Debug info
  const debug = {
    totalOrders: orders?.length || 0,
    ordersWithCourses: courses.length,
    userId,
    orders: orders?.map(o => ({
      id: o.id,
      course_id: o.course_id,
      status: o.status,
      has_course: !!o.courses
    }))
  }
  
  return { courses, debug }
}

async function getDebugInfo(userId: string) {
  const supabase = await createClient()
  
  // Get all orders for this user (regardless of status)
  const { data: allOrders } = await supabase
    .from('orders')
    .select('id, status, course_id, buyer_email, source, ablefy_order_number')
    .eq('user_id', userId)
  
  // Get user email
  const { data: { user } } = await supabase.auth.getUser()
  
  return {
    userEmail: user?.email,
    totalOrders: allOrders?.length || 0,
    ordersByStatus: allOrders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    ordersWithCourses: allOrders?.filter(o => o.course_id).length || 0,
    sampleOrders: allOrders?.slice(0, 3).map(o => ({
      id: o.ablefy_order_number || o.id,
      status: o.status,
      has_course: !!o.course_id
    }))
  }
}

export default async function BibliotheKPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirect=/bibliothek')
  }
  
  // Get user's courses and debug info
  const { courses, debug } = await getUserCourses(user.id)
  const debugInfo = await getDebugInfo(user.id)
  
  return (
    <AppLayout breadcrumbs={[{ label: 'Bibliothek' }]}>
      <div className="p-6">
        {/* Header Section */}
        <div className="text-center space-y-5 mb-16">
          <SpanDesign>Besuchte Kurse</SpanDesign>

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white leading-tight">
            Deine Bibliothek
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-muted-foreground font-light">
            Setze deine spirituelle Reise fort und vertiefe dein Wissen mit deinen erworbenen Kursen
          </p>
        </div>

        {/* Debug Info (nur wenn keine Kurse) */}
        {courses.length === 0 && (
          <Card className="glass-card p-6 mb-8 bg-yellow-500/5 border-yellow-500/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-600 mb-2">Debug Information</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>User Email: {debugInfo.userEmail}</p>
                  <p>User ID: {user.id}</p>
                  <p>Total Orders in Database: {debugInfo.totalOrders}</p>
                  <p>Orders with Courses: {debugInfo.ordersWithCourses}</p>
                  <p>Orders by Status: {JSON.stringify(debugInfo.ordersByStatus)}</p>
                  <p>Query Found: {debug.ordersWithCourses} orders</p>
                </div>
                {debug.orders && debug.orders.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-yellow-600">
                      View Order Details
                    </summary>
                    <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-auto">
                      {JSON.stringify(debug.orders, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {courses.length === 0 ? (
          // Empty State
          <Card className="glass-card-strong p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-cinzel-decorative font-normal mb-4">
                Noch keine Kurse in deiner Bibliothek
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Entdecke unsere Kurse und starte deine Reise in die erweiterte Metaphysik und galaktische Weisheit.
              </p>
              
              <Button asChild size="lg" className="gap-2">
                <Link href="/courses">
                  <Sparkles className="h-4 w-4" />
                  Kurse durchstöbern
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          // Course List with Filter - Same as /courses page
          <CourseListWithFilter courses={courses} />
        )}
      </div>
    </AppLayout>
  )
}
