/**
 * Simple test to check image loading from Supabase Storage
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';

async function testImageLoading() {
  console.log('🖼️ Testing image loading from Supabase Storage...\n');

  // Test URLs that should work
  const testUrls = [
    'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_thumbs/solstice-gruppen-channeling-event-vom-21-12-2024/desktop.webp',
    'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_thumbs/sirian-gateway-gruppen-channeling-event-vom-24-07-2024/desktop.webp',
    'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_thumbs/quantum-masterkurs/desktop.webp'
  ];

  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`Testing URL ${i + 1}: ${url.substring(0, 60)}...`);

    try {
      const response = await fetch(url, {
        method: 'HEAD', // Only get headers, not the full image
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
        }
      });

      if (response.ok) {
        console.log(`✅ URL ${i + 1}: HTTP ${response.status} - ${response.headers.get('content-type')} - ${response.headers.get('content-length')} bytes`);
      } else {
        console.log(`❌ URL ${i + 1}: HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`💥 URL ${i + 1}: Error - ${error.message}`);
    }

    // Small delay between requests
    if (i < testUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n🎯 Image loading test completed!');
  console.log('💡 If all URLs return HTTP 200, the images exist and are accessible.');
  console.log('💡 If the browser still shows errors, it might be a CORS or caching issue.');
}

// Run the test
if (require.main === module) {
  testImageLoading();
}

module.exports = { testImageLoading };
