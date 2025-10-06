"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

interface PasswordResetFormProps {
  onSuccess: () => void
}

export function PasswordResetForm({ onSuccess }: PasswordResetFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!password) {
        throw new Error("Bitte geben Sie ein neues Passwort ein.")
      }

      if (password.length < 6) {
        throw new Error("Das Passwort muss mindestens 6 Zeichen lang sein.")
      }

      if (password !== confirmPassword) {
        throw new Error("Die Passwörter stimmen nicht überein.")
      }

      // Verwende Supabase Auth für Passwort-Update
      const { createBrowserSupabaseClient } = await import("@/lib/supabase")
      const supabase = createBrowserSupabaseClient()

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      // Erfolgreich - Callback aufrufen
      onSuccess()
    } catch (err) {
      console.error("Password reset error:", err)
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
          <h1 className="text-2xl font-light text-foreground">Neues Passwort setzen</h1>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Neues Passwort"
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

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Passwort bestätigen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="transition-colors pr-10 bg-background"
                style={{ borderColor: "#0E282E" }}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            {isLoading ? "Wird gespeichert..." : "Passwort speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


