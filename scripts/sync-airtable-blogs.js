/**
 * Airtable to Supabase Blog Sync Script
 * Syncs existing blogs from Airtable to Supabase and triggers thumbnail processing
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with actual key
const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy';
const AIRTABLE_TABLE = 'blogs';

// Sync a single blog from Airtable to Supabase (optimized for batch processing)
async function syncBlog(airtableRecord) {
  const blogData = {
    slug: airtableRecord.fields.slug,
    title: airtableRecord.fields.title || '',
    category: airtableRecord.fields.category || 'Community Love Letter',
    content: airtableRecord.fields.content || '',
    excerpt: airtableRecord.fields.excerpt || '',
    description: airtableRecord.fields.description || '',
    author: airtableRecord.fields.author_name || 'Lia Lohmann',
    author_image_url: airtableRecord.fields.author_image && airtableRecord.fields.author_image[0] ? airtableRecord.fields.author_image[0].url : null,
    read_time_minutes: airtableRecord.fields.read_time_minutes || 5,
    is_published: airtableRecord.fields.is_published !== undefined ? airtableRecord.fields.is_published : true,
    published_at: airtableRecord.fields.published_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    // Check if blog already exists (silent check)
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/blogs?slug=eq.${blogData.slug}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingBlogs = await checkResponse.json();
    let method = 'POST';
    let url = `${SUPABASE_URL}/rest/v1/blogs`;

    if (existingBlogs.length > 0) {
      method = 'PATCH';
      url = `${SUPABASE_URL}/rest/v1/blogs?slug=eq.${blogData.slug}`;
    }

    // Sync blog to Supabase
    const syncResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(blogData)
    });

    if (!syncResponse.ok) {
      const errorData = await syncResponse.json();
      throw new Error(`Sync failed: ${errorData.message}`);
    }

    const syncedBlog = await syncResponse.json();

    // Process thumbnails if there's an attachment (silent processing)
    if (airtableRecord.fields.thumbnail && airtableRecord.fields.thumbnail.length > 0) {
      const thumbnailUrl = airtableRecord.fields.thumbnail[0].url;

      try {
        const thumbResponse = await fetch(`${SUPABASE_URL}/functions/v1/process-blog-thumbnail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            blog_slug: blogData.slug,
            image_url: thumbnailUrl,
            action: 'process_4_variants'
          })
        });

        if (!thumbResponse.ok) {
          const errorData = await thumbResponse.json();
          throw new Error(`Thumbnail processing failed: ${errorData.details}`);
        }
      } catch (thumbError) {
        // Silent error for batch processing - don't fail the whole sync
        console.warn(`⚠️ Thumbnail processing failed for ${blogData.slug}: ${thumbError.message}`);
      }
    }

    return syncedBlog[0];

  } catch (error) {
    // Silent error handling for batch processing
    console.error(`❌ Failed to sync ${blogData.slug}: ${error.message}`);
    return null;
  }
}

// Fetch blogs from Airtable (optimized)
async function fetchAirtableBlogs() {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?view=Grid%20view`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.records;

  } catch (error) {
    console.error('💥 Error fetching from Airtable:', error.message);
    console.log('\n🔑 Please make sure AIRTABLE_API_KEY is set in your .env.local file');
    return [];
  }
}

// Optimized batch sync function - reduced load to prevent Edge Function overload
async function syncBlogsBatch(blogs, batchSize = 2, batchDelay = 3000) {
  const results = [];
  const totalBatches = Math.ceil(blogs.length / batchSize);

  console.log(`🚀 Starting LOW-LOAD batch sync: ${blogs.length} blogs in ${totalBatches} batches of ${batchSize}\n`);

  for (let i = 0; i < blogs.length; i += batchSize) {
    const batch = blogs.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} blogs)`);

    // Process batch in parallel (but with reduced concurrency)
    const batchPromises = batch.map(blog => syncBlog(blog));
    const batchResults = await Promise.all(batchPromises);

    // Count successful syncs
    const successful = batchResults.filter(result => result !== null).length;
    results.push(...batchResults.filter(result => result !== null));

    console.log(`✅ Batch ${batchNumber} completed: ${successful}/${batch.length} blogs synced`);
    console.log(`📊 Progress: ${results.length}/${blogs.length} total blogs synced\n`);

    // Increased delay between batches to avoid overwhelming Edge Functions
    if (i + batchSize < blogs.length) {
      console.log(`⏱️ Waiting ${batchDelay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, batchDelay));
    }
  }

  return results;
}

// Main sync function with performance optimization
async function syncAllBlogs(limit = null) {
  console.log('🚀 Starting HIGH-PERFORMANCE Airtable to Supabase Blog Sync\n');

  const startTime = Date.now();

  // Fetch blogs from Airtable
  const blogs = await fetchAirtableBlogs();

  if (blogs.length === 0) {
    console.log('❌ No blogs found to sync');
    return;
  }

  // Limit if specified
  const blogsToSync = limit ? blogs.slice(0, limit) : blogs;

  console.log(`🎯 Target: ${blogsToSync.length} blogs`);
  console.log(`⚡ Strategy: 2 parallel requests per batch, 3s delay between batches`);
  console.log(`⏱️ Estimated time: ~${Math.ceil(blogsToSync.length / 2) * 3 + (blogsToSync.length / 2 * 5)} seconds\n`);

  // Use optimized batch processing with reduced load
  const results = await syncBlogsBatch(blogsToSync, 2, 3000);

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log(`\n🎉 SYNC COMPLETED!`);
  console.log(`📊 Results: ${results.length}/${blogsToSync.length} blogs synced successfully`);
  console.log(`⏱️ Total time: ${duration.toFixed(1)} seconds`);
  console.log(`⚡ Average speed: ${(results.length / duration).toFixed(1)} blogs/second`);
  console.log(`💾 Estimated data savings: ~${(results.length * 0.4).toFixed(1)} MB (WebP compression)`);

  return results;
}

// Command line interface
const command = process.argv[2];
const limit = process.argv[3] ? parseInt(process.argv[3]) : null;

switch (command) {
  case 'sync':
    syncAllBlogs(limit);
    break;
  case 'preview':
    fetchAirtableBlogs().then(blogs => {
      if (blogs.length > 0) {
        console.log('📋 Preview of first 3 blogs:');
        blogs.slice(0, 3).forEach((blog, index) => {
          console.log(`${index + 1}. ${blog.fields.title} (${blog.fields.slug})`);
          console.log(`   Author: ${blog.fields.author_name || 'Lia Lohmann'}`);
          console.log(`   Thumbnail: ${blog.fields.thumbnail ? '✅ Has attachment' : '❌ No attachment'}`);
          console.log('');
        });
      }
    });
    break;
  default:
    console.log('📰 Airtable to Supabase Blog Sync Script');
    console.log('');
    console.log('Usage:');
    console.log('  node sync-airtable-blogs.js sync [limit]    - Sync blogs from Airtable');
    console.log('  node sync-airtable-blogs.js preview         - Preview available blogs');
    console.log('');
    console.log('Examples:');
    console.log('  node sync-airtable-blogs.js sync            - Sync all blogs');
    console.log('  node sync-airtable-blogs.js sync 3          - Sync first 3 blogs');
    console.log('  node sync-airtable-blogs.js preview         - Show available blogs');
    console.log('');
    console.log('Environment Variables:');
    console.log('  AIRTABLE_API_KEY                 - Airtable API Key (Personal Access Token)');
    console.log('  NEXT_PUBLIC_SUPABASE_URL        - Supabase URL');
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY   - Supabase Anon Key');
    console.log('  SUPABASE_SERVICE_ROLE_KEY       - Supabase Service Role Key (for writing)');
    console.log('');
    break;
}

module.exports = {
  syncAllBlogs,
  syncBlog,
  fetchAirtableBlogs
};
