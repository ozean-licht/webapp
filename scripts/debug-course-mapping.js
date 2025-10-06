#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function debug() {
  console.log('🔍 Debug Course Mapping Problem...\n');
  
  // Get course_mapping entries
  const { data: mappings } = await supabase
    .from('course_mapping')
    .select('*')
    .limit(10);
  
  console.log('📋 Course Mapping Table (first 10):');
  console.log('ablefy_product_id | course_id');
  console.log('------------------|-----------');
  mappings.forEach(m => {
    console.log(`${m.ablefy_product_id} | ${m.course_id}`);
  });
  
  // Get sample transactions with product_id
  const { data: transactions } = await supabase
    .from('transactions')
    .select('product_id, produkt, course_id')
    .not('product_id', 'is', null)
    .limit(10);
  
  console.log('\n📋 Sample Transactions:');
  console.log('product_id | course_id | produkt');
  console.log('-----------|-----------|--------');
  transactions.forEach(t => {
    console.log(`${t.product_id} | ${t.course_id || 'NULL'} | ${t.produkt?.substring(0, 30)}`);
  });
  
  // Check if there's a match
  console.log('\n🔍 Checking for matches...');
  const productIds = transactions.map(t => t.product_id);
  const mappedProductIds = mappings.map(m => m.ablefy_product_id);
  
  const matches = productIds.filter(id => mappedProductIds.includes(id));
  console.log(`Matching product_ids: ${matches.length}/${productIds.length}`);
  console.log('Matches:', matches);
}

debug();
