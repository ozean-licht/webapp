#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

async function checkIntegrity() {
  console.log('🔍 ABLEFY DATA INTEGRITY CHECK\n');
  console.log('='.repeat(60));
  
  // 1. Basic counts
  const { count: transCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: mappingsCount } = await supabase.from('course_mapping').select('*', { count: 'exact', head: true });
  const { count: usersCount } = await supabase.from('auth.users').select('*', { count: 'exact', head: true }).eq('aud', 'authenticated');
  
  console.log('\n📊 BASIC COUNTS:');
  console.log(`  Transactions: ${transCount}`);
  console.log(`  Orders: ${ordersCount}`);
  console.log(`  Course Mappings: ${mappingsCount}`);
  console.log(`  Auth Users: ${usersCount || 'N/A (check manually)'}`);
  
  // 2. Linking Status
  const { data: linkStats } = await supabase.rpc('exec_sql', { query: `
    SELECT 
      COUNT(*) FILTER (WHERE order_id IS NOT NULL) as trans_with_order,
      COUNT(*) FILTER (WHERE course_id IS NOT NULL) as trans_with_course,
      COUNT(*) FILTER (WHERE user_id IS NOT NULL) as trans_with_user,
      COUNT(*) as total_trans
    FROM transactions;
  ` }).single().catch(() => null);
  
  if (!linkStats) {
    // Fallback
    const { data: t } = await supabase.from('transactions').select('order_id, course_id, user_id');
    const withOrder = t.filter(x => x.order_id).length;
    const withCourse = t.filter(x => x.course_id).length;
    const withUser = t.filter(x => x.user_id).length;
    
    console.log('\n🔗 TRANSACTION LINKING:');
    console.log(`  ✅ With Order: ${withOrder}/${t.length} (${((withOrder/t.length)*100).toFixed(1)}%)`);
    console.log(`  ✅ With Course: ${withCourse}/${t.length} (${((withCourse/t.length)*100).toFixed(1)}%)`);
    console.log(`  ⚠️  With User: ${withUser}/${t.length} (${((withUser/t.length)*100).toFixed(1)}%)`);
  }
  
  // 3. Order Status
  const { data: orderStatus } = await supabase
    .from('orders')
    .select('status, course_id, user_id');
  
  const paidOrders = orderStatus.filter(o => o.status === 'paid').length;
  const ordersWithCourse = orderStatus.filter(o => o.course_id).length;
  const ordersWithUser = orderStatus.filter(o => o.user_id).length;
  
  console.log('\n📦 ORDER STATUS:');
  console.log(`  Paid Orders: ${paidOrders}/${orderStatus.length}`);
  console.log(`  With Course: ${ordersWithCourse}/${orderStatus.length} (${((ordersWithCourse/orderStatus.length)*100).toFixed(1)}%)`);
  console.log(`  With User: ${ordersWithUser}/${orderStatus.length} (${((ordersWithUser/orderStatus.length)*100).toFixed(1)}%)`);
  
  // 4. Critical Issues
  console.log('\n⚠️  CRITICAL ISSUES:');
  
  const issues = [];
  
  if (withOrder < t.length * 0.95) issues.push('❌ <95% Transactions linked to Orders');
  if (ordersWithUser < 20) issues.push(`⚠️  Only ${ordersWithUser} Orders linked to Users (expected - users not created yet)`);
  if (ordersWithCourse < orderStatus.length * 0.6) issues.push(`⚠️  Only ${((ordersWithCourse/orderStatus.length)*100).toFixed(1)}% Orders have Courses (8k legacy courses deleted)`);
  
  if (issues.length === 0) {
    console.log('  ✅ No critical issues!');
  } else {
    issues.forEach(i => console.log(`  ${i}`));
  }
  
  // 5. Financial Check
  const { data: financial } = await supabase
    .from('transactions')
    .select('bezahlt, fees_total, status');
  
  const total = financial.reduce((sum, t) => sum + (t.bezahlt || 0), 0);
  const fees = financial.reduce((sum, t) => sum + (t.fees_total || 0), 0);
  const successful = financial.filter(t => t.status === 'Erfolgreich').length;
  
  console.log('\n💰 FINANCIAL:');
  console.log(`  Total Revenue: €${total.toFixed(2)}`);
  console.log(`  Total Fees: €${fees.toFixed(2)}`);
  console.log(`  Net: €${(total - fees).toFixed(2)}`);
  console.log(`  Successful: ${successful}/${financial.length}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Data Integrity Check Complete!\n');
}

checkIntegrity();
