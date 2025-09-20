require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const airtableApiKey = process.env.AIRTABLE_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!airtableApiKey) {
  console.error('❌ Missing AIRTABLE_API_KEY');
  console.error('Add it to your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncCoursesFromAirtable() {
  console.log('🔄 Syncing courses from Airtable to Supabase...');

  try {
    // Fetch ALL courses from Airtable
    console.log('📡 Fetching from Airtable...');
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

    console.log(`📋 Found ${airtableCourses.length} published courses`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const record of airtableCourses) {
      try {
        const course = record.fields;
        const slug = course.slug;

        if (!course.thumbnail || !course.thumbnail[0]) {
          skipped++;
          continue;
        }

        console.log(`\\n🎯 Processing: ${course.title.substring(0, 50)}... (${processed + 1}/${airtableCourses.length})`);

        // First, insert/update course in database
        const courseData = {
          title: course.title || '',
          slug: course.slug || '',
          description: course.description || '',
          price: course.price || 0,
          is_published: course.is_public || false,
          course_code: course.course_code || Math.floor(Math.random() * 1000000),
          created_at: course.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // URLs will be set by the Edge Function
          thumbnail_url_desktop: null,
          thumbnail_url_mobile: null
        };

        const { error: upsertError } = await supabase
          .from('courses')
          .upsert(courseData, {
            onConflict: 'slug',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error('❌ Database upsert failed:', upsertError.message);
          errors++;
          continue;
        }

        console.log('✅ Course saved to database');

        // Now process the thumbnail via Edge Function
        const imageUrl = course.thumbnail[0].url;
        console.log('🖼️ Processing thumbnail...');

        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/process-course-thumbnail`;
        const edgeResponse = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            course_slug: slug,
            image_url: imageUrl,
            action: 'process_4_variants'
          })
        });

        if (!edgeResponse.ok) {
          const errorText = await edgeResponse.text();
          console.error('❌ Edge Function failed:', edgeResponse.status, errorText);
          errors++;
        } else {
          const result = await edgeResponse.json();
          console.log('✅ Thumbnail processed:', result.thumbnails ? '4 variants created' : 'success');
          processed++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        console.error('💥 Error processing course:', err.message);
        errors++;
      }
    }

    console.log('\\n📊 Sync Summary:');
    console.log(`✅ Successfully processed: ${processed}`);
    console.log(`⏭️ Skipped (no thumbnail): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);

    if (processed > 0) {
      console.log('\\n🎉 Sync complete! Check your courses at http://localhost:3001/courses');
    }

  } catch (error) {
    console.error('💥 Sync failed:', error.message);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'sync' || args.length === 0) {
  console.log('🚀 Starting full sync from Airtable...');
  syncCoursesFromAirtable();
} else {
  console.log('Usage:');
  console.log('  node sync-from-airtable.js        # Sync all courses');
  console.log('  node sync-from-airtable.js sync   # Sync all courses');
}
