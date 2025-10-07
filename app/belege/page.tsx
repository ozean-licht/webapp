import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { SpanDesign } from '@/components/span-design'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Receipt, 
  FileText,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Order {
  id: string
  order_date: string
  status: string
  total_amount?: number
  source: string
  ablefy_order_number?: string
  buyer_email?: string
  courses?: {
    id: string
    title: string
    slug: string
  }
}

async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_date,
      status,
      total_amount,
      source,
      ablefy_order_number,
      buyer_email,
      courses (
        id,
        title,
        slug
      )
    `)
    .eq('user_id', userId)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('❌ Error fetching orders:', error)
    return []
  }
  
  return orders as Order[] || []
}

export default async function BelegePage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirect=/belege')
  }
  
  // Get user's orders
  const orders = await getUserOrders(user.id)
  
  // Calculate total amount
  const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  
  return (
    <AppLayout breadcrumbs={[{ label: 'Belege' }]}>
      <div className="p-6">
        {/* Header Section */}
        <div className="text-center space-y-5 mb-16">
          <SpanDesign>Bestellübersicht</SpanDesign>

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white leading-tight">
            Meine Belege
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-muted-foreground font-light">
            Hier findest du alle deine Bestellungen und Belege auf einen Blick
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-normal text-foreground">{orders.length}</p>
                  <p className="text-xs text-muted-foreground font-light">Bestellungen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-normal text-foreground">
                    {orders.filter(o => o.status === 'paid' || o.status === 'Erfolgreich').length}
                  </p>
                  <p className="text-xs text-muted-foreground font-light">Erfolgreich</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-normal text-foreground">€{totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground font-light">Gesamtbetrag</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="glass-card-strong p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-cinzel-decorative font-normal mb-4">
                Noch keine Belege vorhanden
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Deine Bestellungen und Belege werden hier angezeigt, sobald du einen Kurs erworben hast.
              </p>
              
              <Button asChild size="lg" className="gap-2">
                <Link href="/courses">
                  <Receipt className="h-4 w-4" />
                  Kurse durchstöbern
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="glass-card glass-hover group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-mono text-muted-foreground">
                            Bestellung #{order.ablefy_order_number || order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground font-light">
                            {new Date(order.order_date).toLocaleDateString('de-DE', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Course Info */}
                      {order.courses && (
                        <div className="ml-8">
                          <Link 
                            href={`/courses/${order.courses.slug}`}
                            className="text-foreground font-medium hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                          >
                            {order.courses.title}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      )}

                      {/* Source Badge */}
                      <div className="ml-8">
                        <span className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded">
                          {order.source === 'ablefy' ? 'Legacy System' : 'Ozean Licht'}
                        </span>
                      </div>
                    </div>

                    {/* Status & Amount */}
                    <div className="flex items-center gap-4">
                      {/* Status */}
                      <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
                        order.status === 'paid' || order.status === 'Erfolgreich' 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : order.status === 'partial'
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {order.status === 'Erfolgreich' ? 'Bezahlt' : order.status}
                      </div>

                      {/* Amount */}
                      {order.total_amount && (
                        <div className="text-right">
                          <p className="text-2xl font-normal text-foreground">
                            €{order.total_amount.toFixed(2)}
                          </p>
                        </div>
                      )}

                      {/* Download Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        disabled
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden md:inline">PDF</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Note */}
        {orders.length > 0 && (
          <Card className="glass-card bg-blue-500/5 border-blue-500/20 mt-8">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground font-light">
                  <p className="mb-1">
                    <strong className="text-foreground">Hinweis:</strong> Belege aus unserem vorherigen System (Legacy) 
                    werden hier angezeigt. Für Fragen zu älteren Bestellungen kontaktiere bitte unseren Support.
                  </p>
                  <p className="text-xs mt-2">
                    PDF-Download wird in Kürze verfügbar sein.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
