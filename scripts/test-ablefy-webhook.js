#!/usr/bin/env node

/**
 * TEST ABLEFY WEBHOOK
 * ==================
 * Sendet einen Test-Request an die process-ablefy-webhook Edge Function
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

if (!SUPABASE_URL || !WEBHOOK_SECRET || !SUPABASE_ANON_KEY) {
  console.error('❌ Fehlende Umgebungsvariablen: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY oder N8N_WEBHOOK_SECRET');
  process.exit(1);
}

// Test Transaktion
const testTransaction = {
  trx_id: 999999999, // Test ID
  rechnungsnummer: 'TEST-12345',
  datum: '01.10.2025 10:00',
  erfolgt_am: '01.10.2025 10:01',
  status: 'Erfolgreich',
  typ: 'Zahlungseingang',
  zahlungsart: 'PayPal',
  order_number: 12345678,
  product_id: 419336, // Sterben für Anfänger
  produkt: 'Sterben für Anfänger - TEST',
  psp: 'paypal_rest',
  faelliger_betrag: 99.99,
  bezahlt: 99.99,
  bezahlt_minus_fee: 96.99,
  waehrung: 'EUR',
  fees_total: 3.00,
  fees_service: 3.00,
  fees_payment_provider: 0,
  vat_rate: 0,
  ust: 0,
  plan: 'Einmal',
  vorname: 'Test',
  nachname: 'Benutzer',
  email: 'test@ozean-licht.com',
  telefon: '0123456789',
  land: 'Deutschland',
  stadt: 'Berlin',
  strasse: 'Teststraße',
  hausnummer: '1',
  plz: 10115,
  account_type: 'new'
};

async function testWebhook() {
  console.log('🧪 Teste Ablefy Webhook...');
  console.log('=' .repeat(60));
  
  try {
    console.log(`🔗 URL: ${SUPABASE_URL}/functions/v1/process-ablefy-webhook`);
    console.log(`📝 Transaktion: ${testTransaction.trx_id} (${testTransaction.produkt})`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-ablefy-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-webhook-secret': WEBHOOK_SECRET
      },
      body: JSON.stringify(testTransaction)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Webhook erfolgreich getestet!');
      console.log('Antwort:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('\n❌ Webhook Test fehlgeschlagen!');
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error('Fehler:');
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('\n💥 Fehler beim Testen des Webhooks:', error.message);
  }
}

// Test ausführen
testWebhook();
