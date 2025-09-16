import { createSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient()

    // Send magic link using Supabase Auth
    const redirectUrl = `https://testnet3.ozean-licht.com/auth/callback`

    console.log('Using redirect URL:', redirectUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Magic link error:', error)
      return NextResponse.json(
        { error: error.message || 'Fehler beim Senden des Magic Links' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Magic Link wurde erfolgreich gesendet',
      email
    })
  } catch (error) {
    console.error('Magic link API error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
