/**
 * Airtable to Supabase Course Sync Script
 * Syncs existing courses from Airtable to Supabase and triggers thumbnail processing
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with actual key
const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy';
const AIRTABLE_TABLE = 'courses';

// Sync a single course from Airtable to Supabase (optimized for batch processing)
async function syncCourse(airtableRecord) {
  const courseData = {
    slug: airtableRecord.fields.slug,
    course_code: airtableRecord.fields.course_code || 100,
    title: airtableRecord.fields.title,
    description: airtableRecord.fields.description || '',
    price: airtableRecord.fields.price || 0,
    is_published: airtableRecord.fields.is_public || false,
    updated_at: new Date().toISOString()
  };

  try {
    // Check if course already exists (silent check)
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/courses?slug=eq.${courseData.slug}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingCourses = await checkResponse.json();
    let method = 'POST';
    let url = `${SUPABASE_URL}/rest/v1/courses`;

    if (existingCourses.length > 0) {
      method = 'PATCH';
      url = `${SUPABASE_URL}/rest/v1/courses?slug=eq.${courseData.slug}`;
    }

    // Sync course to Supabase
    const syncResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(courseData)
    });

    if (!syncResponse.ok) {
      const errorData = await syncResponse.json();
      throw new Error(`Sync failed: ${errorData.message}`);
    }

    const syncedCourse = await syncResponse.json();

    // Process thumbnails if there's an attachment (silent processing)
    if (airtableRecord.fields.thumbnail && airtableRecord.fields.thumbnail.length > 0) {
      const thumbnailUrl = airtableRecord.fields.thumbnail[0].url;

      try {
        const thumbResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            course_slug: courseData.slug,
            png_url: thumbnailUrl
          })
        });

        if (!thumbResponse.ok) {
          const errorData = await thumbResponse.json();
          throw new Error(`Thumbnail processing failed: ${errorData.details}`);
        }
      } catch (thumbError) {
        // Silent error for batch processing - don't fail the whole sync
        console.warn(`⚠️ Thumbnail processing failed for ${courseData.slug}: ${thumbError.message}`);
      }
    }

    return syncedCourse[0];

  } catch (error) {
    // Silent error handling for batch processing
    console.error(`❌ Failed to sync ${courseData.slug}: ${error.message}`);
    return null;
  }
}

// Fetch courses from Airtable (optimized)
async function fetchAirtableCourses() {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?view=Grid%20view`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.records;

  } catch (error) {
    console.error('💥 Error fetching from Airtable:', error.message);
    console.log('\n🔑 Please make sure AIRTABLE_API_KEY is set in your .env.local file');
    return [];
  }
}

// Optimized batch sync function - reduced load to prevent Edge Function overload
async function syncCoursesBatch(courses, batchSize = 2, batchDelay = 3000) {
  const results = [];
  const totalBatches = Math.ceil(courses.length / batchSize);

  console.log(`🚀 Starting LOW-LOAD batch sync: ${courses.length} courses in ${totalBatches} batches of ${batchSize}\n`);

  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} courses)`);

    // Process batch in parallel (but with reduced concurrency)
    const batchPromises = batch.map(course => syncCourse(course));
    const batchResults = await Promise.all(batchPromises);

    // Count successful syncs
    const successful = batchResults.filter(result => result !== null).length;
    results.push(...batchResults.filter(result => result !== null));

    console.log(`✅ Batch ${batchNumber} completed: ${successful}/${batch.length} courses synced`);
    console.log(`📊 Progress: ${results.length}/${courses.length} total courses synced\n`);

    // Increased delay between batches to avoid overwhelming Edge Functions
    if (i + batchSize < courses.length) {
      console.log(`⏱️ Waiting ${batchDelay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, batchDelay));
    }
  }

  return results;
}

// Main sync function with performance optimization
async function syncAllCourses(limit = null) {
  console.log('🚀 Starting HIGH-PERFORMANCE Airtable to Supabase Course Sync\n');

  const startTime = Date.now();

  // Fetch courses from Airtable
  const courses = await fetchAirtableCourses();

  if (courses.length === 0) {
    console.log('❌ No courses found to sync');
    return;
  }

  // Limit if specified
  const coursesToSync = limit ? courses.slice(0, limit) : courses;

  console.log(`🎯 Target: ${coursesToSync.length} courses`);
  console.log(`⚡ Strategy: 2 parallel requests per batch, 3s delay between batches`);
  console.log(`⏱️ Estimated time: ~${Math.ceil(coursesToSync.length / 2) * 3 + (coursesToSync.length / 2 * 5)} seconds\n`);

  // Use optimized batch processing with reduced load
  const results = await syncCoursesBatch(coursesToSync, 2, 3000);

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log(`\n🎉 SYNC COMPLETED!`);
  console.log(`📊 Results: ${results.length}/${coursesToSync.length} courses synced successfully`);
  console.log(`⏱️ Total time: ${duration.toFixed(1)} seconds`);
  console.log(`⚡ Average speed: ${(results.length / duration).toFixed(1)} courses/second`);
  console.log(`💾 Estimated data savings: ~${(results.length * 0.4).toFixed(1)} MB (WebP compression)`);

  return results;
}

// Command line interface
const command = process.argv[2];
const limit = process.argv[3] ? parseInt(process.argv[3]) : null;

switch (command) {
  case 'sync':
    syncAllCourses(limit);
    break;
  case 'preview':
    fetchAirtableCourses().then(courses => {
      if (courses.length > 0) {
        console.log('📋 Preview of first 3 courses:');
        courses.slice(0, 3).forEach((course, index) => {
          console.log(`${index + 1}. ${course.fields.title} (${course.fields.slug})`);
          console.log(`   Thumbnail: ${course.fields.thumbnail ? '✅ Has attachment' : '❌ No attachment'}`);
          console.log('');
        });
      }
    });
    break;
  default:
    console.log('🗄️ Airtable to Supabase Course Sync Script');
    console.log('');
    console.log('Usage:');
    console.log('  node sync-airtable-courses.js sync [limit]    - Sync courses from Airtable');
    console.log('  node sync-airtable-courses.js preview         - Preview available courses');
    console.log('');
    console.log('Examples:');
    console.log('  node sync-airtable-courses.js sync            - Sync all courses');
    console.log('  node sync-airtable-courses.js sync 3          - Sync first 3 courses');
    console.log('  node sync-airtable-courses.js preview         - Show available courses');
    console.log('');
    console.log('Environment Variables:');
    console.log('  AIRTABLE_API_KEY         - Airtable API Key (Personal Access Token)');
    console.log('  NEXT_PUBLIC_SUPABASE_URL - Supabase URL');
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase Anon Key');
    console.log('');
    break;
}

module.exports = {
  syncAllCourses,
  syncCourse,
  fetchAirtableCourses
};
