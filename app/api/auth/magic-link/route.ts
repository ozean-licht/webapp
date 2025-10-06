import { createClient } from '@supabase/supabase-js'
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

    // Erstelle Admin Client mit Service Role Key für generateLink()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured')
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler: Service Role Key fehlt' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Dynamic redirect URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/auth/callback`

    console.log('🎯 Using redirect URL:', redirectUrl)
    console.log('🌐 Base URL from env:', baseUrl)

    console.log('🔐 Generating magic link with Admin API (no email sent by Supabase)...')
    
    // Generiere einen echten Magic Link OHNE dass Supabase eine E-Mail sendet
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    })

    if (linkError) {
      console.error('❌ Generate link error:', linkError)
      
      if (linkError.message.includes('User not found') || linkError.message.includes('user_not_found')) {
        return NextResponse.json(
          { error: 'Kein Benutzer mit dieser E-Mail-Adresse gefunden. Bitte registriere dich zuerst.' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Fehler beim Generieren des Magic Links: ' + linkError.message },
        { status: 500 }
      )
    }

    if (!linkData?.properties?.action_link) {
      console.error('❌ No action link in response')
      return NextResponse.json(
        { error: 'Magic Link konnte nicht generiert werden' },
        { status: 500 }
      )
    }

    const magicLink = linkData.properties.action_link
    console.log('✅ Magic link generated:', magicLink.substring(0, 50) + '...')

    // Jetzt senden wir die E-Mail über unsere Edge Function mit Resend
    console.log('📧 Sending email via Edge Function with Resend...')
    
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-email`
    const functionKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const functionResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${functionKey}`,
        'apikey': functionKey || ''
      },
      body: JSON.stringify({
        email: email,
        magicLink: magicLink,
        redirectTo: redirectUrl,
        source: 'nextjs-api-route'
      })
    })

    console.log('📡 Edge Function Response Status:', functionResponse.status)

    if (!functionResponse.ok) {
      const errorText = await functionResponse.text()
      console.error('❌ Edge Function call failed:', errorText)
      return NextResponse.json(
        {
          error: 'Fehler beim Senden der E-Mail',
          details: errorText
        },
        { status: 500 }
      )
    }

    const functionResult = await functionResponse.json()
    console.log('✅ Email sent successfully via Resend')

    return NextResponse.json({
      message: 'Magic Link wurde erfolgreich gesendet',
      email,
      redirectUrl,
      resendUsed: true
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
