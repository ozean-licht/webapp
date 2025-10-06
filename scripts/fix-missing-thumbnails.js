/**
 * Script to fix missing thumbnails by reprocessing courses without thumbnails
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fixMissingThumbnails() {
  console.log('🔧 Starting thumbnail fix process...\n');

  try {
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

    // Process courses one by one with longer delays
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      console.log(`\n🔄 Processing ${i + 1}/${courses.length}: ${course.title}`);

      try {
        // Create a simple placeholder image URL for testing
        const placeholderUrl = `https://via.placeholder.com/800x450/00D4FF/FFFFFF?text=${encodeURIComponent(course.title.substring(0, 20))}`;

        const thumbResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            course_slug: course.slug,
            png_url: placeholderUrl
          })
        });

        if (thumbResponse.ok) {
          const result = await thumbResponse.json();
          console.log(`✅ Success: ${course.slug}`);
          successCount++;
        } else {
          const error = await thumbResponse.text();
          console.log(`❌ Failed: ${course.slug} - ${error}`);
          failCount++;
        }

        // Wait 3 seconds between requests to avoid overloading
        if (i < courses.length - 1) {
          console.log('⏱️ Waiting 3 seconds...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

      } catch (error) {
        console.error(`💥 Error processing ${course.slug}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n🎉 COMPLETED!`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total processed: ${courses.length}`);

  } catch (error) {
    console.error('💥 Script error:', error.message);
  }
}

// Run the fix
if (require.main === module) {
  fixMissingThumbnails();
}

module.exports = { fixMissingThumbnails };
