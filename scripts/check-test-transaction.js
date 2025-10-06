#!/usr/bin/env node

/**
 * CHECK TEST TRANSACTION
 * ======================
 * Prüft die neueste Transaction und ob automatisch eine Order erstellt wurde
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

console.log('🔍 Check Test Transaction');
console.log('=' .repeat(60));

async function checkTestTransaction() {
  try {
    // 1. Get neueste Transactions (letzte 10 Minuten)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    console.log('\n1️⃣  Neueste Transactions (letzte 10 Minuten)');
    console.log('-'.repeat(60));
    
    const { data: recentTransactions, error: tError } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false });
    
    if (tError) {
      console.log('  ❌ Error:', tError.message);
      return;
    }
    
    console.log(`  ✅ ${recentTransactions.length} Transactions in den letzten 10 Minuten`);
    
    if (recentTransactions.length === 0) {
      console.log('\n  ℹ️  Keine neuen Transactions in den letzten 10 Minuten');
      console.log('  Prüfe die letzten 5 Transactions stattdessen...');
      
      const { data: lastFive } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (lastFive && lastFive.length > 0) {
        console.log('\n  Letzte 5 Transactions:');
        lastFive.forEach((t, idx) => {
          console.log(`\n  ${idx + 1}. TRX ${t.trx_id}`);
          console.log(`     Created: ${t.created_at}`);
          console.log(`     Date: ${t.transaction_date}`);
          console.log(`     Email: ${t.buyer_email}`);
          console.log(`     Amount: €${t.bezahlt || 0}`);
          console.log(`     Status: ${t.status}`);
          console.log(`     Order#: ${t.order_number || 'N/A'}`);
          console.log(`     order_id: ${t.order_id || 'NULL'}`);
          console.log(`     Product: ${t.product_id} - ${t.produkt || 'N/A'}`);
        });
      }
      
      return;
    }
    
    // 2. Details der neuesten Transactions
    console.log('\n  Details:');
    recentTransactions.forEach((t, idx) => {
      console.log(`\n  ${idx + 1}. TRX ${t.trx_id}`);
      console.log(`     Created: ${t.created_at}`);
      console.log(`     Transaction Date: ${t.transaction_date}`);
      console.log(`     Email: ${t.buyer_email}`);
      console.log(`     Amount: €${t.bezahlt || 0}`);
      console.log(`     Status: ${t.status}`);
      console.log(`     Order Number: ${t.order_number || 'N/A'}`);
      console.log(`     order_id (FK): ${t.order_id || 'NULL'}`);
      console.log(`     Product ID: ${t.product_id}`);
      console.log(`     Product: ${t.produkt || 'N/A'}`);
      console.log(`     Source: ${t.source_platform || 'N/A'}`);
      console.log(`     Imported from Ablefy: ${t.imported_from_ablefy ? 'Yes' : 'No'}`);
    });
    
    // 3. Check ob Orders für diese Transactions existieren
    console.log('\n\n2️⃣  Prüfe Orders für diese Transactions');
    console.log('-'.repeat(60));
    
    for (const transaction of recentTransactions) {
      console.log(`\n  Transaction ${transaction.trx_id}:`);
      
      if (!transaction.order_number) {
        console.log('    ⚠️  Keine order_number vorhanden!');
        continue;
      }
      
      // Check by order_number
      const { data: orderByNumber } = await supabase
        .from('orders')
        .select('*')
        .eq('ablefy_order_number', transaction.order_number)
        .single();
      
      if (!orderByNumber) {
        console.log(`    ❌ FEHLT! Order ${transaction.order_number} nicht in DB`);
        console.log(`       → Order muss manuell erstellt werden!`);
        
        // Show what the order should look like
        console.log('\n    📋 Order sollte sein:');
        console.log(`       Order Number: ${transaction.order_number}`);
        console.log(`       Email: ${transaction.buyer_email}`);
        console.log(`       Product ID: ${transaction.product_id}`);
        console.log(`       Amount: €${transaction.bezahlt || 0}`);
        
        // Check in Airtable
        console.log('\n    🔍 Check in Airtable:');
        console.log(`       Gehe zu ablefy_orders Tabelle`);
        console.log(`       Suche order_number: ${transaction.order_number}`);
        
      } else {
        console.log(`    ✅ Order existiert!`);
        console.log(`       Order ID: ${orderByNumber.id}`);
        console.log(`       Email: ${orderByNumber.buyer_email}`);
        console.log(`       Course ID: ${orderByNumber.course_id || 'NULL'}`);
        console.log(`       Status: ${orderByNumber.status}`);
        console.log(`       Created: ${orderByNumber.created_at}`);
        
        // Check if linked
        if (transaction.order_id === orderByNumber.id) {
          console.log(`    ✅ Transaction ist verlinkt (order_id stimmt)`);
        } else {
          console.log(`    ⚠️  Transaction ist NICHT verlinkt!`);
          console.log(`       transaction.order_id = ${transaction.order_id}`);
          console.log(`       order.id = ${orderByNumber.id}`);
          console.log(`       → Linking SQL ausführen!`);
        }
      }
    }
    
    // 4. Check Edge Function Status
    console.log('\n\n3️⃣  Edge Function Check');
    console.log('-'.repeat(60));
    
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-ablefy-webhook`;
    console.log(`  URL: ${edgeFunctionUrl}`);
    
    // Try to ping the function
    try {
      const testPayload = {
        test: true,
        trx_id: 'test-check'
      };
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || serviceKey}`,
          'Content-Type': 'application/json',
          'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || 'test'
        },
        body: JSON.stringify(testPayload)
      });
      
      const status = response.status;
      console.log(`  Status Code: ${status}`);
      
      if (status === 200) {
        console.log('  ✅ Edge Function deployed und erreichbar');
      } else if (status === 400) {
        console.log('  ⚠️  400 (normal bei Test-Payload)');
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}`);
      } else if (status === 401 || status === 403) {
        console.log('  ❌ Auth-Fehler (prüfe x-webhook-secret)');
      } else {
        console.log(`  ⚠️  Unerwarteter Status: ${status}`);
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 200)}`);
      }
    } catch (fetchError) {
      console.log('  ❌ Edge Function nicht erreichbar:', fetchError.message);
    }
    
    // 5. Diagnose
    console.log('\n\n🔍 DIAGNOSE');
    console.log('=' .repeat(60));
    
    const missingOrders = [];
    const needsLinking = [];
    
    for (const t of recentTransactions) {
      if (!t.order_number) continue;
      
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('ablefy_order_number', t.order_number)
        .single();
      
      if (!order) {
        missingOrders.push(t);
      } else if (t.order_id !== order.id) {
        needsLinking.push({ transaction: t, order });
      }
    }
    
    console.log('\n📊 Status:');
    console.log(`  Neueste Transactions: ${recentTransactions.length}`);
    console.log(`  Fehlende Orders: ${missingOrders.length}`);
    console.log(`  Benötigen Linking: ${needsLinking.length}`);
    
    if (missingOrders.length > 0) {
      console.log('\n❌ PROBLEM: Orders wurden nicht automatisch erstellt!');
      console.log('\n  Mögliche Ursachen:');
      console.log('  1. N8N Workflow ist nicht aktiv');
      console.log('  2. Airtable Webhook ist nicht konfiguriert');
      console.log('  3. Edge Function erstellt nur Transactions, keine Orders');
      console.log('  4. Transaction kam direkt nach Supabase (nicht via Webhook)');
      
      console.log('\n  💡 LÖSUNG:');
      console.log('  1. Prüfe ob Transaction in Airtable ist');
      console.log('  2. Wenn JA: Importiere Order aus Airtable:');
      console.log('     node scripts/import-missing-orders.js');
      console.log('  3. Wenn NEIN: Transaction kam direkt - Edge Function Problem');
    }
    
    if (needsLinking.length > 0) {
      console.log('\n⚠️  WARNING: Transactions benötigen Linking!');
      console.log('\n  💡 LÖSUNG:');
      console.log('  Führe SQL aus: sql/link-orders-and-map-courses.sql');
    }
    
    if (missingOrders.length === 0 && needsLinking.length === 0) {
      console.log('\n✅ Alles OK! Transactions und Orders sind korrekt verknüpft.');
    }
    
    // 6. Automatisches Erstellen von fehlenden Orders
    if (missingOrders.length > 0) {
      console.log('\n\n4️⃣  Automatisches Erstellen von fehlenden Orders');
      console.log('-'.repeat(60));
      
      console.log(`  ⚠️  ${missingOrders.length} Orders fehlen`);
      console.log('  Möchtest du diese aus Airtable importieren?');
      console.log('  → Führe aus: node scripts/import-missing-orders.js');
    }
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  checkTestTransaction().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { checkTestTransaction };
