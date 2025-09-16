import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@4.0.0';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { renderAsync } from 'https://esm.sh/@react-email/render@0.0.17';
import MagicLink from './_templates/magic-link.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET');

serve(async (req) => {
  if (req.method === 'POST') {
    const payload = await req.text();
    const wh = new Webhook(hookSecret!);
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
      const { data: resendData, error } = await resend.emails.send({
        from: 'Ozean Licht <auto@updates.ozean-licht.com>',
        to: [email],
        subject: 'Dein Magic Link für den Login',
        html: await renderAsync(
          MagicLink({
            supabase_url: Deno.env.get('SUPABASE_URL')!,
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
      console.log(resendData);
    }

    return new Response('Email sent', { status: 200 });
  }

  return new Response('Method not allowed', { status: 405 });
});