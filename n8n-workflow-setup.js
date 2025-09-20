require('dotenv').config({ path: '.env.local' });

console.log('🔧 N8N Workflow Setup für automatischen Kurs-Sync');
console.log('=' * 55);

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Environment Check:');
console.log('  AIRTABLE_API_KEY:', airtableApiKey ? '✅' : '❌');
console.log('  SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
console.log('  SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');

if (!airtableApiKey || !supabaseUrl || !supabaseAnonKey) {
  console.log('\\n❌ Missing environment variables!');
  console.log('Add to your .env.local:');
  console.log('  AIRTABLE_API_KEY=your_airtable_key');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

console.log('\\n🎯 N8N Workflow für automatischen Sync:');
console.log('');
console.log('1. Öffne N8N Dashboard');
console.log('2. Erstelle neuen Workflow: "Course Sync"');
console.log('3. Füge diese Nodes hinzu:');
console.log('');
console.log('   📅 Schedule Trigger');
console.log('      - Every hour');
console.log('');
console.log('   📊 Airtable');
console.log('      - Base ID: app5e7mJQhxDYD5Zy');
console.log('      - Table: courses');
console.log('      - View: Grid view');
console.log('      - Filter: IS_AFTER(updated_at, DATEADD(NOW(), -1, \'hours\'))');
console.log('');
console.log('   🔀 Switch');
console.log('      - If: $node[\\"Airtable\\"].json.length > 0');
console.log('');
console.log('   ⚡ HTTP Request (für jeden Kurs)');
console.log('      - Method: POST');
console.log('      - URL: ' + supabaseUrl + '/functions/v1/process-course-thumbnail');
console.log('      - Headers:');
console.log('        - Authorization: Bearer ' + supabaseAnonKey);
console.log('        - Content-Type: application/json');
console.log('      - Body:');
console.log('        {');
console.log('          \\"course_slug\\": \\"{{$node[\\"Airtable\\"].item.json.fields.slug}}\\",');
console.log('          \\"image_url\\": \\"{{$node[\\"Airtable\\"].item.json.fields.thumbnail[0].url}}\\"');
console.log('        }');
console.log('');
console.log('4. Speichere und aktiviere den Workflow');
console.log('');
console.log('✅ Vorteile:');
console.log('   - Automatische Synchronisation');
console.log('   - Neue Kurse werden automatisch verarbeitet');
console.log('   - Geänderte Bilder werden neu komprimiert');
console.log('   - Kein manuelles Eingreifen nötig');

console.log('\\n🎉 Setup complete! Dein System ist bereit für automatischen Sync.');
