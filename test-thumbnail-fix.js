/**
 * Test script to fix thumbnail issues by reprocessing failed images
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testEdgeFunction() {
  console.log('🧪 Testing Edge Function with simplified logic...\n');

  // Get courses without thumbnails
  const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?or=(thumbnail_url_desktop.is.null,thumbnail_url_mobile.is.null)&is_published=eq.true`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const courses = await response.json();
  console.log(`📊 Found ${courses.length} courses without thumbnails`);

  if (courses.length === 0) {
    console.log('✅ All courses have thumbnails!');
    return;
  }

  // Test processing one course
  const testCourse = courses[0];
  console.log(`\n🔄 Testing with course: ${testCourse.title}`);
  console.log(`📝 Slug: ${testCourse.slug}`);

  // For now, just check if we can access the Edge Function
  const thumbResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    },
    body: JSON.stringify({
      course_slug: testCourse.slug,
      png_url: `https://via.placeholder.com/800x450/00D4FF/FFFFFF?text=${encodeURIComponent(testCourse.title.substring(0, 20))}`
    })
  });

  console.log(`📡 Edge Function Response: ${thumbResponse.status}`);

  if (thumbResponse.ok) {
    const result = await thumbResponse.json();
    console.log('✅ Edge Function working:', result);
  } else {
    const error = await thumbResponse.text();
    console.log('❌ Edge Function error:', error);
  }
}

// Run test
testEdgeFunction().catch(console.error);
