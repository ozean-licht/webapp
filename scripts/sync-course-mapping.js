#!/usr/bin/env node

/**
 * SYNC COURSE MAPPING
 * ==================
 * Befüllt course_mapping Tabelle aus courses.ablefy_product_id
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function syncCourseMapping() {
  console.log('🔄 Synchronisiere Course Mapping...\n');
  
  try {
    // Get all courses with ablefy_product_id
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, ablefy_product_id')
      .not('ablefy_product_id', 'is', null);
    
    if (coursesError) {
      throw coursesError;
    }
    
    console.log(`📚 Gefunden: ${courses.length} Kurse mit ablefy_product_id`);
    
    // Transform to mapping format
    const mappings = courses.map(course => ({
      ablefy_product_id: parseInt(course.ablefy_product_id),
      course_id: course.id,
      course_title: course.title,
      is_active: true
    }));
    
    console.log('\n🔗 Beispiel-Mappings:');
    mappings.slice(0, 5).forEach(m => {
      console.log(`  ${m.ablefy_product_id} → ${m.course_id} (${m.course_title})`);
    });
    
    // Insert mappings
    console.log('\n💾 Füge Mappings in course_mapping ein...');
    
    const { data, error } = await supabase
      .from('course_mapping')
      .upsert(mappings, {
        onConflict: 'ablefy_product_id',
        ignoreDuplicates: false
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ ${mappings.length} Course Mappings erfolgreich synchronisiert!`);
    
    // Verify
    const { count } = await supabase
      .from('course_mapping')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Gesamt in course_mapping: ${count} Einträge`);
    
  } catch (error) {
    console.error('\n❌ Fehler:', error.message);
    process.exit(1);
  }
}

syncCourseMapping();
