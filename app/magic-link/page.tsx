import { Header } from "@/components/header"
import { MagicLinkForm } from "@/components/magic-link-form"
import { Footer } from "@/components/footer"

export default function MagicLinkPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <MagicLinkForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
