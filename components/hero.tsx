import { Badge } from "@/components/badge"
import { PrimaryButton } from "@/components/primary-button"

export function Hero() {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Badge>Athemirah School Portal</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance">
            Dein persönlicher Lichtblick, komm in deine Kraft
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-slate-300 font-light">
            Du bist wertvoll ❤ Ich helfe dir, endlich glücklich zu sein und das Leben zu leben, das du dir wünschst.
            LEBE dich und dein volles Potenzial!
          </p>
        </div>
        <div className="pt-4">
          <PrimaryButton>Mehr Erfahren</PrimaryButton>
        </div>
      </div>
    </section>
  )
}
