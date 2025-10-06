#!/usr/bin/env node

/**
 * CHECK ORDERS-TRANSACTIONS RELATIONSHIP
 * =======================================
 * Prüft das Verhältnis zwischen Orders und Transactions
 * 1 Order : N Transactions (aber 1 Transaction : 1 Order)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

console.log('🔍 Orders-Transactions Relationship Check');
console.log('=' .repeat(60));

async function checkRelationship() {
  try {
    // 1. Check neueste Transactions (seit heute Nacht)
    console.log('\n1️⃣  Neueste Transactions (seit heute Nacht)');
    console.log('-'.repeat(60));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    
    const { data: newTransactions, error: tError } = await supabase
      .from('transactions')
      .select('trx_id, order_number, transaction_date, buyer_email, bezahlt, status, product_id, produkt')
      .gte('transaction_date', todayISO)
      .order('transaction_date', { ascending: false })
      .limit(20);
    
    if (tError) {
      console.log('  ❌ Error:', tError.message);
    } else {
      console.log(`  ✅ ${newTransactions.length} Transactions seit heute 00:00`);
      
      if (newTransactions.length > 0) {
        console.log('\n  Details:');
        newTransactions.forEach((t, idx) => {
          console.log(`\n  ${idx + 1}. TRX ${t.trx_id}`);
          console.log(`     Date: ${t.transaction_date}`);
          console.log(`     Order#: ${t.order_number || 'N/A'}`);
          console.log(`     Email: ${t.buyer_email}`);
          console.log(`     Amount: €${t.bezahlt || 0}`);
          console.log(`     Status: ${t.status}`);
          console.log(`     Product: ${t.product_id} - ${t.produkt || 'N/A'}`);
        });
      }
    }
    
    // 2. Check ob diese Transactions Orders haben
    console.log('\n\n2️⃣  Prüfe ob Orders für diese Transactions existieren');
    console.log('-'.repeat(60));
    
    if (newTransactions && newTransactions.length > 0) {
      const orderNumbers = newTransactions
        .map(t => t.order_number)
        .filter(on => on);
      
      console.log(`  ${orderNumbers.length} Transactions haben order_number`);
      
      if (orderNumbers.length > 0) {
        // Check unique order numbers
        const uniqueOrderNumbers = [...new Set(orderNumbers)];
        console.log(`  ${uniqueOrderNumbers.length} unique order_numbers`);
        
        // Check if orders exist
        const { data: existingOrders, error: oError } = await supabase
          .from('orders')
          .select('id, ablefy_order_number, buyer_email, created_at, course_id')
          .in('ablefy_order_number', uniqueOrderNumbers);
        
        if (oError) {
          console.log('  ❌ Error checking orders:', oError.message);
        } else {
          console.log(`  ✅ ${existingOrders.length} Orders gefunden in DB`);
          
          const missingOrderNumbers = uniqueOrderNumbers.filter(
            on => !existingOrders.find(o => o.ablefy_order_number === on)
          );
          
          if (missingOrderNumbers.length > 0) {
            console.log(`\n  ⚠️  FEHLENDE ORDERS: ${missingOrderNumbers.length}`);
            console.log('  Missing order_numbers:');
            missingOrderNumbers.forEach(on => {
              const trx = newTransactions.find(t => t.order_number === on);
              console.log(`    - ${on} (TRX ${trx.trx_id}, €${trx.bezahlt})`);
            });
          } else {
            console.log('  ✅ Alle Orders vorhanden!');
          }
        }
      }
    }
    
    // 3. Check Order:Transaction Verhältnis
    console.log('\n\n3️⃣  Order:Transaction Verhältnis');
    console.log('-'.repeat(60));
    
    // Check transactions mit order_id (FK)
    const { count: transWithOrder } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .not('order_id', 'is', null);
    
    const { count: totalTrans } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`  Total Transactions: ${totalTrans}`);
    console.log(`  Mit order_id (FK): ${transWithOrder || 0} (${((transWithOrder/totalTrans)*100).toFixed(1)}%)`);
    
    // Check transactions mit order_number (Ablefy field)
    const { count: transWithOrderNumber } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .not('order_number', 'is', null);
    
    console.log(`  Mit order_number: ${transWithOrderNumber} (${((transWithOrderNumber/totalTrans)*100).toFixed(1)}%)`);
    
    // 4. Check Orders mit mehreren Transactions
    console.log('\n\n4️⃣  Orders mit mehreren Transactions (Zahlungspläne)');
    console.log('-'.repeat(60));
    
    // Get transactions grouped by order_number
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select('order_number, trx_id, bezahlt, status')
      .not('order_number', 'is', null)
      .order('order_number');
    
    if (allTransactions) {
      const orderGroups = {};
      allTransactions.forEach(t => {
        if (!orderGroups[t.order_number]) {
          orderGroups[t.order_number] = [];
        }
        orderGroups[t.order_number].push(t);
      });
      
      const ordersWithMultipleTrans = Object.entries(orderGroups)
        .filter(([_, trans]) => trans.length > 1)
        .sort((a, b) => b[1].length - a[1].length);
      
      console.log(`  Orders mit mehreren Transactions: ${ordersWithMultipleTrans.length}`);
      
      if (ordersWithMultipleTrans.length > 0) {
        console.log('\n  Top 10 Orders mit meisten Transactions:');
        ordersWithMultipleTrans.slice(0, 10).forEach(([orderNum, trans]) => {
          const total = trans.reduce((sum, t) => sum + (parseFloat(t.bezahlt) || 0), 0);
          console.log(`    Order ${orderNum}: ${trans.length} Transactions, €${total.toFixed(2)} total`);
        });
      }
    }
    
    // 5. Check Foreign Key Relationship
    console.log('\n\n5️⃣  Foreign Key Relationship (order_id)');
    console.log('-'.repeat(60));
    
    // Sample transactions with order_id
    const { data: sampleLinked } = await supabase
      .from('transactions')
      .select('trx_id, order_number, order_id')
      .not('order_id', 'is', null)
      .limit(5);
    
    if (sampleLinked && sampleLinked.length > 0) {
      console.log('  ✅ Beispiele von verlinkten Transactions:');
      sampleLinked.forEach(t => {
        console.log(`    TRX ${t.trx_id}: order_number=${t.order_number}, order_id=${t.order_id}`);
      });
    } else {
      console.log('  ⚠️  Keine Transactions mit order_id (FK) gefunden!');
      console.log('  Das bedeutet: Linking zwischen transactions und orders fehlt!');
    }
    
    // 6. DIAGNOSE
    console.log('\n\n🔍 DIAGNOSE');
    console.log('=' .repeat(60));
    
    const issues = [];
    const warnings = [];
    
    if (newTransactions && newTransactions.length > 0) {
      const orderNumbers = newTransactions.map(t => t.order_number).filter(on => on);
      if (orderNumbers.length < newTransactions.length) {
        warnings.push(`${newTransactions.length - orderNumbers.length} neue Transactions haben keine order_number`);
      }
    }
    
    if (!transWithOrder || transWithOrder === 0) {
      issues.push('Keine Transactions haben order_id (FK) - Foreign Key Link fehlt!');
    } else if (transWithOrder < totalTrans * 0.5) {
      warnings.push(`Nur ${((transWithOrder/totalTrans)*100).toFixed(1)}% der Transactions haben order_id (FK)`);
    }
    
    if (issues.length > 0) {
      console.log('\n❌ KRITISCHE PROBLEME:');
      issues.forEach(i => console.log(`  • ${i}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  WARNUNGEN:');
      warnings.forEach(w => console.log(`  • ${w}`));
    }
    
    if (issues.length === 0 && warnings.length === 0) {
      console.log('\n✅ Alles OK!');
    }
    
    // 7. LÖSUNG
    console.log('\n\n💡 LÖSUNG');
    console.log('=' .repeat(60));
    console.log('\nWenn Orders fehlen:');
    console.log('  1. Orders müssen auch importiert werden (nicht nur Transactions)');
    console.log('  2. Edge Function muss Orders UND Transactions erstellen');
    console.log('  3. Linking-Script ausführen: link_transactions_to_orders()');
    
    console.log('\nWenn order_id (FK) fehlt:');
    console.log('  SQL ausführen:');
    console.log('  ```sql');
    console.log('  UPDATE transactions t');
    console.log('  SET order_id = o.id');
    console.log('  FROM orders o');
    console.log('  WHERE t.order_number = o.ablefy_order_number');
    console.log('  AND t.order_id IS NULL;');
    console.log('  ```');
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  checkRelationship().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { checkRelationship };
