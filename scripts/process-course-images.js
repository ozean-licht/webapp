require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const airtableApiKey = process.env.AIRTABLE_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET_NAME = 'course_thumbs';

async function downloadImage(url) {
  console.log('🌐 Downloading image...');
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CourseImageProcessor/1.0)'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  console.log(`✅ Downloaded ${buffer.byteLength} bytes`);
  return Buffer.from(buffer);
}

async function processImageVariants(inputBuffer) {
  const variants = [
    { name: 'desktop.png', width: 800, height: 450, format: 'png' },
    { name: 'desktop.webp', width: 800, height: 450, format: 'webp' },
    { name: 'mobile.png', width: 400, height: 225, format: 'png' },
    { name: 'mobile.webp', width: 400, height: 225, format: 'webp' }
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

    // Convert format
    const processedBuffer = variant.format === 'webp'
      ? await sharpInstance.webp({ quality: 85 }).toBuffer()
      : await sharpInstance.png({ quality: 90 }).toBuffer();

    results[variant.name] = processedBuffer;
    console.log(`✅ ${variant.name}: ${processedBuffer.length} bytes`);
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
      console.error(`❌ Upload failed for ${fileName}:`, error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Generate public URL
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
    console.error('❌ Database update failed:', error.message);
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log('✅ Database updated');
}

async function processCourseImages(courseSlug, imageUrl) {
  try {
    console.log(`🚀 Processing images for course: ${courseSlug}`);

    // Download and process image
    const originalBuffer = await downloadImage(imageUrl);
    const variants = await processImageVariants(originalBuffer);

    // Delete old images
    await deleteOldImages(courseSlug);

    // Upload new variants
    const urls = await uploadImageVariants(courseSlug, variants);

    // Update database
    await updateDatabaseUrls(courseSlug, urls);

    console.log(`\\n🎉 Successfully processed course: ${courseSlug}`);
    console.log('📋 Generated URLs:');
    console.log(`   Desktop: ${urls['desktop.webp']}`);
    console.log(`   Mobile: ${urls['mobile.webp']}`);

    return urls;

  } catch (error) {
    console.error('💥 Processing failed:', error.message);
    throw error;
  }
}

async function processFromAirtable(courseSlug) {
  if (!airtableApiKey) {
    console.error('❌ AIRTABLE_API_KEY not found in .env.local');
    console.error('💡 Add AIRTABLE_API_KEY to your .env.local file');
    process.exit(1);
  }

  console.log(`🔍 Finding course in Airtable: ${courseSlug}`);

  try {
    const airtableUrl = `https://api.airtable.com/v0/app5e7mJQhxDYD5Zy/courses?filterByFormula={slug}="${courseSlug}"`;
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
    if (!data.records || data.records.length === 0) {
      console.error('❌ Course not found in Airtable');
      return;
    }

    const course = data.records[0].fields;
    if (!course.thumbnail || !course.thumbnail[0]) {
      console.error('❌ No thumbnail found for course');
      return;
    }

    const imageUrl = course.thumbnail[0].url;
    console.log(`🖼️ Found image for: ${course.title}`);

    await processCourseImages(courseSlug, imageUrl);

  } catch (error) {
    console.error('💥 Failed to process from Airtable:', error.message);
  }
}

async function processAllFromAirtable() {
  if (!airtableApiKey) {
    console.error('❌ AIRTABLE_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('🔄 Processing ALL courses from Airtable...');

  try {
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
    const courses = data.records.filter(record => record.fields.is_public);

    console.log(`📋 Found ${courses.length} courses to process`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const record of courses) {
      try {
        const course = record.fields;
        const slug = course.slug;

        if (!course.thumbnail || !course.thumbnail[0]) {
          skipped++;
          continue;
        }

        console.log(`\\n🎯 Processing: ${course.title.substring(0, 50)}... (${processed + 1}/${courses.length})`);

        const imageUrl = course.thumbnail[0].url;
        await processCourseImages(slug, imageUrl);

        processed++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        console.error('💥 Error processing course:', err.message);
        errors++;
      }
    }

    console.log('\\n📊 Summary:');
    console.log(`✅ Processed: ${processed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

  } catch (error) {
    console.error('💥 Batch processing failed:', error.message);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'single' && args[1]) {
  processFromAirtable(args[1]);
} else if (command === 'all') {
  processAllFromAirtable();
} else {
  console.log('🖼️ Course Image Processor');
  console.log('');
  console.log('Usage:');
  console.log('  node process-course-images.js single <course-slug>  # Process one course');
  console.log('  node process-course-images.js all                  # Process all courses');
  console.log('');
  console.log('Examples:');
  console.log('  node process-course-images.js single my-course-slug');
  console.log('  node process-course-images.js all');
  console.log('');
  console.log('Prerequisites:');
  console.log('  - AIRTABLE_API_KEY in .env.local');
  console.log('  - Supabase bucket "course_thumbs" must allow uploads');
}