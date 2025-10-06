#!/usr/bin/env node

/**
 * CHECK COURSES TABLE
 * ==================
 * Überprüft die Struktur der courses Tabelle in Supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkTable() {
  console.log('🔍 Überprüfe courses Tabelle in Supabase...\n');
  
  try {
    // Query information_schema to get table structure
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'courses'
        ORDER BY ordinal_position;
      `
    });

    if (error) {
      // Fallback: Try to get a sample record
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .limit(1);
      
      if (courseError) {
        throw courseError;
      }
      
      console.log('✅ Courses Tabelle gefunden!');
      console.log('\nBeispiel-Datensatz:');
      console.log(JSON.stringify(courseData[0], null, 2));
      
      console.log('\nSpalten:');
      Object.keys(courseData[0]).forEach(key => {
        console.log(`  ${key}: ${typeof courseData[0][key]}`);
      });
    } else {
      console.log('✅ Tabellen-Struktur:');
      console.log(data);
    }
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  }
}

checkTable();
