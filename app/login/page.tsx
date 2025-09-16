import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
