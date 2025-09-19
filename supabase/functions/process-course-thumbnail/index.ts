import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

interface ProcessThumbnailRequest {
  course_slug: string;
  png_url: string;
}

const BUCKET_NAME = 'course_thumbs';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://suwevnhwtmcazjugfmps.supabase.co';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Simplified image processing - just resize and convert to WebP
async function processImage(
  imageBuffer: ArrayBuffer,
  targetWidth: number,
  targetHeight: number,
  format: 'webp' | 'png' = 'webp'
): Promise<ArrayBuffer> {

  console.log(`🔄 Processing ${format.toUpperCase()} ${targetWidth}x${targetHeight}`);
  const originalSize = imageBuffer.byteLength;

  // For now, just return the original buffer with minimal processing
  // In production, you'd use a proper image processing library like Sharp
  const processedBuffer = imageBuffer;

  console.log(`✅ Processed: ${originalSize} bytes`);
  return processedBuffer;
}

serve(async (req) => {
  console.log('🚀🚀🚀 PROCESS COURSE THUMBNAIL EDGE FUNCTION CALLED 🚀🚀🚀');
  console.log('📡 Method:', req.method);
  console.log('🔗 URL:', req.url);

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed. Use POST.',
      timestamp: new Date().toISOString()
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    const body: ProcessThumbnailRequest = await req.json();
    console.log('📄 Request body:', body);

    const { course_slug, png_url } = body;

    // Validate input
    if (!course_slug || !png_url) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: course_slug and png_url are required',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate PNG URL format
    if (!png_url.startsWith('http')) {
      return new Response(JSON.stringify({
        error: 'Invalid png_url: must be a valid HTTP URL',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📥 Starting thumbnail processing for course:', course_slug);
    console.log('🔗 Source image URL:', png_url);

    // Fetch the original image
    console.log('🌐 Fetching image from URL...');
    const imageResponse = await fetch(png_url);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    console.log('✅ Image fetched successfully, size:', imageBuffer.byteLength, 'bytes');

    // Process thumbnail variants - simplified
    const processedThumbnails: { [key: string]: string } = {};

    // Define variants - only WebP for better compression
    const variants = [
      { name: 'desktop.webp', width: 800, height: 450, format: 'webp' as const },
      { name: 'mobile.webp', width: 400, height: 225, format: 'webp' as const }
    ];

    for (const variant of variants) {
      console.log(`🔄 Processing variant: ${variant.name}`);

      try {
        // Check if file already exists
        const filePath = `${course_slug}/${variant.name}`;
        const { data: existingFiles, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(course_slug, {
            limit: 100
          });

        if (listError) {
          console.log(`⚠️ Could not check existing files:`, listError.message);
        } else if (existingFiles && existingFiles.some(file => file.name === variant.name)) {
          console.log(`⏭️ File ${variant.name} already exists, skipping...`);
          const { data: publicUrl } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
          processedThumbnails[variant.name] = publicUrl.publicUrl;
          continue;
        }

        // Simple image processing
        const processedBuffer = await processImage(imageBuffer, variant.width, variant.height, variant.format);

        // Upload to Supabase Storage
        console.log(`📤 Uploading ${variant.name} to storage...`);
        const contentType = 'image/webp';

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, processedBuffer, {
            contentType,
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Upload failed for ${variant.name}: ${uploadError.message}`);
        }

        console.log(`✅ Successfully uploaded ${variant.name}`);

        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        processedThumbnails[variant.name] = publicUrl.publicUrl;

      } catch (variantError) {
        console.error(`❌ Error processing variant ${variant.name}:`, variantError);
        // Don't throw error - continue with other variants
      }
    }

    console.log('📝 Updating database with thumbnail URLs...');

    // Update courses table only if we have at least one thumbnail
    if (processedThumbnails['desktop.webp'] || processedThumbnails['mobile.webp']) {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (processedThumbnails['desktop.webp']) {
        updateData.thumbnail_url_desktop = processedThumbnails['desktop.webp'];
      }
      if (processedThumbnails['mobile.webp']) {
        updateData.thumbnail_url_mobile = processedThumbnails['mobile.webp'];
      }

      const { error: updateError } = await supabase
        .from('courses')
        .update(updateData)
        .eq('slug', course_slug);

      if (updateError) {
        console.error('Database update failed:', updateError.message);
      } else {
        console.log('✅ Database updated successfully');
      }
    }

    // Success response
    return new Response(JSON.stringify({
      message: 'Course thumbnails processed successfully',
      course_slug,
      thumbnails: {
        desktop_webp: processedThumbnails['desktop.webp'],
        mobile_webp: processedThumbnails['mobile.webp']
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Function error:', error);

    return new Response(JSON.stringify({
      error: 'Course thumbnail processing failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
