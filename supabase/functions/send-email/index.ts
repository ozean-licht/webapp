import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'resend';
import { Webhook } from 'standardwebhooks';
import { render } from '@react-email/render';
import { MagicLinkEmail } from '../_templates/magic-link.tsx';

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET');

if (!resendApiKey) {
  console.error('RESEND_API_KEY environment variable is not set');
}
if (!hookSecret) {
  console.error('SEND_EMAIL_HOOK_SECRET environment variable is not set');
}

const resend = new Resend(resendApiKey);

serve(async (req) => {
  console.log('🚀🚀🚀 EDGE FUNCTION CALLED - VERSION 32 (Real Magic Link) 🚀🚀🚀');
  console.log('📡 Method:', req.method);
  console.log('🔗 URL:', req.url);

  try {
    const payload = await req.text();
    console.log('📄 Payload received:', payload);

    // Parse the payload
    let data;
    try {
      data = JSON.parse(payload);
      console.log('📧 Email from payload:', data.email);
      console.log('🔗 Magic Link from payload:', data.magicLink ? 'Present ✅' : 'Missing ❌');
      console.log('🔗 Redirect from payload:', data.redirectTo);
      console.log('📍 Source:', data.source);
    } catch (e) {
      console.log('❌ Could not parse JSON payload');
    }

    if (data?.email && data?.magicLink) {
      console.log('📧 ===== SENDING CUSTOM EMAIL WITH REAL MAGIC LINK =====');

      try {
        // Verwende den ECHTEN Magic Link von Supabase Admin API
        const magicLink = data.magicLink;

        // Import the email template with logo and Cinzel Decorative
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Dein Magic Link</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a141f;">
              <div style="background: linear-gradient(135deg, #0a141f 0%, #1a2332 100%); color: white; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <div style="margin-bottom: 30px;">
                  <img src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Akadmie%20Komprimiert.png"
                       alt="Ozean Licht Logo"
                       style="width: 80px; height: auto; filter: brightness(0) invert(1);">
                </div>
                <h1 style="margin: 0; font-size: 32px; font-family: 'Cinzel Decorative', serif; font-weight: 700; text-shadow: 0 0 20px rgba(255,255,255,0.3); letter-spacing: 2px;">Willkommen zurück!</h1>
                <p style="font-size: 16px; margin: 20px 0; line-height: 1.6; opacity: 0.9;">
                  Du hast dich für einen sicheren Login bei Ozean Licht entschieden.
                  Klicke einfach auf den Button unten, um dich automatisch anzumelden.
                </p>
                <div style="margin: 40px 0;">
                  <a href="${magicLink}"
                     style="background: linear-gradient(135deg, #188689 0%, #20a8a3 100%); color: white; padding: 18px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(24, 134, 137, 0.4); transition: all 0.3s ease;">
                    🔐 Mit Magic Link anmelden
                  </a>
                </div>
                <p style="font-size: 14px; margin: 20px 0; opacity: 0.8;">
                  Dieser Link ist 1 Stunde gültig und kann nur einmal verwendet werden.
                </p>
              </div>
              <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px; font-family: 'Montserrat', sans-serif;">
                <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
                <p style="margin: 10px 0;">
                  Bei Fragen kontaktiere uns gerne unter
                  <a href="mailto:hello@ozean-licht.com" style="color: #188689; text-decoration: none; font-weight: 500;">hello@ozean-licht.com</a>
                </p>
                <p style="margin: 10px 0; font-weight: 300;">
                  © 2025 Ozean Licht™ - Alle Rechte vorbehalten
                </p>
              </div>
            </body>
          </html>
        `;

        const { data: resendData, error: resendError } = await resend.emails.send({
          from: 'Ozean Licht <auto@updates.ozean-licht.com>',
          to: [data.email],
          subject: 'Dein Magic Link für den Login bei Ozean Licht',
          html: emailHtml,
        });

        if (resendError) {
          console.error('❌ Resend error:', resendError);
          return new Response(JSON.stringify({
            error: 'Failed to send email',
            details: resendError
          }), { status: 500 });
        }

        console.log('✅ Custom email sent successfully:', resendData);

        return new Response(JSON.stringify({
          message: 'Custom email sent successfully',
          email: data.email,
          resendResponse: resendData,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (emailError) {
        console.error('💥 Email sending error:', emailError);
        return new Response(JSON.stringify({
          error: 'Email sending failed',
          details: emailError.message
        }), { status: 500 });
      }
    }

    // Default response
    return new Response(JSON.stringify({
      message: 'Edge Function executed',
      timestamp: new Date().toISOString(),
      method: req.method,
      hasPayload: !!payload,
      version: '32'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Function error:', error);
    return new Response(JSON.stringify({
      error: 'Function execution failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), { status: 500 });
  }
});