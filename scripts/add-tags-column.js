#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addTagsColumn() {
  console.log('\n=== ADDING TAGS COLUMN TO COURSES TABLE ===\n');
  
  try {
    // Execute raw SQL to add tags column
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE courses 
        ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
        
        CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);
      `
    });
    
    if (error) {
      // If RPC doesn't exist, try direct approach
      console.log('RPC method not available, trying direct column check...');
      
      // Try to update a course with tags to see if column exists
      const { data: testData, error: testError } = await supabase
        .from('courses')
        .select('tags')
        .limit(1);
      
      if (testError && testError.message.includes('column')) {
        console.log('❌ Tags column does not exist. Please run the SQL manually:');
        console.log('\nALTER TABLE courses ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];');
        console.log('CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);\n');
        return false;
      } else if (testError) {
        console.log('❌ Error:', testError.message);
        return false;
      } else {
        console.log('✅ Tags column already exists!');
        return true;
      }
    } else {
      console.log('✅ Tags column added successfully!');
      return true;
    }
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    return false;
  }
}

addTagsColumn();

