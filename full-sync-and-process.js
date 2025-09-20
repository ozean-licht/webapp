require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const airtableApiKey = process.env.AIRTABLE_API_KEY;

const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey || !airtableApiKey) {
  console.error('❌ Missing required environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
  console.error('  - AIRTABLE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'course_thumbs';

async function downloadImage(url) {
  console.log('🌐 Downloading...');
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'CourseSyncProcessor/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

async function processImageVariants(inputBuffer) {
  // Define variants - PNG and WebP for both desktop and mobile (16:9 ratio)
  const variants = [
    { name: 'desktop.png', width: 1280, height: 720, format: 'png' },
    { name: 'desktop.webp', width: 1280, height: 720, format: 'webp' },
    { name: 'mobile.png', width: 640, height: 360, format: 'png' },
    { name: 'mobile.webp', width: 640, height: 360, format: 'webp' }
  ];

  const results = {};

  for (const variant of variants) {
    console.log(`🔄 Processing ${variant.name}...`);

    let sharpInstance = sharp(inputBuffer);

    // Resize
    sharpInstance = sharpInstance.resize(variant.width, variant.height, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: true
    });

    // Convert and compress
    const processedBuffer = variant.format === 'webp'
      ? await sharpInstance.webp({ quality: 85 }).toBuffer()
      : await sharpInstance.png({ quality: 90 }).toBuffer();

    results[variant.name] = processedBuffer;
    console.log(`✅ ${processedBuffer.length} bytes`);
  }

  return results;
}

async function uploadImageVariants(courseSlug, variants) {
  const uploadedUrls = {};

  for (const [fileName, buffer] of Object.entries(variants)) {
    const filePath = `${courseSlug}/${fileName}`;

    console.log(`📤 Uploading ${fileName}...`);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: `image/${fileName.split('.').pop()}`,
        upsert: true
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    uploadedUrls[fileName] = publicUrl.publicUrl;
    console.log(`✅ Uploaded ${fileName}`);
  }

  return uploadedUrls;
}

async function deleteOldImages(courseSlug) {
  console.log('🗑️ Deleting old images...');

  try {
    const { data: files } = await supabase.storage
      .from(BUCKET_NAME)
      .list(courseSlug);

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${courseSlug}/${file.name}`);
      await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);

      console.log(`✅ Deleted ${files.length} old files`);
    }
  } catch (error) {
    console.log('⚠️ Could not delete old files:', error.message);
  }
}

async function updateDatabaseUrls(courseSlug, urls) {
  console.log('💾 Updating database...');

  const { error } = await supabase
    .from('courses')
    .update({
      thumbnail_url_desktop: urls['desktop.webp'],
      thumbnail_url_mobile: urls['mobile.webp'],
      updated_at: new Date().toISOString()
    })
    .eq('slug', courseSlug);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log('✅ Database updated');
}

async function syncCourseFromAirtable(courseSlug) {
  console.log(`🔍 Syncing course: ${courseSlug}`);

  // Find course in Airtable
  const airtableUrl = `https://api.airtable.com/v0/app5e7mJQhxDYD5Zy/courses?filterByFormula={slug}="${courseSlug}"`;
  const response = await fetch(airtableUrl, {
    headers: {
      'Authorization': `Bearer ${airtableApiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Airtable fetch failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.records || data.records.length === 0) {
    throw new Error('Course not found in Airtable');
  }

  const course = data.records[0].fields;
  if (!course.thumbnail || !course.thumbnail[0]) {
    throw new Error('No thumbnail found for course');
  }

  // Upsert course in database
  const courseData = {
    title: course.title || '',
    slug: course.slug || '',
    description: course.description || '',
    price: course.price || 0,
    is_published: course.is_public || false,
    course_code: course.course_code || Math.floor(Math.random() * 1000000),
    created_at: course.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: upsertError } = await supabase
    .from('courses')
    .upsert(courseData, {
      onConflict: 'slug',
      ignoreDuplicates: false
    });

  if (upsertError) {
    throw new Error(`Database upsert failed: ${upsertError.message}`);
  }

  // Process thumbnail
  const imageUrl = course.thumbnail[0].url;
  console.log('🖼️ Processing thumbnail...');

  // Download and process
  const originalBuffer = await downloadImage(imageUrl);
  const variants = await processImageVariants(originalBuffer);

  // Upload
  await deleteOldImages(courseSlug);
  const urls = await uploadImageVariants(courseSlug, variants);
  await updateDatabaseUrls(courseSlug, urls);

  return urls;
}

async function fullSyncAndProcess() {
  console.log('🚀 FULL SYNC & PROCESS - Airtable → Supabase → Images');
  console.log('=' * 60);

  try {
    // Get ALL courses from Airtable
    console.log('📡 Fetching ALL courses from Airtable...');
    const airtableUrl = 'https://api.airtable.com/v0/app5e7mJQhxDYD5Zy/courses?view=Grid%20view&maxRecords=200';
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const airtableCourses = data.records.filter(record => record.fields.is_public);

    console.log(`📋 Found ${airtableCourses.length} published courses in Airtable`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const record of airtableCourses) {
      try {
        const course = record.fields;
        const slug = course.slug;

        if (!course.thumbnail || !course.thumbnail[0]) {
          console.log(`⏭️ No thumbnail for: ${course.title.substring(0, 40)}...`);
          skipped++;
          continue;
        }

        console.log(`\\n🎯 Processing ${processed + 1}/${airtableCourses.length}: ${course.title.substring(0, 50)}...`);

        await syncCourseFromAirtable(slug);

        processed++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error('💥 Error processing course:', err.message);
        errors++;
      }
    }

    console.log('\\n🎉 FULL SYNC COMPLETE!');
    console.log('=' * 30);
    console.log(`✅ Successfully processed: ${processed}`);
    console.log(`⏭️ Skipped (no thumbnail): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

    if (processed > 0) {
      console.log('\\n🎊 Your courses are now live with optimized images!');
      console.log('🌐 Visit: http://localhost:3001/courses');
    }

  } catch (error) {
    console.error('💥 Full sync failed:', error.message);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'full' || args.length === 0) {
  console.log('🚀 Starting FULL sync and process...');
  fullSyncAndProcess();
} else if (command === 'single' && args[1]) {
  console.log(`🎯 Syncing single course: ${args[1]}`);
  syncCourseFromAirtable(args[1]).then(() => {
    console.log('✅ Single course sync complete!');
  }).catch(err => {
    console.error('❌ Failed:', err.message);
  });
} else {
  console.log('🎯 Course Sync & Image Processor');
  console.log('');
  console.log('Usage:');
  console.log('  node full-sync-and-process.js              # Full sync all courses');
  console.log('  node full-sync-and-process.js full         # Full sync all courses');
  console.log('  node full-sync-and-process.js single <slug> # Sync single course');
  console.log('');
  console.log('Features:');
  console.log('  ✅ Sync courses from Airtable to Supabase');
  console.log('  ✅ Download and process images with Sharp');
  console.log('  ✅ Create 4 optimized variants (PNG + WebP)');
  console.log('  ✅ Upload to Supabase Storage');
  console.log('  ✅ Update database URLs');
  console.log('  ✅ 85-99% size reduction!');
}
