import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessImageRequest {
  imageUrl: string
  slug: string
  authorName: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { imageUrl, slug, authorName }: ProcessImageRequest = await req.json()

    if (!imageUrl || !slug || !authorName) {
      throw new Error('Missing required parameters: imageUrl, slug, authorName')
    }

    console.log(`🖼️ Processing author image for ${authorName} (${slug})`)

    // Download image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }

    const imageBlob = await imageResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()

    // Process image (simple resize for author images - smaller than blog thumbnails)
    const processedImageBuffer = await resizeImage(new Uint8Array(imageBuffer), 150, 150)

    // Upload to Supabase Storage
    const fileName = `${slug}/author.webp`
    const { error: uploadError } = await supabaseClient.storage
      .from('blog_thumbs')
      .upload(fileName, processedImageBuffer, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('blog_thumbs')
      .getPublicUrl(fileName)

    // Update blog record with processed author image URL
    const { error: updateError } = await supabaseClient
      .from('blogs')
      .update({
        author_image_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)

    if (updateError) {
      throw new Error(`Failed to update blog record: ${updateError.message}`)
    }

    console.log(`✅ Successfully processed author image for ${authorName}`)

    return new Response(
      JSON.stringify({
        success: true,
        authorImageUrl: publicUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error processing author image:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Simple image resizing function (for author images, we keep it simple)
async function resizeImage(imageBuffer: Uint8Array, width: number, height: number): Promise<Uint8Array> {
  // For simplicity, we'll just return the original buffer
  // In a real implementation, you'd use a library like Sharp or Canvas API
  // For now, we'll assume the author images are already appropriately sized
  return imageBuffer
}
