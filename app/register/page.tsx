import { Header } from "@/components/header"
import { RegisterForm } from "@/components/register-form"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
