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
  console.log('🚀🚀🚀 EDGE FUNCTION CALLED - VERSION 31 🚀🚀🚀');
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
      console.log('🔗 Redirect from payload:', data.redirectTo);
      console.log('📍 Source:', data.source);
    } catch (e) {
      console.log('❌ Could not parse JSON payload');
    }

    if (data?.email) {
      console.log('📧 ===== SENDING CUSTOM EMAIL =====');

      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://suwevnhwtmcazjugfmps.supabase.co';

        // Import the email template
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Dein Magic Link</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0a141f 0%, #1a2332 100%); color: white; padding: 40px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">Willkommen zurück!</h1>
                <p style="font-size: 16px; margin: 20px 0;">
                  Du hast dich für einen sicheren Login bei Ozean Licht entschieden.
                </p>
                <div style="margin: 30px 0;">
                  <a href="${supabaseUrl}/auth/v1/verify?token=demo&email=${encodeURIComponent(data.email)}&type=magiclink&redirect_to=${encodeURIComponent(data.redirectTo || `${supabaseUrl}/auth/callback`)}"
                     style="background: #188689; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    🔐 Mit Magic Link anmelden
                  </a>
                </div>
                <p style="font-size: 14px; margin: 20px 0;">
                  Dieser Link ist 1 Stunde gültig.
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© 2025 Ozean Licht™ - Alle Rechte vorbehalten</p>
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
      version: '31'
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