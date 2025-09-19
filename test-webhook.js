/**
 * Test Script für Airtable Thumbnail Webhook
 * Simuliert Airtable Webhook Payloads
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simuliere Airtable Webhook Payload für Thumbnail-Änderung
async function simulateThumbnailChange(courseSlug, newImageUrl) {
  console.log(`🖼️ Simulating thumbnail change for course: ${courseSlug}`);
  console.log(`🔗 New image URL: ${newImageUrl}\n`);

  // Airtable Webhook Payload Format
  const webhookPayload = {
    baseId: 'app5e7mJQhxDYD5Zy',
    tableId: 'courses',
    recordId: 'rec_test_record_id', // Placeholder
    changedFields: ['thumbnail'],
    fields: {
      slug: courseSlug,
      title: `Test Course: ${courseSlug}`,
      thumbnail: [{
        url: newImageUrl
      }]
    }
  };

  // Simuliere Webhook-Aufruf (normalerweise von Airtable gesendet)
  const webhookUrl = 'http://localhost:5678/webhook/airtable-thumbnail-webhook'; // N8N Webhook URL

  try {
    console.log('📤 Sending webhook payload to N8N...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Airtable-Webhook/1.0'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ Webhook accepted!');
      console.log('📄 Response:', result);
    } else {
      console.log('❌ Webhook failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('💥 Webhook error (N8N not running?):', error.message);
    console.log('💡 Make sure N8N is running with: n8n start');
    console.log('💡 Or test the Edge Function directly...');

    // Fallback: Test Edge Function direkt
    await testEdgeFunctionDirectly(courseSlug, newImageUrl);
  }
}

// Test Edge Function direkt (Fallback)
async function testEdgeFunctionDirectly(courseSlug, imageUrl) {
  console.log('\n🔄 Testing Edge Function directly...');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/process-course-thumbnail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        course_slug: courseSlug,
        png_url: imageUrl
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Edge Function works!');
      console.log('📊 Thumbnails generated:', result.thumbnails);
    } else {
      const error = await response.json();
      console.log('❌ Edge Function failed:', error.details);
    }
  } catch (error) {
    console.log('💥 Edge Function error:', error.message);
  }
}

// Test mit verschiedenen Szenarien
async function runWebhookTests() {
  console.log('🧪 Starting Webhook Tests...\n');

  const tests = [
    {
      name: 'Small PNG Test',
      courseSlug: 'webhook-test-small-png',
      imageUrl: 'https://httpbin.org/image/png'
    },
    {
      name: 'Different PNG Test',
      courseSlug: 'webhook-test-different-png',
      imageUrl: 'https://via.placeholder.com/400x300.png'
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 Running test: ${test.name}`);
    console.log('='.repeat(50));

    await simulateThumbnailChange(test.courseSlug, test.imageUrl);

    // Kurze Pause zwischen Tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'test':
    const courseSlug = process.argv[3] || 'webhook-test-course';
    const imageUrl = process.argv[4] || 'https://httpbin.org/image/png';
    simulateThumbnailChange(courseSlug, imageUrl);
    break;
  case 'batch':
    runWebhookTests();
    break;
  default:
    console.log('🎣 Airtable Webhook Test Script');
    console.log('');
    console.log('Usage:');
    console.log('  node test-webhook.js test [courseSlug] [imageUrl]  - Single test');
    console.log('  node test-webhook.js batch                         - Batch tests');
    console.log('');
    console.log('Examples:');
    console.log('  node test-webhook.js test webhook-test-123 https://httpbin.org/image/png');
    console.log('  node test-webhook.js batch');
    console.log('');
    console.log('Requirements:');
    console.log('  - N8N running on http://localhost:5678');
    console.log('  - Airtable webhook workflow imported');
    console.log('  - Environment variables configured');
    console.log('');
    runWebhookTests();
    break;
}

module.exports = {
  simulateThumbnailChange,
  testEdgeFunctionDirectly,
  runWebhookTests
};
