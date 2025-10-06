#!/usr/bin/env node

/**
 * SET WEBHOOK SECRET
 * =================
 * Setzt den N8N_WEBHOOK_SECRET in Supabase Edge Functions
 */

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error('❌ N8N_WEBHOOK_SECRET nicht in .env.local gefunden');
  process.exit(1);
}

console.log('🔑 Setze N8N_WEBHOOK_SECRET in Supabase Edge Functions...');

try {
  execSync(`npx supabase secrets set N8N_WEBHOOK_SECRET="${WEBHOOK_SECRET}"`, {
    stdio: 'inherit'
  });
  console.log('✅ Secret erfolgreich gesetzt!');
} catch (error) {
  console.error('❌ Fehler beim Setzen des Secrets:', error.message);
  process.exit(1);
}
