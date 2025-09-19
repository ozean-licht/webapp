/**
 * Cleanup Script für Test-Daten
 * Löscht Test-Kurse und deren Thumbnails
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function deleteAllCourses() {
  console.log('🗑️ Deleting ALL courses from database...');

  try {
    // First get all courses
    const getResponse = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=slug&limit=1000`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!getResponse.ok) {
      console.log('❌ Failed to fetch courses');
      return false;
    }

    const courses = await getResponse.json();
    console.log(`📊 Found ${courses.length} courses to delete`);

    // Delete each course individually
    let deleted = 0;
    for (const course of courses) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?slug=eq.${course.slug}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        deleted++;
        if (deleted % 10 === 0) {
          console.log(`✅ Deleted ${deleted}/${courses.length} courses`);
        }
      } else {
        console.log(`❌ Failed to delete ${course.slug}`);
      }
    }

    console.log(`✅ Successfully deleted ${deleted}/${courses.length} courses`);
    return true;
  } catch (error) {
    console.log(`💥 Error deleting courses:`, error.message);
    return false;
  }
}

async function deleteThumbnailFiles(slug) {
  console.log(`🗑️ Deleting thumbnail files for: ${slug}`);

  const files = [
    `${slug}/desktop.webp`,
    `${slug}/desktop.png`,
    `${slug}/mobile.webp`,
    `${slug}/mobile.png`
  ];

  for (const file of files) {
    try {
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/course_thumbs/${file}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`✅ Deleted: ${file}`);
      } else {
        console.log(`⚠️ File not found or already deleted: ${file}`);
      }
    } catch (error) {
      console.log(`💥 Error deleting ${file}:`, error.message);
    }
  }
}

async function cleanup() {
  console.log('🧹 Starting COMPLETE cleanup...\n');

  // Delete ALL courses first
  await deleteAllCourses();

  console.log('\n✅ Complete cleanup finished!');
}

async function cleanupTestData() {
  console.log('🧹 Starting cleanup of test data...\n');

  const testSlugs = [
    'test-metaphysics-course-101',
    'transhumanismus-potentielle-zeitlinien-der-erde-interview-mit-raik-garve-yt',
    'sirian-gateway-gruppen-channeling-event-vom-24-07-2024',
    'neue-energien-qa-event-vom-16-06-2024'
  ];

  for (const slug of testSlugs) {
    // Delete thumbnail files first
    await deleteThumbnailFiles(slug);

    // Then delete course
    await deleteCourse(slug);

    console.log(''); // Empty line for readability
  }

  console.log('✅ Test data cleanup completed!');
}

// Command line interface
if (require.main === module) {
  cleanup().then(() => {
    console.log('\n🎉 All test data cleaned up successfully!');
  }).catch(error => {
    console.error('💥 Cleanup failed:', error);
  });
}

module.exports = { cleanup, cleanupTestData, deleteAllCourses, deleteThumbnailFiles };
