require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const airtableApiKey = process.env.AIRTABLE_API_KEY;

// Use service role key if available, otherwise fall back to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and (NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

console.log('🔑 Using:', supabaseServiceKey ? 'SERVICE_ROLE_KEY' : 'ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);
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

async function processImageWithSharp(inputBuffer, targetWidth, targetHeight, format) {
  try {
    console.log(`🔄 Processing with Sharp: ${targetWidth}x${targetHeight} ${format.toUpperCase()}...`);

    let sharpInstance = sharp(inputBuffer);

    // Get original dimensions
    const metadata = await sharpInstance.metadata();
    console.log(`📏 Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Resize if needed
    if (targetWidth && targetHeight) {
      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      });
    }

    // Convert format and compress
    let processedBuffer;
    if (format === 'webp') {
      processedBuffer = await sharpInstance.webp({
        quality: 85,
        effort: 6
      }).toBuffer();
    } else if (format === 'png') {
      processedBuffer = await sharpInstance.png({
        quality: 90,
        compressionLevel: 9
      }).toBuffer();
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    const compressionRatio = ((inputBuffer.length - processedBuffer.length) / inputBuffer.length * 100).toFixed(1);
    console.log(`✅ Processed: ${processedBuffer.length} bytes (${compressionRatio}% smaller)`);

    return processedBuffer;

  } catch (error) {
    console.error('💥 Error processing with Sharp:', error.message);
    throw error;
  }
}

async function uploadImageVariants(courseSlug, variants) {
  const uploadedUrls = {};

  for (const [fileName, buffer] of Object.entries(variants)) {
    const filePath = `${courseSlug}/${fileName}`;

    console.log(`📤 Uploading ${fileName} (${buffer.length} bytes)...`);

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

async function processCourseImagesLocally(courseSlug, imageUrl) {
  try {
    console.log(`🚀 Processing images for course: ${courseSlug}`);

    // Download original image
    const originalBuffer = await downloadImage(imageUrl);

    // Define variants - PNG and WebP for both desktop and mobile (16:9 ratio)
    const variants = [
      { name: 'desktop.png', width: 1280, height: 720, format: 'png' },
      { name: 'desktop.webp', width: 1280, height: 720, format: 'webp' },
      { name: 'mobile.png', width: 640, height: 360, format: 'png' },
      { name: 'mobile.webp', width: 640, height: 360, format: 'webp' }
    ];

    const processedImages = {};

    for (const variant of variants) {
      const buffer = await processImageWithSharp(
        originalBuffer,
        variant.width,
        variant.height,
        variant.format
      );
      processedImages[variant.name] = buffer;
    }

    // Delete old images
    await deleteOldImages(courseSlug);

    // Upload new variants
    const urls = await uploadImageVariants(courseSlug, processedImages);

    // Update database
    await updateDatabaseUrls(courseSlug, urls);

    console.log(`\\n🎉 Successfully processed course: ${courseSlug}`);
    console.log('📋 Generated URLs:');
    console.log(`   Desktop: ${urls['desktop.webp']}`);
    console.log(`   Mobile: ${urls['mobile.webp']}`);

    return urls;

  } catch (error) {
    console.error('💥 Error processing images:', error.message);
    throw error;
  }
}

async function reprocessExistingCourses() {
  console.log('🔄 Reprocessing existing courses with proper compression...');

  try {
    // Get all courses from database
    const { data: courses, error } = await supabase
      .from('courses')
      .select('slug, title')
      .not('thumbnail_url_desktop', 'is', null);

    if (error) {
      console.error('❌ Error fetching courses:', error.message);
      return;
    }

    if (!courses || courses.length === 0) {
      console.log('❌ No courses found in database');
      return;
    }

    console.log(`📋 Found ${courses.length} courses to reprocess`);

    let processed = 0;
    let errors = 0;

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];

      try {
        console.log(`\\n🎯 Processing ${i + 1}/${courses.length}: ${course.title.substring(0, 50)}...`);

        // Get original image URL from Airtable
        const airtableUrl = `https://api.airtable.com/v0/app5e7mJQhxDYD5Zy/courses?filterByFormula={slug}="${course.slug}"`;

        const response = await fetch(airtableUrl, {
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('❌ Airtable fetch failed for', course.slug);
          errors++;
          continue;
        }

        const data = await response.json();
        if (!data.records || data.records.length === 0 || !data.records[0].fields.thumbnail) {
          console.error('❌ No thumbnail found in Airtable for', course.slug);
          errors++;
          continue;
        }

        const imageUrl = data.records[0].fields.thumbnail[0].url;

        // Process images locally with Sharp
        await processCourseImagesLocally(course.slug, imageUrl);

        processed++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error('💥 Error processing course:', err.message);
        errors++;
      }
    }

    console.log('\\n📊 Reprocessing Summary:');
    console.log(`✅ Successfully reprocessed: ${processed}`);
    console.log(`❌ Errors: ${errors}`);

  } catch (error) {
    console.error('💥 Reprocessing failed:', error.message);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'reprocess') {
  console.log('🔄 Starting reprocessing of existing courses...');
  reprocessExistingCourses();
} else if (command === 'single' && args[1]) {
  // For single course processing, we'd need to implement it
  console.log('Single course processing not implemented yet. Use reprocess for all courses.');
} else {
  console.log('🖼️ Course Image Processor with Sharp');
  console.log('');
  console.log('Usage:');
  console.log('  node process-images-locally.js reprocess    # Reprocess all existing courses with proper compression');
  console.log('');
  console.log('Features:');
  console.log('  - Downloads images from Airtable');
  console.log('  - Processes with Sharp (real compression)');
  console.log('  - Creates 4 variants: desktop.png, desktop.webp, mobile.png, mobile.webp');
  console.log('  - Uploads to Supabase Storage');
  console.log('  - Updates database URLs');
  console.log('');
  console.log('Prerequisites:');
  console.log('  - AIRTABLE_API_KEY in .env.local');
  console.log('  - Sharp installed: npm install sharp');
}
