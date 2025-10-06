import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { SpanDesign } from '@/components/span-design'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/badge'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award,
  Sparkles,
  AlertCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserCourses(userId: string) {
  const supabase = await createClient()
  
  // Debug: Log user ID
  console.log('🔍 Fetching courses for user:', userId)
  
  // Get all courses user has access to via paid orders
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
    .eq('status', 'paid')
    .not('course_id', 'is', null)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('❌ Error fetching user courses:', error)
    return { courses: [], debug: { error: error.message } }
  }
  
  console.log(`✅ Found ${orders?.length || 0} paid orders for user`)
  console.log('Orders:', JSON.stringify(orders, null, 2))
  
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
    .select('id, status, course_id, buyer_email, source')
    .eq('user_id', userId)
  
  // Get user email
  const { data: { user } } = await supabase.auth.getUser()
  
  return {
    userEmail: user?.email,
    totalOrders: allOrders?.length || 0,
    ordersByStatus: allOrders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
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
        <div className="text-center mb-12">
          <SpanDesign>Meine Bibliothek</SpanDesign>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-cinzel-decorative font-normal text-foreground mb-4">
            Deine Kurse
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Setze deine spirituelle Reise fort und vertiefe dein Wissen mit deinen erworbenen Kursen
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{courses.length}</p>
                <p className="text-sm text-muted-foreground">Kurse verfügbar</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">-</p>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">-</p>
                <p className="text-sm text-muted-foreground">Lernzeit</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">-</p>
                <p className="text-sm text-muted-foreground">Fortschritt</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Debug Info (nur wenn keine Kurse) */}
        {courses.length === 0 && (
          <Card className="p-6 mb-8 bg-yellow-500/5 border-yellow-500/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-600 mb-2">Debug Information</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>User Email: {debugInfo.userEmail}</p>
                  <p>User ID: {user.id}</p>
                  <p>Total Orders in Database: {debugInfo.totalOrders}</p>
                  <p>Orders by Status: {JSON.stringify(debugInfo.ordersByStatus)}</p>
                  <p>Paid Orders with Courses: {debug.ordersWithCourses}</p>
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
          <Card className="p-12 text-center">
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
          // Course Grid
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Hier findest du alle Kurse, die du erworben hast. Setze dein Lernen fort und vertiefe dein Wissen.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/courses">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mehr Kurse
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-transparent group">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    {course.thumbnail_url_desktop ? (
                      <img
                        src={course.thumbnail_url_desktop}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                      <Button asChild size="sm" className="gap-2">
                        <Link href={`/courses/${course.slug}/learn`}>
                          <Play className="h-4 w-4" />
                          Weiter lernen
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        {course.tags?.[0] || 'Kurs'}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {course.source === 'ablefy' ? 'Legacy' : 'Neu'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium mb-2 font-cinzel text-lg line-clamp-1">
                      {course.title}
                    </h3>
                    
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.subtitle}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-primary/10">
                      <span>Erworben: {new Date(course.purchase_date).toLocaleDateString('de-DE')}</span>
                      <Button asChild variant="ghost" size="sm" className="h-8 gap-2">
                        <Link href={`/courses/${course.slug}`}>
                          Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
