import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔥 API Route called: /api/auth/magic-link')

  try {
    const { email } = await request.json()
    console.log('📧 Email received:', email)

    if (!email) {
      console.log('❌ No email provided')
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    console.log('🔧 Creating Supabase client...')
    const supabase = await createServerSupabaseClient()

    // Dynamic redirect URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/auth/callback`

    console.log('🎯 Using redirect URL:', redirectUrl)
    console.log('🌐 Base URL from env:', baseUrl)

    console.log('📤 Sending magic link via Supabase Auth...')
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('❌ Supabase Auth error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })

      return NextResponse.json(
        {
          error: error.message || 'Fehler beim Senden des Magic Links',
          details: error
        },
        { status: 500 }
      )
    }

    console.log('✅ Magic link request successful')
    console.log('📊 Response data:', data)

    // Jetzt rufen wir unsere Edge Function DIREKT auf
    console.log('🔗 Calling Edge Function directly...')

    try {
      const edgeFunctionUrl = 'https://suwevnhwtmcazjugfmps.supabase.co/functions/v1/send-email'
      const functionKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log('🌐 Edge Function URL:', edgeFunctionUrl)
      console.log('🔑 Using Function Key:', functionKey ? '[PRESENT]' : '[MISSING]')

      const functionResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${functionKey}`,
          'apikey': functionKey || ''
        },
        body: JSON.stringify({
          email: email,
          redirectTo: redirectUrl,
          source: 'nextjs-api-route'
        })
      })

      console.log('📡 Edge Function Response Status:', functionResponse.status)

      const functionResult = await functionResponse.text()
      console.log('📡 Edge Function Response:', functionResult)

      if (!functionResponse.ok) {
        console.error('❌ Edge Function call failed')
      } else {
        console.log('✅ Edge Function called successfully')
      }

    } catch (functionError) {
      console.error('💥 Error calling Edge Function:', functionError)
      // Wir ignorieren diesen Fehler, da die Hauptfunktionalität (Supabase Auth) funktioniert
    }

    return NextResponse.json({
      message: 'Magic Link wurde erfolgreich gesendet',
      email,
      redirectUrl,
      edgeFunctionCalled: true
    })

  } catch (error) {
    console.error('💥 Unexpected API error:', error)
    console.error('💥 Error stack:', error.stack)

    return NextResponse.json(
      {
        error: 'Interner Serverfehler',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
