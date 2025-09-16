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
  if (req.method === 'POST') {
    // Validate required environment variables
    if (!hookSecret) {
      console.error('SEND_EMAIL_HOOK_SECRET is not configured');
      return new Response('Server configuration error', { status: 500 });
    }

    const payload = await req.text();
    const wh = new Webhook(hookSecret);
    let msg;
    try {
      msg = wh.verify(payload, req.headers) as {
        type: string;
        data: {
          type: string;
          email: string;
          action_type: string;
          token: string;
          token_hash: string;
          redirect_to: string;
        };
      };
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify(err), { status: 401 });
    }

    const { type, data } = msg;
    if (type !== 'auth.send_email') return new Response('Ignored', { status: 200 });

    const { email, action_type, token, token_hash, redirect_to } = data;

    if (action_type === 'magic_link') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      if (!supabaseUrl) {
        console.error('SUPABASE_URL environment variable is not set');
        return new Response('Server configuration error', { status: 500 });
      }

      if (!resendApiKey) {
        console.error('RESEND_API_KEY is not configured for sending emails');
        return new Response('Email service not configured', { status: 500 });
      }

      const { data: resendData, error } = await resend.emails.send({
        from: 'Ozean Licht <auto@updates.ozean-licht.com>',
        to: [email],
        subject: 'Dein Magic Link für den Login',
        html: render(
          MagicLinkEmail({
            supabase_url: supabaseUrl,
            email_action_type: action_type,
            redirect_to,
            token_hash,
            token,
          })
        ),
      });

      if (error) {
        console.error(error);
        return new Response(JSON.stringify(error), { status: 500 });
      }
      console.log('Email sent successfully:', resendData);
    } else {
      console.log('Ignoring non-magic-link action:', action_type);
    }

    return new Response('Email sent', { status: 200 });
  }

  return new Response('Method not allowed', { status: 405 });
});