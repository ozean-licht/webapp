#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, title, subtitle, description, price, thumbnail_url_desktop')
      .order('title');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('\n=== AKTUELLE KURSE ===\n');
    data.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Subtitle: ${course.subtitle || 'NICHT GESETZT'}`);
      console.log(`   Preis: €${course.price || 'N/A'}`);
      console.log(`   Thumbnail: ${course.thumbnail_url_desktop ? 'Ja' : 'Nein'}`);
    });
    
    console.log(`\n\nGesamt: ${data.length} Kurse`);
    
    // JSON für weitere Verarbeitung
    console.log('\n\n=== JSON DATA ===');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

getCourses();
