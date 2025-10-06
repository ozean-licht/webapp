'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { PasswordResetForm } from '@/components/password-reset-form'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [authType, setAuthType] = useState<string | null>(null)
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Auth Callback: Starting...')
        console.log('🔗 Full URL:', window.location.href)
        console.log('🔗 Hash:', window.location.hash)
        console.log('🔗 Search:', window.location.search)

        const supabase = createBrowserSupabaseClient()

        // Überprüfe URL-Parameter für verschiedene Auth-Typen
        const urlParams = new URLSearchParams(window.location.search)
        const urlAuthType = urlParams.get('type')
        
        // Check hash für Magic Link tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const hashAuthType = hashParams.get('type')

        console.log('📍 Auth Type from Query:', urlAuthType)
        console.log('📍 Auth Type from Hash:', hashAuthType)
        console.log('🔑 Access Token present:', !!accessToken)
        console.log('🔑 Refresh Token present:', !!refreshToken)

        setAuthType(urlAuthType || hashAuthType)

        if (urlAuthType === 'password_reset') {
          // Handle password reset
          setStatus('success')
          setMessage('Du kannst jetzt dein Passwort zurücksetzen.')
          return
        }

        // Wenn Tokens im Hash sind (Magic Link), setze die Session explizit
        if (accessToken && refreshToken) {
          console.log('✨ Setting session from hash tokens...')
          
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('❌ Error setting session:', sessionError)
            setStatus('error')
            setMessage('Fehler beim Setzen der Session: ' + sessionError.message)
            return
          }

          if (sessionData.session) {
            console.log('✅ Session set successfully:', sessionData.session.user.email)
            
            // Check if user needs to set password (first time login)
            const needsPasswordSetup = !sessionData.session.user.user_metadata?.password_set
            console.log('🔐 Needs password setup:', needsPasswordSetup)
            
            if (needsPasswordSetup) {
              console.log('🔄 Redirecting to password setup...')
              setStatus('success')
              setMessage('Willkommen! Bitte setze ein Passwort für dein Konto.')
              
              setTimeout(() => {
                router.push('/setup-password')
              }, 1500)
              return
            }
            
            setStatus('success')
            setMessage('Erfolgreich angemeldet! Du wirst weitergeleitet...')

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 1500)
            return
          }
        }

        // Fallback: Prüfe ob bereits eine Session existiert
        console.log('🔍 Checking existing session...')
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ Auth callback error:', error)
          setStatus('error')
          setMessage('Fehler bei der Authentifizierung. Bitte versuche es erneut.')
          return
        }

        if (data.session) {
          console.log('✅ Existing session found:', data.session.user.email)
          
          // Check if user needs to set password (first time login)
          const needsPasswordSetup = !data.session.user.user_metadata?.password_set
          console.log('🔐 Needs password setup:', needsPasswordSetup)
          
          if (needsPasswordSetup) {
            console.log('🔄 Redirecting to password setup...')
            setStatus('success')
            setMessage('Willkommen! Bitte setze ein Passwort für dein Konto.')
            
            setTimeout(() => {
              router.push('/setup-password')
            }, 1500)
            return
          }
          
          setStatus('success')
          setMessage('Erfolgreich angemeldet! Du wirst weitergeleitet...')

          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          console.log('❌ No session found')
          setStatus('error')
          setMessage('Keine gültige Session gefunden. Bitte versuche es erneut.')
        }
      } catch (error) {
        console.error('💥 Callback error:', error)
        setStatus('error')
        setMessage('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    handleAuthCallback()
  }, [router])

  // Handler für erfolgreiches Passwort-Reset
  const handlePasswordResetSuccess = () => {
    setPasswordResetSuccess(true)
    setStatus('success')
    setMessage('Passwort erfolgreich zurückgesetzt! Du wirst zur Anmeldung weitergeleitet...')

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {authType === 'password_reset' && !passwordResetSuccess ? (
            <PasswordResetForm onSuccess={handlePasswordResetSuccess} />
          ) : (
            <Card className="w-full shadow-lg bg-[#001212]/60 border-[#0E282E]">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  {status === 'loading' && (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <h2 className="text-xl font-light text-foreground">
                        Wird verifiziert...
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Bitte warte einen Moment, während wir deinen Magic Link verifizieren.
                      </p>
                    </>
                  )}

                  {status === 'success' && (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <h2 className="text-xl font-light text-foreground">
                        {authType === 'password_reset' ? 'Passwort-Reset bereit' : 'Anmeldung erfolgreich!'}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {message}
                      </p>
                    </>
                  )}

                  {status === 'error' && (
                    <>
                      <XCircle className="h-12 w-12 text-red-500" />
                      <h2 className="text-xl font-light text-foreground">
                        Fehler bei der Anmeldung
                      </h2>
                      <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                          {message}
                        </AlertDescription>
                      </Alert>
                      <div className="mt-4">
                        <button
                          onClick={() => router.push('/magic-link')}
                          className="text-primary hover:text-primary/80 underline font-medium"
                        >
                          Zurück zum Magic Link
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
