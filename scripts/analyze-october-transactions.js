#!/usr/bin/env node

/**
 * OKTOBER TRANSAKTIONEN ANALYSE
 * ==============================
 * Prüft welche Oktober 2025 Transaktionen in Airtable sind
 * und welche in Supabase fehlen
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy';
const AIRTABLE_TRANSACTIONS_TABLE = 'tblqaRqGbbYKRpE6W';

// Initialize Supabase
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

console.log('🔍 Analysiere Oktober 2025 Transaktionen');
console.log('=' .repeat(60));

// Parse date strings
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }
  
  // Parse DD.MM.YYYY HH:mm format
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
  if (match) {
    const [_, day, month, year, hour, minute] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
  }
  
  return null;
}

// Fetch ALL records from Airtable with pagination
async function fetchAllAirtableRecords() {
  let allRecords = [];
  let offset = null;
  
  console.log('\n📥 Fetching ALL transactions from Airtable...');
  
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TRANSACTIONS_TABLE}`);
    url.searchParams.append('pageSize', '100');
    if (offset) {
      url.searchParams.append('offset', offset);
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    const data = await response.json();
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
    
    if (offset) {
      console.log(`  ... fetched ${allRecords.length} so far`);
    }
  } while (offset);
  
  console.log(`  ✅ Total: ${allRecords.length} transactions`);
  return allRecords;
}

async function analyzeOctoberTransactions() {
  try {
    // 1. Get ALL Airtable transactions
    const airtableRecords = await fetchAllAirtableRecords();
    
    // 2. Filter for October 2025
    const octoberTransactions = airtableRecords.filter(record => {
      const dateStr = record.fields.datum;
      if (!dateStr) return false;
      
      const date = parseDate(dateStr);
      if (!date) return false;
      
      // Check if October 2025
      return date.getMonth() === 9 && date.getFullYear() === 2025; // October is month 9 (0-indexed)
    });
    
    console.log('\n📊 Oktober 2025 in Airtable:');
    console.log('=' .repeat(60));
    console.log(`  Total: ${octoberTransactions.length} transactions`);
    
    if (octoberTransactions.length > 0) {
      // Sort by date
      octoberTransactions.sort((a, b) => {
        const dateA = parseDate(a.fields.datum);
        const dateB = parseDate(b.fields.datum);
        return dateA - dateB;
      });
      
      const earliest = parseDate(octoberTransactions[0].fields.datum);
      const latest = parseDate(octoberTransactions[octoberTransactions.length - 1].fields.datum);
      
      console.log(`  Earliest: ${earliest.toISOString()}`);
      console.log(`  Latest: ${latest.toISOString()}`);
      
      // Show some sample trx_ids
      console.log('\n  Sample TRX IDs:');
      octoberTransactions.slice(0, 5).forEach(record => {
        console.log(`    - ${record.fields.trx_id} (${record.fields.datum})`);
      });
    }
    
    // 3. Check what's in Supabase for October
    console.log('\n\n📊 Oktober 2025 in Supabase:');
    console.log('=' .repeat(60));
    
    const { data: supabaseOctober, error } = await supabase
      .from('transactions')
      .select('trx_id, transaction_date, datum_raw, status, bezahlt')
      .gte('transaction_date', '2025-10-01T00:00:00Z')
      .lt('transaction_date', '2025-11-01T00:00:00Z')
      .order('transaction_date', { ascending: true });
    
    if (error) {
      console.error('  ❌ Error querying Supabase:', error.message);
    } else {
      console.log(`  Total: ${supabaseOctober.length} transactions`);
      
      if (supabaseOctober.length > 0) {
        const earliest = new Date(supabaseOctober[0].transaction_date);
        const latest = new Date(supabaseOctober[supabaseOctober.length - 1].transaction_date);
        
        console.log(`  Earliest: ${earliest.toISOString()}`);
        console.log(`  Latest: ${latest.toISOString()}`);
        
        console.log('\n  Sample TRX IDs:');
        supabaseOctober.slice(0, 5).forEach(record => {
          console.log(`    - ${record.trx_id} (${record.transaction_date})`);
        });
      }
    }
    
    // 4. Find missing transactions
    console.log('\n\n🔍 Fehlende Transaktionen:');
    console.log('=' .repeat(60));
    
    const supabaseTrxIds = new Set(supabaseOctober?.map(t => t.trx_id) || []);
    const missingTransactions = octoberTransactions.filter(record => {
      return record.fields.trx_id && !supabaseTrxIds.has(record.fields.trx_id);
    });
    
    console.log(`  Missing: ${missingTransactions.length} transactions`);
    
    if (missingTransactions.length > 0) {
      console.log('\n  ⚠️  Details der fehlenden Transaktionen:');
      console.log('  ' + '-'.repeat(58));
      
      missingTransactions.forEach((record, idx) => {
        if (idx < 10) { // Show first 10
          const fields = record.fields;
          console.log(`\n  ${idx + 1}. TRX ID: ${fields.trx_id}`);
          console.log(`     Datum: ${fields.datum}`);
          console.log(`     Status: ${fields.status}`);
          console.log(`     Betrag: €${fields.bezahlt || 0}`);
          console.log(`     Produkt: ${fields.produkt || 'N/A'}`);
          console.log(`     Email: ${fields.email || 'N/A'}`);
        }
      });
      
      if (missingTransactions.length > 10) {
        console.log(`\n  ... und ${missingTransactions.length - 10} weitere`);
      }
      
      // Calculate financial impact
      let totalMissing = 0;
      missingTransactions.forEach(record => {
        if (record.fields.bezahlt) {
          totalMissing += parseFloat(record.fields.bezahlt);
        }
      });
      
      console.log('\n  💰 Finanzieller Impact:');
      console.log(`     Fehlende Summe: €${totalMissing.toFixed(2)}`);
    } else {
      console.log('  ✅ Alle Oktober-Transaktionen sind in Supabase!');
    }
    
    // 5. Check date range in Supabase
    console.log('\n\n📅 Kompletter Datumsbereich in Supabase:');
    console.log('=' .repeat(60));
    
    const { data: dateRange } = await supabase
      .from('transactions')
      .select('transaction_date')
      .order('transaction_date', { ascending: true })
      .limit(1);
    
    const { data: dateRangeMax } = await supabase
      .from('transactions')
      .select('transaction_date')
      .order('transaction_date', { ascending: false })
      .limit(1);
    
    if (dateRange && dateRange[0] && dateRangeMax && dateRangeMax[0]) {
      console.log(`  Earliest: ${dateRange[0].transaction_date}`);
      console.log(`  Latest: ${dateRangeMax[0].transaction_date}`);
    }
    
    // 6. Diagnose: Warum fehlen die Oktober-Transaktionen?
    console.log('\n\n🔍 DIAGNOSE:');
    console.log('=' .repeat(60));
    
    if (missingTransactions.length > 0) {
      console.log('\n  Mögliche Gründe:');
      console.log('  1. Import-Script wurde VOR Oktober-Transaktionen ausgeführt');
      console.log('  2. Filter-Bedingung im Import-Script schließt Oktober aus');
      console.log('  3. Date-Parsing Fehler bei neuen Transaktionen');
      console.log('  4. Airtable Webhook wurde noch nicht eingerichtet');
      
      console.log('\n  ✅ LÖSUNG:');
      console.log('  1. Führe Import nochmal aus: node scripts/import-ablefy-transactions.js import');
      console.log('  2. ODER: Richte N8N Webhook ein für Echtzeit-Sync');
      console.log('  3. ODER: Importiere nur fehlende Transaktionen');
    }
    
    console.log('\n✅ Analyse complete!');
    
    // Return data for potential follow-up
    return {
      airtableTotal: airtableRecords.length,
      octoberInAirtable: octoberTransactions.length,
      octoberInSupabase: supabaseOctober?.length || 0,
      missing: missingTransactions.length,
      missingTransactions
    };
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    throw error;
  }
}

// Run analysis
if (require.main === module) {
  analyzeOctoberTransactions().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { analyzeOctoberTransactions };

