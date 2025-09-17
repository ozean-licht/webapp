"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail } from "lucide-react"

export function MagicLinkForm() {
  console.log('🔥 MagicLinkForm component rendered!')

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🎯 Magic Link Form submitted!')
    console.log('📧 Email:', email)

    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!email) {
        console.log('❌ No email provided')
        throw new Error("Bitte gib deine E-Mail-Adresse ein.")
      }

      console.log('📡 Making API call to /api/auth/magic-link...')

      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      console.log('📨 Response status:', response.status)
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('📨 Response data:', result)

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`)
      }

      if (result.error) {
        throw new Error(result.error)
      }

      console.log('✅ Magic link sent successfully!')
      setSuccess(true)

    } catch (err) {
      console.error('💥 Error in handleSubmit:', err)
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.")
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
          <h1 className="text-2xl font-light text-foreground">Magic Link Senden</h1>
          <p className="text-sm text-muted-foreground">
            Wir senden dir einen sicheren Link per E-Mail, mit dem du dich direkt anmelden kannst.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="deine@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-colors bg-background"
              style={{ borderColor: "#0E282E" }}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Magic Link wurde erfolgreich gesendet! Bitte prüfe dein E-Mail-Postfach.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-[#0FA8A3] text-white font-medium text-lg py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Wird gesendet..." : "Magic Link Senden"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Zurück zur{" "}
          <a
            href="/login"
            className="text-[#4A9B9F] hover:text-[#5BADB1] font-medium"
          >
            normalen Anmeldung
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
