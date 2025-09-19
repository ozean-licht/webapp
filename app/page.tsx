import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { OurPromise } from "@/components/our-promise"
import { CTA1 } from "@/components/cta-1"
import { YouTubeTicker } from "@/components/youtube-ticker"
import { CoursePreview } from "@/components/course-preview"
import { LoveLetterPromo } from "@/components/love-letter-promo"
import { KidsAscensionPromo } from "@/components/kids-ascension-promo"
import { PartnerDealPromo } from "@/components/partner-deal-promo"
import { TestimonialsPreview } from "@/components/testimonials-preview"
import { QuickFaq } from "@/components/quick-faq"
import { BookPromo } from "@/components/book-promo"
import { BlogPreview } from "@/components/blog-preview"
import { CTA2 } from "@/components/cta-2"

export default function Home() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />
      <main className="space-y-20">
        <Hero />
        <OurPromise />
        <CTA1 />
        <YouTubeTicker />
        <CoursePreview />
        <KidsAscensionPromo />
        <LoveLetterPromo />
        <PartnerDealPromo />
        <TestimonialsPreview />
        <QuickFaq />
        <BookPromo />
        <BlogPreview />
        <CTA2 />
      </main>
      <Footer />
    </div>
  )
}
