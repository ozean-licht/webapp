"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate login process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!email || !password) {
        throw new Error("Bitte füllen Sie alle Felder aus.")
      }

      // Here you would typically make an API call to authenticate
      console.log("Login attempt:", { email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg" style={{ backgroundColor: "#00111A", borderColor: "#0E282E" }}>
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <img
            src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Akadmie%20Komprimiert.png"
            alt="Ozean Licht Logo"
            className="h-20 w-auto"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-light text-foreground">Jetzt Anmelden</h1>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" className="text-[#4A9B9F] hover:text-[#5BADB1] text-sm font-medium">
            Passwort vergessen?
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Noch kein Konto?{" "}
          <Button variant="link" className="text-[#4A9B9F] hover:text-[#5BADB1] text-xs font-medium p-0 h-auto">
            Jetzt registrieren
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
