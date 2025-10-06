#!/usr/bin/env node

/**
 * CHECK SUPABASE TABLES
 * ====================
 * Überprüft welche Tabellen bereits in Supabase existieren
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Check if credentials exist
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY oder SUPABASE_SERVICE_ROLE_KEY nicht in .env.local gefunden');
  console.log('\nVerfügbare Env Vars:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
  console.log('  SUPABASE_SERVICE_KEY:', !!process.env.SUPABASE_SERVICE_KEY ? '✅' : '❌');
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function checkTables() {
  console.log('🔍 Überprüfe Supabase Tabellen...\n');
  
  const tablesToCheck = [
    'courses',
    'course_mapping',
    'orders',
    'transactions',
    'user_roles'
  ];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count || 0} records`);
        
        // Get a sample record to see structure
        if (count > 0) {
          const { data: sampleData } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (sampleData && sampleData[0]) {
            console.log(`   Spalten: ${Object.keys(sampleData[0]).join(', ')}`);
          }
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n✅ Überprüfung abgeschlossen!');
}

checkTables();
