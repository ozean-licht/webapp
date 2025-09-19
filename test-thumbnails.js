// Test Thumbnail Loading
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Thumbnail Loading...\n');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Environment variables missing');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const https = require('https');

async function testThumbnailLoading() {
  try {
    console.log('📚 Fetching courses with thumbnail URLs...');

    const { data: courses, error } = await supabase
      .from('courses')
      .select('slug, title, thumbnail_url_desktop, thumbnail_url_mobile, course_code')
      .eq('is_published', true)
      .limit(5);

    if (error) {
      console.error('❌ Error fetching courses:', error.message);
      return;
    }

    console.log(`✅ Found ${courses.length} courses with thumbnails:\n`);

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      console.log(`${i + 1}. ${course.title}`);
      console.log(`   Desktop URL: ${course.thumbnail_url_desktop || '❌ Missing'}`);
      console.log(`   Mobile URL:  ${course.thumbnail_url_mobile || '❌ Missing'}`);

      // Test if URLs are accessible
      if (course.thumbnail_url_desktop) {
        try {
          const url = new URL(course.thumbnail_url_desktop);
          console.log(`   URL Analysis: ${url.protocol}//${url.host}${url.pathname}`);
          console.log(`   Bucket: ${url.pathname.split('/')[2]}`);
          console.log(`   File: ${url.pathname.split('/').pop()}`);
        } catch (urlError) {
          console.log(`   ❌ Invalid URL format: ${urlError.message}`);
        }
      }

      console.log('');
    }

    // Test a specific URL to see if it's accessible
    if (courses.length > 0 && courses[0].thumbnail_url_desktop) {
      console.log('🌐 Testing direct URL access...');
      const testUrl = courses[0].thumbnail_url_desktop;

      try {
        const url = new URL(testUrl);
        console.log(`Testing: ${testUrl}`);

        // Simple HTTP request to test accessibility
        const isHttps = testUrl.startsWith('https://');

        if (isHttps) {
          // For HTTPS URLs, we can't easily test without certificates
          console.log('ℹ️  HTTPS URL detected - manual testing needed');
          console.log('💡 Try opening this URL in your browser:');
          console.log(`   ${testUrl}`);
        }

      } catch (error) {
        console.log(`❌ URL test failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

testThumbnailLoading();
