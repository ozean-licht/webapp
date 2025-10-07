import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { SpanDesign } from '@/components/span-design'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/badge'
import { 
  FileText,
  Calendar,
  Euro,
  CheckCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUserOrders(userId: string) {
  const supabase = await createClient()
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_date,
      status,
      buyer_email,
      source,
      ablefy_order_number,
      course_id,
      courses (
        title,
        price
      )
    `)
    .eq('user_id', userId)
    .order('order_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return orders || []
}

export default async function BestellungenPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirect=/bestellungen')
  }
  
  const orders = await getUserOrders(user.id)
  
  return (
    <AppLayout breadcrumbs={[{ label: 'Belege' }]}>
      <div className="p-6 font-montserrat-alt">
        <div className="text-center mb-6">
          <SpanDesign>Deine Belege</SpanDesign>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel-decorative font-normal text-foreground mb-3">
            Bestellungen
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Alle deine Beiträge für den Verein Ozean Licht
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-primary/20 bg-[#0A1A1A]">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-normal text-foreground mb-2">
                Noch keine Bestellungen
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                Deine Beiträge und Bestellungen werden hier angezeigt
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="border-primary/20 bg-[#0A1A1A] hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-normal text-foreground mb-1">
                            {order.courses?.title || 'Bestellung'}
                          </h3>
                          {order.ablefy_order_number && (
                            <p className="text-sm text-muted-foreground font-light">
                              Bestellnummer: {order.ablefy_order_number}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-light">
                            {new Date(order.order_date).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {order.courses?.price && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Euro className="h-3.5 w-3.5" />
                            <span className="font-light">{order.courses.price}€</span>
                          </div>
                        )}

                        <Badge 
                          variant="outline" 
                          className="text-xs border-primary/30 text-primary font-light"
                        >
                          {order.source === 'ablefy' ? 'Ablefy' : 'Ozean Licht'}
                        </Badge>
                      </div>
                    </div>

                    {/* Right Section - Status */}
                    <div className="flex items-center gap-2">
                      {(order.status === 'paid' || order.status === 'Erfolgreich') && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500 font-light">Bezahlt</span>
                        </div>
                      )}
                      {order.status === 'partial' && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <span className="text-sm text-amber-500 font-light">Teilweise</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

