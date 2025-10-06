#!/usr/bin/env node

/**
 * DEBUG SUPABASE TABLES
 * =====================
 * Prüft direkt was in den kritischen Tabellen ist
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function debugTables() {
  console.log('🔍 Debug Supabase Tables');
  console.log('=' .repeat(60));
  
  // 1. Check course_mapping
  console.log('\n1. course_mapping:');
  const { data: mappings, error: mError } = await supabase
    .from('course_mapping')
    .select('*')
    .limit(5);
  
  console.log('  Error:', mError?.message || 'none');
  console.log('  Count:', mappings?.length || 0);
  if (mappings && mappings.length > 0) {
    console.log('  Sample:', JSON.stringify(mappings[0], null, 2));
  }
  
  // 2. Check courses
  console.log('\n2. courses:');
  const { data: courses, error: cError } = await supabase
    .from('courses')
    .select('*')
    .limit(5);
  
  console.log('  Error:', cError?.message || 'none');
  console.log('  Count:', courses?.length || 0);
  if (courses && courses.length > 0) {
    console.log('  Sample:', JSON.stringify(courses[0], null, 2));
  }
  
  // 3. Check orders with course_id
  console.log('\n3. orders with course_id:');
  const { data: ordersWithCourse, error: owcError } = await supabase
    .from('orders')
    .select('id, ablefy_order_number, ablefy_product_id, course_id, buyer_email')
    .not('course_id', 'is', null)
    .limit(5);
  
  console.log('  Error:', owcError?.message || 'none');
  console.log('  Count:', ordersWithCourse?.length || 0);
  if (ordersWithCourse && ordersWithCourse.length > 0) {
    console.log('  Sample:');
    ordersWithCourse.forEach(o => {
      console.log(`    Order ${o.ablefy_order_number}: product_id=${o.ablefy_product_id} → course_id=${o.course_id}`);
    });
  }
  
  // 4. Check ALL schema tables
  console.log('\n4. List all tables in schema:');
  const { data: tables, error: tError } = await supabase.rpc('get_schema_tables');
  
  if (tError) {
    console.log('  Cannot list tables (RPC function missing)');
    
    // Try alternative: query pg_tables
    const { data: pgTables } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (pgTables) {
      console.log('  Tables found:', pgTables.map(t => t.tablename).join(', '));
    }
  } else {
    console.log('  Tables:', tables);
  }
}

debugTables().catch(console.error);

