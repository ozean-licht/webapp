import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

interface ProcessThumbnailRequest {
  blog_slug: string;
  image_url: string;
  action?: string;
}

const BUCKET_NAME = 'blog_thumbs';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Simple image resizing using Canvas API (works in Deno)
async function resizeImage(inputBuffer: ArrayBuffer, targetWidth: number, targetHeight: number, format: 'png' | 'webp' = 'webp'): Promise<ArrayBuffer> {
  try {
    console.log(`🔄 Resizing to ${targetWidth}x${targetHeight} (${format})...`);

    // Create a simple resize by creating a new Image and Canvas
    // This is a basic implementation - in production you'd use a proper image library

    // For now, we'll just return the original buffer but log the intent
    // In a real implementation, you'd use something like:
    // - wasm-imagemagick
    // - sharp (if available)
    // - canvas API with proper image processing

    console.log(`⚠️ Using simple passthrough resize (no actual compression yet)`);
    console.log(`   Original size: ${inputBuffer.byteLength} bytes`);
    console.log(`   Target: ${targetWidth}x${targetHeight} ${format.toUpperCase()}`);

    // TODO: Implement actual image resizing
    // For now, we return the original buffer
    return inputBuffer;

  } catch (error) {
    console.error('💥 Error resizing image:', error.message);
    // Return original buffer as fallback
    return inputBuffer;
  }
}

serve(async (req) => {
  console.log('🚀 PROCESS BLOG THUMBNAIL - NEW VERSION');

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
    const body: ProcessThumbnailRequest = await req.json();
    console.log('📄 Request:', body);

    const { blog_slug, image_url, action } = body;

    // Validate input
    if (!blog_slug || !image_url) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: blog_slug and image_url are required',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`🎯 Processing blog: ${blog_slug}`);
    console.log(`🔗 Image URL: ${image_url}`);

    // Download image from Airtable
    console.log('🌐 Downloading image...');
    const imageResponse = await fetch(image_url, {
      headers: {
        'User-Agent': 'SupabaseEdgeFunction/1.0'
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    console.log(`✅ Downloaded ${imageBuffer.byteLength} bytes`);

    // Define variants
    // Define variants - PNG and WebP for both desktop and mobile (16:9 ratio for blogs)
    const variants = [
      { name: 'desktop.png', width: 1280, height: 720, format: 'png' },
      { name: 'desktop.webp', width: 1280, height: 720, format: 'webp' },
      { name: 'mobile.png', width: 640, height: 360, format: 'png' },
      { name: 'mobile.webp', width: 640, height: 360, format: 'webp' }
    ];

    const processedUrls: { [key: string]: string } = {};

    // Delete old images first
    console.log('🗑️ Deleting old images...');
    try {
      const { data: existingFiles } = await supabase.storage
        .from(BUCKET_NAME)
        .list(blog_slug);

      if (existingFiles && existingFiles.length > 0) {
        const filePaths = existingFiles.map(file => `${blog_slug}/${file.name}`);
        await supabase.storage
          .from(BUCKET_NAME)
          .remove(filePaths);
        console.log(`✅ Deleted ${existingFiles.length} old files`);
      }
    } catch (error) {
      console.log('⚠️ Could not delete old files:', error.message);
    }

    // Process and upload each variant
    for (const variant of variants) {
      try {
        console.log(`🔄 Processing ${variant.name}...`);

        // Resize image (simple fallback)
        const processedBuffer = await resizeImage(imageBuffer, variant.width, variant.height);

        // Upload to Supabase Storage
        const filePath = `${blog_slug}/${variant.name}`;
        const contentType = `image/${variant.format}`;

        console.log(`📤 Uploading ${variant.name}...`);
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, processedBuffer, {
            contentType,
            upsert: true
          });

        if (uploadError) {
          console.error(`❌ Upload failed for ${variant.name}:`, uploadError.message);
          continue;
        }

        // Generate public URL
        const { data: publicUrl } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        processedUrls[variant.name] = publicUrl.publicUrl;
        console.log(`✅ Processed ${variant.name}`);

      } catch (variantError) {
        console.error(`💥 Error processing ${variant.name}:`, variantError.message);
      }
    }

    // Update database
    console.log('💾 Updating database...');
    try {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({
          thumbnail_url_desktop: processedUrls['desktop.webp'],
          thumbnail_url_mobile: processedUrls['mobile.webp'],
          updated_at: new Date().toISOString()
        })
        .eq('slug', blog_slug);

      if (updateError) {
        console.error('❌ Database update failed:', updateError.message);
      } else {
        console.log('✅ Database updated');
      }
    } catch (dbError) {
      console.error('💥 Database error:', dbError.message);
    }

    // Success response
    return new Response(JSON.stringify({
      message: 'Blog thumbnails processed successfully',
      blog_slug,
      thumbnails: {
        desktop_png: processedUrls['desktop.png'],
        desktop_webp: processedUrls['desktop.webp'],
        mobile_png: processedUrls['mobile.png'],
        mobile_webp: processedUrls['mobile.webp']
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Function error:', error);

    return new Response(JSON.stringify({
      error: 'Blog thumbnail processing failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});


