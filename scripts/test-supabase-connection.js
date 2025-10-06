// Test Supabase Connection
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase Connection...\n');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Environment variables are missing! Please create .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('🔗 Testing basic connection...');

    // First, let's check what tables exist
    console.log('\n📋 Checking database tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('❌ Could not check tables, trying direct courses table...');
    } else {
      console.log('Available tables:', tables.map(t => t.table_name));
    }

    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Connection or table error:', error.message);

      // Let's try to see what columns exist
      console.log('\n🔍 Checking courses table structure...');
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'courses')
        .eq('table_schema', 'public');

      if (columnsError) {
        console.error('❌ Could not get column info:', columnsError.message);
      } else {
        console.log('📊 Courses table columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type})`);
        });
      }

      return;
    }

    console.log('✅ Basic connection successful');
    console.log('📊 Total courses in database:', data);

    // Now fetch actual courses with all available columns
    console.log('\n📚 Fetching courses...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(5);

    if (coursesError) {
      console.error('❌ Error fetching courses:', coursesError.message);
      return;
    }

    console.log(`✅ Found ${courses.length} courses:`);
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${JSON.stringify(course, null, 2)}`);
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

testConnection();
