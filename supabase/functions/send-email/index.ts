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
  console.log('🚀 FUNCTION CALLED - Method:', req.method);

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      message: 'Edge Function is working!',
      timestamp: new Date().toISOString(),
      version: '21',
      hookSecretConfigured: !!hookSecret,
      secrets: {
        resendConfigured: !!resendApiKey,
        hookSecretConfigured: !!hookSecret
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (req.method === 'POST') {
    console.log('📨 POST request received');

    try {
      const payload = await req.text();
      console.log('📄 Payload length:', payload.length);
      console.log('📋 Headers:', Object.keys(req.headers));

      // For now, just acknowledge the request
      return new Response(JSON.stringify({
        message: 'POST request processed',
        timestamp: new Date().toISOString(),
        version: '21',
        payloadLength: payload.length,
        headersCount: Object.keys(req.headers).length
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('❌ Error processing POST:', error);
      return new Response(JSON.stringify({
        error: 'Processing failed',
        details: error.message
      }), { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
});