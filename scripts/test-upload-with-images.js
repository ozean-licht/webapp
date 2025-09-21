require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const keyType = supabaseServiceKey ? 'SERVICE_ROLE' : 'ANON';

console.log('🔑 Using:', keyType, 'key');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageUpload() {
  console.log('🖼️ Testing image upload with', keyType, 'key...');

  try {
    // Create a simple test image with Sharp
    const testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    console.log('📸 Created test image:', testImageBuffer.length, 'bytes');

    // Try to upload
    const testFileName = 'test-image-' + Date.now() + '.png';
    const { error } = await supabase.storage
      .from('course_thumbs')
      .upload(testFileName, testImageBuffer, {
        contentType: 'image/png'
      });

    if (error) {
      console.error('❌ Image upload failed:', error.message);
      console.log('🔍 Error details:', error);

      if (error.message.includes('violates row-level security policy')) {
        console.log('💡 SOLUTION: Update Supabase Storage Policies');
        console.log('');
        console.log('Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/course_thumbs');
        console.log('Click "Policies" and create:');
        console.log('');
        console.log('CREATE POLICY "Allow image uploads" ON storage.objects');
        console.log('FOR INSERT WITH CHECK (bucket_id = \'course_thumbs\');');
        console.log('');
        console.log('CREATE POLICY "Allow image reads" ON storage.objects');
        console.log('FOR SELECT USING (bucket_id = \'course_thumbs\');');
      }
    } else {
      console.log('✅ Image upload successful!');

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('course_thumbs')
        .getPublicUrl(testFileName);

      console.log('🌐 Public URL:', publicUrl.publicUrl);

      // Test if URL works
      const response = await fetch(publicUrl.publicUrl);
      console.log('🌐 URL Status:', response.status);

      // Clean up
      console.log('🧹 Cleaning up test file...');
      await supabase.storage
        .from('course_thumbs')
        .remove([testFileName]);

      console.log('✅ Test file cleaned up');
    }

  } catch (err) {
    console.error('💥 Test failed:', err.message);
  }
}

testImageUpload();
