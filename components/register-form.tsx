"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [newsletterAccepted, setNewsletterAccepted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!fullName || !email || !password) {
        throw new Error("Bitte füllen Sie alle Felder aus.")
      }

      if (!privacyAccepted) {
        throw new Error("Bitte akzeptieren Sie die Datenschutzerklärung.")
      }

      // Verwende Supabase Auth für echte Registrierung
      const { createBrowserSupabaseClient } = await import("@/lib/supabase")
      const supabase = createBrowserSupabaseClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            newsletter_accepted: newsletterAccepted,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Erfolgreiche Registrierung - zeige Bestätigungsnachricht
        setError("") // Clear any previous errors
        // Die Bestätigungs-E-Mail wurde automatisch gesendet
        alert("Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.")
        // Redirect zur Login-Seite
        window.location.href = "/login"
      }
    } catch (err) {
      console.error("Registration error:", err)
      if (err.message?.includes("User already registered")) {
        setError("Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.")
      } else if (err.message?.includes("Password should be at least")) {
        setError("Das Passwort muss mindestens 6 Zeichen lang sein.")
      } else {
        setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg bg-[#001212]/60 border-[#0E282E]">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <img
            src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Akadmie%20Komprimiert.png"
            alt="Ozean Licht Logo"
            className="h-20 w-auto"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-light text-foreground">Jetzt Registrieren</h1>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="fullName"
              type="text"
              placeholder="Vollständiger Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="transition-colors bg-background"
              style={{ borderColor: "#0E282E" }}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="deine@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-colors bg-background"
              style={{ borderColor: "#0E282E" }}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-colors pr-10 bg-background"
                style={{ borderColor: "#0E282E" }}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
              Ich bin mit der Datenschutzerklärung einverstanden.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="newsletter"
              checked={newsletterAccepted}
              onCheckedChange={(checked) => setNewsletterAccepted(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="newsletter" className="text-sm text-muted-foreground leading-relaxed">
              Ich möchte mich in den Love Letter eintragen lassen.
            </label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-[#0FA8A3] text-white font-medium text-lg py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Wird registriert..." : "Registrieren"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Bereits ein Konto?{" "}
          <Button
            variant="link"
            className="text-[#4A9B9F] hover:text-[#5BADB1] text-xs font-medium p-0 h-auto"
            onClick={() => window.location.href = "/login"}
          >
            Jetzt anmelden
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
