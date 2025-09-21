import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide">
            Artikel nicht gefunden
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Der gesuchte Artikel konnte nicht gefunden werden. Vielleicht wurde er verschoben oder entfernt.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/magazine"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#00FFD9] text-black font-medium rounded-lg hover:bg-[#00FFD9]/90 transition-colors"
            >
              Zum Magazin
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-[#0E282E] text-white font-medium rounded-lg hover:border-[#00FFD9]/50 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
