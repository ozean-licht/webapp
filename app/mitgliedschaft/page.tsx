import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { SpanDesign } from '@/components/span-design'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Check,
  Star,
  Heart,
  Users,
  Sparkles,
  Crown
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const pricingPlans = [
  {
    id: 'guest',
    name: 'Guest',
    price: 0,
    period: 'Lebenslang Kostenlos',
    description: 'Kostenloser Zugang zu ausgewählten Inhalten',
    icon: Star,
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-[#0A1A1A]',
    borderColor: 'border-primary/20',
    features: [
      'Zugang zu kostenlosen Kursen',
      'Magazin-Artikel',
      'Basis-Community Zugang',
    ],
    cta: 'Kostenlos Starten',
    ctaVariant: 'outline' as const,
    popular: false
  },
  {
    id: 'member',
    name: 'Member',
    price: 18,
    period: 'pro Monat',
    description: 'Vollständiger Zugang zur Community',
    icon: Users,
    iconColor: 'text-primary',
    bgColor: 'bg-[#0A1A1A]',
    borderColor: 'border-primary/30',
    features: [
      'Alle Guest Features',
      'Gruppen Channelings',
      'Community Events',
      'Exklusive Webinare',
      'Member-Only Content',
    ],
    cta: 'Member werden',
    ctaVariant: 'default' as const,
    popular: true
  },
  {
    id: 'angel',
    name: 'Angel',
    price: 38,
    period: 'pro Monat',
    description: 'Unterstütze unsere Mission',
    icon: Heart,
    iconColor: 'text-pink-500',
    bgColor: 'bg-[#0A1A1A]',
    borderColor: 'border-pink-500/30',
    features: [
      'Alle Member Features',
      'Spende für Kids Ascension Angels',
      'Unterstützung unserer Vision',
      'Deine Energie hilft Kindern',
    ],
    cta: 'Angel werden',
    ctaVariant: 'default' as const,
    popular: false,
    note: '€20/m Spende für Kids Ascension Angels'
  }
]

export default async function MitgliedschaftPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?redirect=/mitgliedschaft')
  }
  
  return (
    <AppLayout breadcrumbs={[{ label: 'Mitgliedschaft' }]}>
      <div className="p-6 font-montserrat-alt">
        <div className="text-center mb-6">
          <SpanDesign>Werde Teil unserer Community</SpanDesign>
        </div>

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-cinzel-decorative font-normal text-foreground mb-4">
            Mitgliedschaft
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Wähle den Beitrag, der zu deiner spirituellen Reise passt. Als Verein leben wir von der Unterstützung unserer Community.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card 
                key={plan.id} 
                className={`${plan.bgColor} border-2 ${plan.borderColor} relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-xs font-normal text-black">
                    Beliebt
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${plan.iconColor === 'text-primary' ? 'bg-primary/10' : plan.iconColor === 'text-pink-500' ? 'bg-pink-500/10' : 'bg-muted-foreground/10'}`}>
                      <Icon className={`h-6 w-6 ${plan.iconColor}`} />
                    </div>
                    {plan.id === 'angel' && (
                      <Crown className="h-5 w-5 text-pink-500" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-cinzel-decorative font-normal text-foreground mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-3">
                    <span className="text-4xl font-normal text-foreground">
                      {plan.price === 0 ? 'Gratis' : `€${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground font-light ml-2">
                        {plan.period}
                      </span>
                    )}
                    {plan.price === 0 && (
                      <span className="text-sm text-muted-foreground font-light block">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-light">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.note && (
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 mb-4">
                      <p className="text-xs text-pink-300 font-light">
                        {plan.note}
                      </p>
                    </div>
                  )}

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground font-light">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full font-normal"
                    variant={plan.ctaVariant}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-[#0A1A1A]">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-cinzel-decorative font-normal text-foreground mb-2">
                    Über unseren Verein
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">
                    Ozean Licht ist ein gemeinnütziger Verein, der Menschen auf ihrer spirituellen Reise begleitet. 
                    Deine Mitgliedschaft und Spenden ermöglichen es uns, hochwertige Inhalte zu erstellen und unsere 
                    Community zu unterstützen.
                  </p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Angels unterstützen unser Kids Ascension Angels Projekt - eine Initiative, die Kindern hilft, 
                    ihre spirituellen Gaben zu entfalten und in ihrer Einzigartigkeit zu strahlen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

