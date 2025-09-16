'use client'

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { OurPromise } from "@/components/our-promise"
import { CTA1 } from "@/components/cta-1"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-20">
        <Hero />
        <OurPromise />
        <CTA1 />
      </main>
      <Footer />
    </div>
  )
}
