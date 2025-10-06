#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function checkStructure() {
  console.log('🔍 Überprüfe transactions Tabellen-Struktur...\n');
  
  // Try to insert an empty record to see what columns exist
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .limit(0);
  
  if (error) {
    console.error('❌ Fehler:', error.message);
    return;
  }
  
  console.log('✅ Tabelle existiert, aber hat keine Records zum Anzeigen der Struktur');
  console.log('\nVersuche eine Test-Insertion mit minimalen Daten...\n');
  
  // Try minimal insert
  const testData = {
    transaction_date: new Date().toISOString(),
    buyer_email: 'test@test.com',
    status: 'Ausstehend',
    typ: 'Zahlungseingang',
    zahlungsart: 'PayPal',
    faelliger_betrag: 0,
    bezahlt: 0
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('transactions')
    .insert(testData)
    .select();
  
  if (insertError) {
    console.error('❌ Insert Fehler:', insertError.message);
    console.log('\nFehlende oder inkompatible Spalten erkannt!');
  } else {
    console.log('✅ Test-Insert erfolgreich!');
    console.log('\nSpalten:', Object.keys(insertData[0]).join(', '));
    
    // Cleanup test record
    await supabase
      .from('transactions')
      .delete()
      .eq('id', insertData[0].id);
    console.log('🧹 Test-Record entfernt');
  }
}

checkStructure();
