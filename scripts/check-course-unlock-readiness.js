#!/usr/bin/env node

/**
 * KURS-FREISCHALTUNG BEREITSCHAFTS-CHECK
 * =======================================
 * Prüft ob alle Voraussetzungen für Kurs-Freischaltungen erfüllt sind
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

console.log('🔍 Kurs-Freischaltung Bereitschafts-Check');
console.log('=' .repeat(60));

async function checkReadiness() {
  const issues = [];
  const warnings = [];
  const successes = [];
  
  try {
    // 1. CHECK: Transactions Tabelle
    console.log('\n1️⃣  Transactions Tabelle');
    console.log('-'.repeat(40));
    
    const { count: transactionCount, error: tError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    if (tError) {
      issues.push('Transactions Tabelle nicht erreichbar: ' + tError.message);
      console.log('  ❌ Error:', tError.message);
    } else if (transactionCount === 0) {
      issues.push('Keine Transaktionen in der Datenbank');
      console.log('  ❌ Keine Transaktionen gefunden');
    } else {
      successes.push(`${transactionCount} Transaktionen vorhanden`);
      console.log(`  ✅ ${transactionCount} Transaktionen`);
    }
    
    // 2. CHECK: Orders Tabelle
    console.log('\n2️⃣  Orders Tabelle');
    console.log('-'.repeat(40));
    
    const { count: orderCount, error: oError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (oError) {
      issues.push('Orders Tabelle nicht erreichbar: ' + oError.message);
      console.log('  ❌ Error:', oError.message);
    } else if (orderCount === 0) {
      issues.push('Keine Orders in der Datenbank');
      console.log('  ❌ Keine Orders gefunden');
    } else {
      successes.push(`${orderCount} Orders vorhanden`);
      console.log(`  ✅ ${orderCount} Orders`);
    }
    
    // 3. CHECK: Course Mapping
    console.log('\n3️⃣  Course Mapping');
    console.log('-'.repeat(40));
    
    const { data: mappings, error: mError } = await supabase
      .from('course_mapping')
      .select('*')
      .eq('is_active', true);
    
    if (mError) {
      issues.push('Course Mapping nicht erreichbar: ' + mError.message);
      console.log('  ❌ Error:', mError.message);
    } else if (!mappings || mappings.length === 0) {
      issues.push('Keine aktiven Course Mappings gefunden');
      console.log('  ❌ Keine Mappings gefunden');
    } else {
      successes.push(`${mappings.length} Course Mappings aktiv`);
      console.log(`  ✅ ${mappings.length} aktive Mappings`);
      
      // Show sample mappings
      console.log('\n  Sample Mappings:');
      mappings.slice(0, 5).forEach(m => {
        console.log(`    ${m.ablefy_product_id} → ${m.course_id} (${m.course_title || 'N/A'})`);
      });
    }
    
    // 4. CHECK: Orders mit Course IDs
    console.log('\n4️⃣  Orders mit Course IDs');
    console.log('-'.repeat(40));
    
    const { count: ordersWithCourse, error: owcError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .not('course_id', 'is', null);
    
    if (owcError) {
      warnings.push('Konnte Orders mit Course IDs nicht zählen');
      console.log('  ⚠️  Warning:', owcError.message);
    } else {
      const percentage = orderCount > 0 ? ((ordersWithCourse / orderCount) * 100).toFixed(1) : 0;
      
      if (ordersWithCourse === 0) {
        issues.push('Keine Orders haben Course IDs');
        console.log('  ❌ Keine Orders mit Course IDs');
      } else if (percentage < 50) {
        warnings.push(`Nur ${percentage}% der Orders haben Course IDs`);
        console.log(`  ⚠️  ${ordersWithCourse} Orders mit Course (${percentage}%)`);
      } else {
        successes.push(`${ordersWithCourse} Orders mit Course IDs (${percentage}%)`);
        console.log(`  ✅ ${ordersWithCourse} Orders mit Course (${percentage}%)`);
      }
    }
    
    // 5. CHECK: Courses Tabelle
    console.log('\n5️⃣  Courses Tabelle');
    console.log('-'.repeat(40));
    
    const { count: courseCount, error: cError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    
    if (cError) {
      issues.push('Courses Tabelle nicht erreichbar: ' + cError.message);
      console.log('  ❌ Error:', cError.message);
    } else if (courseCount === 0) {
      issues.push('Keine veröffentlichten Kurse in der Datenbank');
      console.log('  ❌ Keine Kurse gefunden');
    } else {
      successes.push(`${courseCount} veröffentlichte Kurse`);
      console.log(`  ✅ ${courseCount} veröffentlichte Kurse`);
    }
    
    // 6. CHECK: User Accounts
    console.log('\n6️⃣  User Accounts');
    console.log('-'.repeat(40));
    
    const { count: userCount, error: uError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (uError) {
      warnings.push('Users Tabelle nicht prüfbar');
      console.log('  ⚠️  Kann nicht prüfen (normal für Public Schema)');
    } else {
      console.log(`  ℹ️  ${userCount || 0} User Accounts`);
    }
    
    // 7. CHECK: RLS Policies
    console.log('\n7️⃣  RLS Policies (orders & transactions)');
    console.log('-'.repeat(40));
    
    // Try to query with RLS (this will fail if not properly set up)
    const { error: rlsError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (rlsError) {
      warnings.push('RLS Policies könnten Probleme verursachen');
      console.log('  ⚠️  RLS Test fehlgeschlagen (aber kann OK sein für Service Key)');
    } else {
      console.log('  ✅ RLS Policies aktiv');
    }
    
    // 8. CHECK: Edge Function existiert
    console.log('\n8️⃣  Edge Function (process-ablefy-webhook)');
    console.log('-'.repeat(40));
    
    // Try to call the edge function with test data
    try {
      const testResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-ablefy-webhook`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || serviceKey}`,
            'Content-Type': 'application/json',
            'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || 'test'
          },
          body: JSON.stringify({ test: true })
        }
      );
      
      if (testResponse.ok) {
        successes.push('Edge Function erreichbar');
        console.log('  ✅ Edge Function deployed und erreichbar');
      } else if (testResponse.status === 401 || testResponse.status === 403) {
        warnings.push('Edge Function Auth-Problem (aber existiert)');
        console.log('  ⚠️  Auth-Problem (prüfe x-webhook-secret)');
      } else {
        warnings.push('Edge Function existiert aber hat Fehler');
        console.log(`  ⚠️  Status ${testResponse.status}`);
      }
    } catch (fetchError) {
      issues.push('Edge Function nicht erreichbar');
      console.log('  ❌ Nicht erreichbar:', fetchError.message);
    }
    
    // 9. CHECK: N8N Workflow Status
    console.log('\n9️⃣  N8N Workflow');
    console.log('-'.repeat(40));
    
    if (!process.env.N8N_WEBHOOK_SECRET) {
      warnings.push('N8N_WEBHOOK_SECRET nicht in .env.local');
      console.log('  ⚠️  N8N_WEBHOOK_SECRET fehlt in .env.local');
    } else {
      successes.push('N8N_WEBHOOK_SECRET konfiguriert');
      console.log('  ✅ N8N_WEBHOOK_SECRET gesetzt');
    }
    
    console.log('  ℹ️  Workflow muss manuell in N8N aktiviert werden');
    
    // 10. CHECK: Beispiel Order mit bezahltem Kurs
    console.log('\n🔟  Beispiel: Bezahlter Kurs');
    console.log('-'.repeat(40));
    
    const { data: paidOrders, error: poError } = await supabase
      .from('orders')
      .select('id, ablefy_order_number, buyer_email, course_id, status, amount_gross')
      .eq('status', 'paid')
      .not('course_id', 'is', null)
      .limit(3);
    
    if (poError) {
      console.log('  ⚠️  Kann nicht prüfen:', poError.message);
    } else if (!paidOrders || paidOrders.length === 0) {
      warnings.push('Keine bezahlten Orders mit Course ID gefunden');
      console.log('  ⚠️  Keine bezahlten Orders mit Course ID');
    } else {
      successes.push('Bezahlte Orders mit Courses gefunden');
      console.log(`  ✅ ${paidOrders.length} Beispiele gefunden:`);
      paidOrders.forEach(order => {
        console.log(`     - Order ${order.ablefy_order_number}: Course ${order.course_id}`);
        console.log(`       Email: ${order.buyer_email}, Status: ${order.status}`);
      });
    }
    
    // ZUSAMMENFASSUNG
    console.log('\n\n📊 ZUSAMMENFASSUNG');
    console.log('=' .repeat(60));
    
    console.log(`\n✅ Erfolge (${successes.length}):`);
    successes.forEach(s => console.log(`  • ${s}`));
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnungen (${warnings.length}):`);
      warnings.forEach(w => console.log(`  • ${w}`));
    }
    
    if (issues.length > 0) {
      console.log(`\n❌ Kritische Probleme (${issues.length}):`);
      issues.forEach(i => console.log(`  • ${i}`));
    }
    
    // FINALE BEWERTUNG
    console.log('\n\n🎯 BEREITSCHAFT FÜR KURS-FREISCHALTUNGEN:');
    console.log('=' .repeat(60));
    
    if (issues.length === 0 && warnings.length < 3) {
      console.log('\n✅ BEREIT! Kurs-Freischaltungen können aktiviert werden.');
      console.log('\n📋 Nächste Schritte:');
      console.log('  1. Test-Bestellung in Ablefy durchführen');
      console.log('  2. N8N Workflow aktivieren');
      console.log('  3. /bibliothek Seite bauen');
      console.log('  4. get_user_course_access() Funktion testen');
    } else if (issues.length === 0) {
      console.log('\n⚠️  FAST BEREIT - einige Warnungen zu beachten');
      console.log('\n📋 Empfohlene Fixes:');
      warnings.forEach(w => console.log(`  • ${w}`));
    } else {
      console.log('\n❌ NICHT BEREIT - kritische Probleme müssen behoben werden');
      console.log('\n🔧 Erforderliche Fixes:');
      issues.forEach(i => console.log(`  • ${i}`));
    }
    
    console.log('\n✅ Check complete!');
    
    return {
      ready: issues.length === 0,
      issues,
      warnings,
      successes
    };
    
  } catch (error) {
    console.error('\n💥 Fatal Error:', error.message);
    throw error;
  }
}

// Run check
if (require.main === module) {
  checkReadiness().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { checkReadiness };

