import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PrimaryButton } from "@/components/primary-button"
import Link from "next/link"

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* 404 Icon */}
            <div className="text-8xl">✨</div>

            <div>
              <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white mb-6">
                Kurs nicht gefunden
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Der gesuchte Kurs ist aktuell nicht verfügbar oder wurde möglicherweise umbenannt.
                Entdecke unsere anderen transformierenden Kurse.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/courses">
                <PrimaryButton className="text-lg px-8 py-4">
                  Alle Kurse ansehen
                </PrimaryButton>
              </Link>
              <Link href="/">
                <PrimaryButton variant="outline" className="text-lg px-8 py-4">
                  Zur Startseite
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
