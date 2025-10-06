'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  Shield,
  Zap,
  Crown
} from 'lucide-react'

interface PasswordStrength {
  score: number
  label: string
  color: string
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    special: boolean
  }
}

export default function SetupPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'setup' | 'success'>('setup')
  const [user, setUser] = useState<any>(null)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
    }
    
    checkAuth()
  }, [router])

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    }

    const score = Object.values(requirements).filter(Boolean).length
    
    const strengthMap = {
      0: { label: 'Sehr schwach', color: 'bg-red-500' },
      1: { label: 'Schwach', color: 'bg-orange-500' },
      2: { label: 'Akzeptabel', color: 'bg-yellow-500' },
      3: { label: 'Gut', color: 'bg-blue-500' },
      4: { label: 'Stark', color: 'bg-green-500' },
      5: { label: 'Sehr stark', color: 'bg-emerald-500' }
    }

    return {
      score,
      ...strengthMap[score as keyof typeof strengthMap],
      requirements
    }
  }

  const strength = calculatePasswordStrength(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const isFormValid = strength.score >= 3 && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      setError('Bitte erfülle alle Anforderungen für ein sicheres Passwort.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const supabase = createBrowserSupabaseClient()
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: { password_set: true }
      })

      if (updateError) throw updateError

      // Success animation
      setStep('success')
      
      // Redirect after animation
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (err: any) {
      console.error('Error setting password:', err)
      setError(err.message || 'Fehler beim Setzen des Passworts')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1A1A] via-[#0d1b2a] to-black flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 'setup' ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Card className="border-primary/20 bg-[#0A1A1A]/80 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Shield className="h-10 w-10 text-primary" />
                  </motion.div>
                  
                  <h1 className="text-3xl font-cinzel-decorative font-normal text-foreground mb-2">
                    Sichere dein Konto
                  </h1>
                  
                  <p className="text-muted-foreground">
                    Setze jetzt ein starkes Passwort für zukünftige Anmeldungen
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="password" className="text-foreground mb-2 block">
                      Neues Passwort
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="Mindestens 8 Zeichen"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Password Strength Indicator */}
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {/* Strength Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Passwortstärke</span>
                            <span className={`font-medium ${
                              strength.score >= 4 ? 'text-green-500' :
                              strength.score >= 3 ? 'text-blue-500' :
                              strength.score >= 2 ? 'text-yellow-500' :
                              'text-red-500'
                            }`}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <motion.div
                                key={bar}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: bar <= strength.score ? 1 : 0 }}
                                transition={{ delay: bar * 0.1 }}
                                className={`h-2 flex-1 rounded-full ${
                                  bar <= strength.score ? strength.color : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="grid grid-cols-1 gap-2 p-3 bg-background/50 rounded-lg border border-primary/10">
                          {[
                            { key: 'length', label: 'Mindestens 8 Zeichen' },
                            { key: 'uppercase', label: 'Großbuchstabe (A-Z)' },
                            { key: 'lowercase', label: 'Kleinbuchstabe (a-z)' },
                            { key: 'number', label: 'Zahl (0-9)' },
                            { key: 'special', label: 'Sonderzeichen (!@#$...)' }
                          ].map((req, index) => (
                            <motion.div
                              key={req.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.05 }}
                              className="flex items-center gap-2 text-sm"
                            >
                              {strength.requirements[req.key as keyof typeof strength.requirements] ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={
                                strength.requirements[req.key as keyof typeof strength.requirements]
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }>
                                {req.label}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirm Password Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-foreground mb-2 block">
                      Passwort bestätigen
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="Passwort wiederholen"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    <AnimatePresence>
                      {confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 mt-2 text-sm"
                        >
                          {passwordsMatch ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-green-500">Passwörter stimmen überein</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-500" />
                              <span className="text-red-500">Passwörter stimmen nicht überein</span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Error Alert */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className="w-full gap-2 h-12 text-base"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Zap className="h-5 w-5" />
                          </motion.div>
                          Passwort wird gesetzt...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5" />
                          Passwort sichern
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Warum ein Passwort?</p>
                      <p>
                        Mit einem Passwort kannst du dich auch ohne Magic Link anmelden und dein Konto ist zusätzlich geschützt.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 10 }}
              >
                <Check className="h-16 w-16 text-green-500" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-cinzel-decorative font-normal text-foreground mb-4">
                Passwort erfolgreich gesetzt!
              </h2>
              <p className="text-muted-foreground mb-8">
                Dein Konto ist jetzt gesichert. Du wirst gleich weitergeleitet...
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

