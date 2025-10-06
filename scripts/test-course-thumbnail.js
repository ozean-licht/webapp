/**
 * Test Script für process-course-thumbnail Edge Function
 * Testet die lokale Supabase Edge Function mit fetch
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testCourseThumbnail() {
  const functionUrl = `${SUPABASE_URL}/functions/v1/process-course-thumbnail`;

  // Test-Daten - Verwende eine Google gespeicherte PNG
  const testData = {
    course_slug: `test-course-${Date.now()}`,
    png_url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
  };

  console.log('🚀 Testing process-course-thumbnail Edge Function');
  console.log('📡 Function URL:', functionUrl);
  console.log('📄 Test Data:', JSON.stringify(testData, null, 2));
  console.log('⏳ Sending request...\n');

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📄 Response Body:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ Test erfolgreich!');
      console.log('🖼️ Thumbnails generiert:');
      console.log('   - Desktop WebP:', responseData.thumbnails?.desktop_webp);
      console.log('   - Desktop PNG:', responseData.thumbnails?.desktop_png);
      console.log('   - Mobile WebP:', responseData.thumbnails?.mobile_webp);
      console.log('   - Mobile PNG:', responseData.thumbnails?.mobile_png);

      if (responseData.note) {
        console.log('\n⚠️ Hinweis:', responseData.note);
      }
    } else {
      console.log('\n❌ Test fehlgeschlagen!');
      console.log('🔍 Error Details:', responseData.details);
    }

  } catch (error) {
    console.error('\n💥 Request Error:', error.message);
    console.error('🔍 Full Error:', error);
  }
}

// Mehrere Tests ausführen
async function runMultipleTests() {
  console.log('🧪 Running multiple tests...\n');

  const tests = [
    {
      name: 'Valid PNG URL (GitHub)',
      data: {
        course_slug: `test-github-${Date.now()}`,
        png_url: 'https://github.com/supabase/supabase/raw/main/packages/storage/test/fixtures/sample.png'
      }
    },
    {
      name: 'Valid PNG URL (Google)',
      data: {
        course_slug: `test-google-${Date.now()}`,
        png_url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
      }
    },
    {
      name: 'Invalid URL',
      data: {
        course_slug: `test-invalid-${Date.now()}`,
        png_url: 'https://invalid-domain-that-does-not-exist-12345.com/image.png'
      }
    },
    {
      name: 'Missing PNG URL',
      data: {
        course_slug: `test-missing-${Date.now()}`
      }
    },
    {
      name: 'Empty course_slug',
      data: {
        course_slug: '',
        png_url: 'https://via.placeholder.com/800x600.png'
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 Running test: ${test.name}`);
    console.log('='.repeat(50));

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(test.data)
      });

      const responseData = await response.json();

      console.log(`📊 Status: ${response.status}`);
      console.log(`📄 Message: ${responseData.message || responseData.error}`);

      if (response.ok) {
        console.log('✅ Success');
      } else {
        console.log('❌ Failed');
      }

    } catch (error) {
      console.log('💥 Error:', error.message);
    }

    // Delay zwischen Tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Performance Test
async function performanceTest() {
  console.log('\n⚡ Running performance test (5 concurrent requests)...\n');

  const promises = [];
  const startTime = Date.now();

  for (let i = 0; i < 5; i++) {
    const testData = {
      course_slug: `perf-test-${Date.now()}-${i}`,
      png_url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    };

    const promise = fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testData)
    }).then(async response => {
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse response' };
      }
      return {
        status: response.status,
        success: response.ok,
        duration: Date.now() - startTime,
        course_slug: testData.course_slug,
        message: data.message || data.error || 'Unknown'
      };
    }).catch(error => ({
      status: 'ERROR',
      success: false,
      error: error.message,
      course_slug: testData.course_slug,
      message: error.message
    }));

    promises.push(promise);
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();

  console.log('📊 Performance Results:');
  console.log(`⏱️ Total Time: ${endTime - startTime}ms`);
  console.log(`✅ Successful: ${results.filter(r => r.success).length}/5`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}/5`);

  results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.course_slug}: ${result.success ? '✅' : '❌'} (${result.status}) - ${result.message}`);
  });
}

// Get existing courses from database
async function getExistingCourses() {
  console.log('📋 Fetching existing courses from database...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=slug,title,description,price,is_published,thumbnail_url_desktop,thumbnail_url_mobile&order=updated_at.desc&limit=10`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const courses = await response.json();

    if (response.ok) {
      console.log(`📊 Found ${courses.length} courses:`);
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.title}`);
        console.log(`   Slug: ${course.slug}`);
        console.log(`   Description: ${course.description?.substring(0, 60)}...`);
        console.log(`   Price: €${course.price}`);
        console.log(`   Published: ${course.is_published ? '✅' : '❌'}`);
        console.log(`   🖼️ Desktop URL: ${course.thumbnail_url_desktop ? '✅ ' + course.thumbnail_url_desktop.split('/').pop() : '❌ Nicht vorhanden'}`);
        console.log(`   📱 Mobile URL: ${course.thumbnail_url_mobile ? '✅ ' + course.thumbnail_url_mobile.split('/').pop() : '❌ Nicht vorhanden'}`);
        console.log('');
      });

      return courses;
    } else {
      console.log('❌ Failed to fetch courses:', courses.message);
      return [];
    }
  } catch (error) {
    console.error('💥 Error fetching courses:', error.message);
    return [];
  }
}

// Create a test course in the database
async function createTestCourse() {
  console.log('🆕 Creating test course in database...\n');

  const testCourse = {
    slug: 'test-metaphysics-course-101',
    course_code: 101,
    title: 'Advanced Metaphysics Course 101',
    description: 'Learn the fundamentals of metaphysics and quantum transformation',
    price: 99.99,
    is_published: true
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testCourse)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Test course created successfully!');
      console.log('📄 Course details:');
      console.log('   Title:', result[0].title);
      console.log('   Slug:', result[0].slug);
      console.log('   ID:', result[0].id);
      return result[0];
    } else {
      console.log('❌ Failed to create course:', result.message);
      return null;
    }
  } catch (error) {
    console.error('💥 Error creating course:', error.message);
    return null;
  }
}

// Check thumbnail URLs and file sizes for a course
async function checkThumbnails(courseSlug) {
  console.log(`🖼️ Checking thumbnails for course: ${courseSlug}\n`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?slug=eq.${courseSlug}&select=slug,title,description,price,is_published,thumbnail_url_desktop,thumbnail_url_mobile`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const courses = await response.json();

    if (!response.ok || courses.length === 0) {
      console.log('❌ Course not found');
      return;
    }

    const course = courses[0];
    console.log(`📄 Course: ${course.title}`);
    console.log(`   Slug: ${course.slug}`);
    console.log(`   Price: €${course.price}`);
    console.log(`   Published: ${course.is_published ? '✅' : '❌'}`);
    console.log(`🖼️ Desktop: ${course.thumbnail_url_desktop ? '✅ WebP URL' : '❌ Nicht vorhanden'}`);
    console.log(`📱 Mobile: ${course.thumbnail_url_mobile ? '✅ WebP URL' : '❌ Nicht vorhanden'}`);

    // Test if URLs are accessible and check file sizes
    const thumbnailUrls = [
      { name: 'Desktop WebP', url: course.thumbnail_url_desktop },
      { name: 'Mobile WebP', url: course.thumbnail_url_mobile },
      { name: 'Desktop PNG', url: course.thumbnail_url_desktop?.replace('.webp', '.png') },
      { name: 'Mobile PNG', url: course.thumbnail_url_mobile?.replace('.webp', '.png') }
    ];

    console.log('\n🔗 Testing all thumbnail URLs and file sizes:');
    const fileSizes = [];

    for (const { name, url } of thumbnailUrls) {
      if (url) {
        try {
          const thumbResponse = await fetch(url, { method: 'HEAD' });
          const contentLength = thumbResponse.headers.get('content-length');
          const sizeKB = contentLength ? (parseInt(contentLength) / 1024).toFixed(1) : 'unknown';

          console.log(`   ${name}: ${thumbResponse.status} ${thumbResponse.statusText} (${sizeKB} KB)`);

          if (contentLength) {
            fileSizes.push({
              name,
              size: parseInt(contentLength),
              sizeKB: parseFloat(sizeKB)
            });
          }
        } catch (error) {
          console.log(`   ${name}: ❌ ${error.message}`);
        }
      } else {
        console.log(`   ${name}: ❌ URL not available`);
      }
    }

    // Analyze file sizes
    if (fileSizes.length > 0) {
      console.log('\n📊 File Size Analysis:');
      const desktopWebp = fileSizes.find(f => f.name === 'Desktop WebP');
      const mobileWebp = fileSizes.find(f => f.name === 'Mobile WebP');
      const desktopPng = fileSizes.find(f => f.name === 'Desktop PNG');
      const mobilePng = fileSizes.find(f => f.name === 'Mobile PNG');

      console.log(`   Desktop WebP: ${desktopWebp?.sizeKB || 'N/A'} KB`);
      console.log(`   Mobile WebP:  ${mobileWebp?.sizeKB || 'N/A'} KB`);
      console.log(`   Desktop PNG:  ${desktopPng?.sizeKB || 'N/A'} KB`);
      console.log(`   Mobile PNG:   ${mobilePng?.sizeKB || 'N/A'} KB`);

      // Check if sizes are actually different
      const uniqueSizes = [...new Set(fileSizes.map(f => f.size))];
      if (uniqueSizes.length === 1) {
        console.log('\n⚠️  WARNING: All files have the same size! Resizing may not be working correctly.');
      } else {
        console.log('\n✅ SUCCESS: Files have different sizes - resizing is working!');
        const sortedSizes = fileSizes.sort((a, b) => a.size - b.size);
        console.log(`   Smallest: ${sortedSizes[0].name} (${sortedSizes[0].sizeKB} KB)`);
        console.log(`   Largest:  ${sortedSizes[sortedSizes.length - 1].name} (${sortedSizes[sortedSizes.length - 1].sizeKB} KB)`);
      }
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Manual thumbnail processing for existing course
async function processExistingCourse(courseSlug) {
  console.log(`🔄 Processing thumbnails for course: ${courseSlug}`);

  // First get the course details to find the Airtable attachment
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/courses?slug=eq.${courseSlug}&select=slug,title,description,price,is_published`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const courses = await response.json();

    if (!response.ok || courses.length === 0) {
      console.log('❌ Course not found');
      return;
    }

    const course = courses[0];
    console.log(`📄 Found course: ${course.title}`);
    console.log(`🆔 Airtable ID: ${course.airtable_id}`);

    // For now, let's use a test image since we don't have direct access to Airtable attachments
    const testImageUrl = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

    console.log(`🖼️ Using test image: ${testImageUrl}`);

    // Call the thumbnail processing function
    const thumbResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        course_slug: courseSlug,
        png_url: testImageUrl
      })
    });

    const thumbData = await thumbResponse.json();

    if (thumbResponse.ok) {
      console.log('✅ Thumbnail processing successful!');
      console.log('🖼️ Generated thumbnails:');
      console.log('   Desktop WebP:', thumbData.thumbnails?.desktop_webp);
      console.log('   Desktop PNG:', thumbData.thumbnails?.desktop_png);
      console.log('   Mobile WebP:', thumbData.thumbnails?.mobile_webp);
      console.log('   Mobile PNG:', thumbData.thumbnails?.mobile_png);
    } else {
      console.log('❌ Thumbnail processing failed:', thumbData.details);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'single':
    testCourseThumbnail();
    break;
  case 'multiple':
    runMultipleTests();
    break;
  case 'perf':
    performanceTest();
    break;
  case 'courses':
    getExistingCourses();
    break;
  case 'create':
    createTestCourse().then(course => {
      if (course) {
        console.log('\n💡 Now you can process thumbnails with:');
        console.log(`   npm run test:function:process ${course.slug}`);
      }
    });
    break;
  case 'check':
    const checkSlug = process.argv[3];
    if (!checkSlug) {
      console.log('❌ Please provide a course slug: node test-course-thumbnail.js check <slug>');
      process.exit(1);
    }
    checkThumbnails(checkSlug);
    break;
  case 'process':
    const courseSlug = process.argv[3];
    if (!courseSlug) {
      console.log('❌ Please provide a course slug: node test-course-thumbnail.js process <slug>');
      process.exit(1);
    }
    processExistingCourse(courseSlug);
    break;
  default:
    console.log('🧪 Course Thumbnail Edge Function Test Script');
    console.log('');
    console.log('Usage:');
    console.log('  node test-course-thumbnail.js single       - Single test');
    console.log('  node test-course-thumbnail.js multiple     - Multiple tests');
    console.log('  node test-course-thumbnail.js perf         - Performance test');
    console.log('  node test-course-thumbnail.js courses      - List existing courses');
    console.log('  node test-course-thumbnail.js create       - Create test course');
    console.log('  node test-course-thumbnail.js check <slug> - Check thumbnail URLs for course');
    console.log('  node test-course-thumbnail.js process <slug> - Process thumbnails for existing course');
    console.log('');
    console.log('Environment Variables:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL       - Supabase URL');
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY  - Supabase Anon Key');
    console.log('');
    testCourseThumbnail();
    break;
}

module.exports = {
  testCourseThumbnail,
  runMultipleTests,
  performanceTest,
  getExistingCourses,
  createTestCourse,
  checkThumbnails,
  processExistingCourse
};
