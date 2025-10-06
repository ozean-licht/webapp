#!/usr/bin/env node

/**
 * SYNC COURSE MAPPING FROM COURSES
 * =================================
 * Füllt die course_mapping Tabelle aus den courses Tabelle
 * Nutzt ablefy_product_id aus courses um das Mapping zu erstellen
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

console.log('🔄 Sync Course Mapping from Courses');
console.log('=' .repeat(60));

async function syncCourseMapping() {
  try {
    // 1. Get all courses with ablefy_product_id
    console.log('\n📚 Fetching courses with ablefy_product_id...');
    const { data: courses, error: cError } = await supabase
      .from('courses')
      .select('id, title, ablefy_product_id')
      .not('ablefy_product_id', 'is', null);
    
    if (cError) {
      throw new Error(`Cannot fetch courses: ${cError.message}`);
    }
    
    console.log(`  ✅ Found ${courses.length} courses with Ablefy Product IDs`);
    
    if (courses.length === 0) {
      console.log('\n⚠️  No courses with ablefy_product_id found!');
      console.log('   This is expected if courses are not synced from Airtable yet.');
      return;
    }
    
    // 2. Clear existing course_mapping
    console.log('\n🗑️  Clearing existing course_mapping...');
    const { error: deleteError } = await supabase
      .from('course_mapping')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.log(`  ⚠️  Could not clear: ${deleteError.message}`);
    } else {
      console.log('  ✅ Cleared');
    }
    
    // 3. Transform courses to course_mapping format
    const mappings = courses.map(course => ({
      ablefy_product_id: String(course.ablefy_product_id),
      course_id: course.id,
      course_title: course.title,
      is_active: true
    }));
    
    // 4. Insert new mappings
    console.log(`\n💾 Inserting ${mappings.length} course mappings...`);
    
    const { data: inserted, error: insertError } = await supabase
      .from('course_mapping')
      .insert(mappings)
      .select();
    
    if (insertError) {
      throw new Error(`Cannot insert mappings: ${insertError.message}`);
    }
    
    console.log(`  ✅ Inserted ${inserted.length} mappings`);
    
    // 5. Show sample mappings
    console.log('\n📋 Sample Mappings:');
    console.log('-'.repeat(60));
    inserted.slice(0, 10).forEach(m => {
      console.log(`  ${m.ablefy_product_id} → ${m.course_id} (${m.course_title})`);
    });
    
    if (inserted.length > 10) {
      console.log(`  ... and ${inserted.length - 10} more`);
    }
    
    // 6. Verify
    console.log('\n✅ Verification:');
    const { count: verifyCount } = await supabase
      .from('course_mapping')
      .select('*', { count: 'exact', head: true });
    
    console.log(`  Course Mappings in DB: ${verifyCount}`);
    
    console.log('\n✅ Course mapping sync complete!');
    
    return inserted;
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  syncCourseMapping().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { syncCourseMapping };

