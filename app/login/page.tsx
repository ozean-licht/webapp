import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"
import { Footer } from "@/components/footer"
import { Notification } from "@/components/notification"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <LoginForm />
          <Notification
            title="Bereits ein Ablefy-Konto?"
            description={<>Wenn du bereits ein Ablefy-Konto hast, melde dich bitte mit der gleichen E-Mail-Adresse über unseren <a href="/magic-link" className="text-primary hover:text-primary/80 underline font-medium">Magic Link</a> an. Du kannst danach ein neues Passwort vergeben und deine gespeicherte Bibliothek wiederfinden.</>}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
