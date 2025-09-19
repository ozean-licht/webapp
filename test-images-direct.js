// Direkter Bild-Test für Supabase Storage
require('dotenv').config({ path: '.env.local' });

const https = require('https');

async function testImageDirectly() {
  const imageUrl = 'https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/course_thumbs/equinox-gruppen-channeling-event-am-22-09-2025/desktop.webp';

  console.log('🖼️ Testing image directly:', imageUrl);

  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      console.log('📊 HTTP Status:', res.statusCode);
      console.log('📋 Headers:', {
        'content-type': res.headers['content-type'],
        'content-length': res.headers['content-length'],
        'cache-control': res.headers['cache-control'],
        'access-control-allow-origin': res.headers['access-control-allow-origin']
      });

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Image data received, length:', data.length);
        if (res.statusCode === 200) {
          console.log('🎉 Image is accessible and working!');
          resolve(true);
        } else {
          console.log('❌ Image returned status:', res.statusCode);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error('❌ Network error:', err.message);
      reject(err);
    });
  });
}

async function testMultipleImages() {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  console.log('📚 Testing multiple course images...\n');

  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('title, thumbnail_url_desktop, thumbnail_url_mobile')
      .eq('is_published', true)
      .limit(3);

    if (error) {
      console.error('❌ Error fetching courses:', error.message);
      return;
    }

    for (const course of courses) {
      console.log(`🎯 Testing: ${course.title.substring(0, 40)}...`);

      const urls = [];
      if (course.thumbnail_url_desktop) urls.push(course.thumbnail_url_desktop);
      if (course.thumbnail_url_mobile) urls.push(course.thumbnail_url_mobile);

      for (const url of urls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            console.log(`  ✅ ${url.split('/').pop()}: ${response.status} (${response.headers.get('content-type')})`);
          } else {
            console.log(`  ❌ ${url.split('/').pop()}: ${response.status}`);
          }
        } catch (error) {
          console.log(`  💥 ${url.split('/').pop()}: Network error`);
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

// Hauptfunktion
async function main() {
  console.log('🚀 Starting image tests...\n');

  try {
    await testImageDirectly();
    console.log('\n' + '='.repeat(50) + '\n');
    await testMultipleImages();
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

main();
