import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Data Types
interface Course {
  slug: string;
  title: string;
  description: string;
  price: number;
  is_public: boolean;
  thumbnail_url_desktop?: string;
  thumbnail_url_mobile?: string;
  course_code: number;
  created_at: string;
  updated_at: string;
}

interface Blog {
  slug: string;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  author: string;
  read_time_minutes: number;
  is_public: boolean;
  thumbnail_url_desktop?: string;
  thumbnail_url_mobile?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  mitgliedsnummer: string;
  vorname: string;
  nachname: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface QueryRequest {
  endpoint: 'courses' | 'blogs' | 'profiles' | 'course' | 'blog' | 'profile' | 'partner-deal-courses';
  params?: {
    slug?: string;
    id?: string;
    user_id?: string;
    limit?: number;
    published_only?: boolean;
    min_price?: number;
  };
}

// Bekannte problematische Kurse, die Fallbacks brauchen
const PROBLEMATIC_COURSES = [
  'sirian-gateway-gruppen-channeling-event-am-28-07-2025',
  'equinox-gruppen-channeling-event-am-22-09-2025',
  'earth-code',
  'lions-gate-gruppen-channeling-event-am-08-08-2025',
  'solstice-gruppen-channeling-event-am-21-06-2025',
  'no-limits-lcq-mental-decoding'
];

// Erstelle Fallback-Image als Data-URL
function createFallbackImage(title: string): string {
  // Entferne Sonderzeichen und kodierv für Base64
  const cleanTitle = title
    .replace(/[äöüÄÖÜß]/g, (match) => {
      const map: { [key: string]: string } = {
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue',
        'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
        'ß': 'ss'
      };
      return map[match] || match;
    })
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Entferne andere Sonderzeichen
    .substring(0, 25);

  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#001212"/>
    <rect x="20" y="20" width="560" height="297" fill="#00D4FF" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${cleanTitle}...</text>
  </svg>`;

  // Verwende encodeURIComponent für sichere UTF-8 Kodierung
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

// Course Query Functions
async function getCourses(limit: number = 50, publishedOnly: boolean = true, minPrice?: number): Promise<Course[]> {
  console.log(`🔍 Querying courses: limit=${limit}, published=${publishedOnly}, min_price=${minPrice || 'none'}`);

  let query = supabase
    .from('courses')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }

  const { data: courses, error } = await query;

  if (error) {
    console.error('❌ Course query error:', error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`✅ Found ${courses?.length || 0} courses`);

  // Verarbeite problematische Kurse und erstelle Fallbacks
  if (courses) {
    courses.forEach(course => {
      const isProblematic = PROBLEMATIC_COURSES.some(problemSlug =>
        course.slug.includes(problemSlug)
      );

      if (isProblematic) {
        console.log(`🚨 Problematic course detected: ${course.title.substring(0, 50)}...`);
        console.log(`   Generating fallback images...`);

        // Erstelle Fallback-URLs für problematische Kurse
        const fallbackUrl = createFallbackImage(course.title);
        course.thumbnail_url_desktop = fallbackUrl;
        course.thumbnail_url_mobile = fallbackUrl;
      }

      // Debug für spezielle Kurse
      if (course.title.includes('Q&A') || course.title.includes('Energie Update') ||
          course.title.includes('Sirian') || course.title.includes('Equinox')) {
        console.log(`🔧 Course: ${course.title.substring(0, 50)}...`);
        console.log(`   Desktop: ${course.thumbnail_url_desktop ? '✅' : '❌'}`);
        console.log(`   Mobile:  ${course.thumbnail_url_mobile ? '✅' : '❌'}`);
        console.log(`   Problematic: ${isProblematic ? '🚨 YES' : '✅ NO'}`);
      }
    });
  }

  return courses || [];
}

// Spezifische Funktion für Partner Deal Kurse
async function getPartnerDealCourses(limit: number = 50): Promise<Course[]> {
  console.log(`🎯 Querying Partner Deal courses: price between 100-1000€, limit=${limit}`);

  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_public', true)
    .gte('price', 100)
    .lte('price', 1000)
    .order('price', { ascending: false })
    .limit(limit);

  const { data: courses, error } = await query;

  if (error) {
    console.error('❌ Partner Deal courses query error:', error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`✅ Found ${courses?.length || 0} Partner Deal courses (100-1000€)`);

  // Verarbeite problematische Kurse und erstelle Fallbacks
  if (courses) {
    courses.forEach(course => {
      const isProblematic = PROBLEMATIC_COURSES.some(problemSlug =>
        course.slug.includes(problemSlug)
      );

      if (isProblematic) {
        console.log(`🚨 Problematic course detected: ${course.title.substring(0, 50)}...`);
        console.log(`   Generating fallback images...`);

        const fallbackUrl = createFallbackImage(course.title);
        course.thumbnail_url_desktop = fallbackUrl;
        course.thumbnail_url_mobile = fallbackUrl;
      }
    });
  }

  return courses || [];
}

async function getCourse(slug: string): Promise<Course | null> {
  console.log(`🔍 Querying single course: ${slug}`);

  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error) {
    console.error('❌ Single course query error:', error.message);
    if (error.code === 'PGRST116') {
      return null; // Course not found
    }
    throw new Error(`Database error: ${error.message}`);
  }

  console.log('✅ Course found:', course.title);

  // Behandle problematische Single-Course
  const isProblematic = PROBLEMATIC_COURSES.some(problemSlug =>
    course.slug.includes(problemSlug)
  );

  if (isProblematic) {
    console.log(`🚨 Problematic single course detected: ${course.title}`);
    console.log(`   Generating fallback images...`);

    const fallbackUrl = createFallbackImage(course.title);
    course.thumbnail_url_desktop = fallbackUrl;
    course.thumbnail_url_mobile = fallbackUrl;
  }

  return course;
}

// Blog Query Functions
async function getBlogs(limit: number = 50, publishedOnly: boolean = true): Promise<Blog[]> {
  console.log(`🔍 Querying blogs: limit=${limit}, published=${publishedOnly}`);

  let query = supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data: blogs, error } = await query;

  if (error) {
    console.error('❌ Blog query error:', error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`✅ Found ${blogs?.length || 0} blogs`);

  return blogs || [];
}

async function getBlog(slug: string): Promise<Blog | null> {
  console.log(`🔍 Querying single blog: ${slug}`);

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error) {
    console.error('❌ Single blog query error:', error.message);
    if (error.code === 'PGRST116') {
      return null; // Blog not found
    }
    throw new Error(`Database error: ${error.message}`);
  }

  console.log('✅ Blog found:', blog.title);

  return blog;
}

// Profile Query Functions
async function getProfiles(limit: number = 50): Promise<Profile[]> {
  console.log(`🔍 Querying profiles: limit=${limit}`);

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ Profile query error:', error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`✅ Found ${profiles?.length || 0} profiles`);
  return profiles || [];
}

async function getProfile(id?: string, userId?: string): Promise<Profile | null> {
  console.log(`🔍 Querying single profile: id=${id}, user_id=${userId}`);

  let query = supabase
    .from('profiles')
    .select('*');

  if (id) {
    query = query.eq('id', id);
  } else if (userId) {
    query = query.eq('user_id', userId);
  } else {
    throw new Error('Either id or user_id must be provided');
  }

  const { data: profile, error } = await query.single();

  if (error) {
    console.error('❌ Single profile query error:', error.message);
    if (error.code === 'PGRST116') {
      return null; // Profile not found
    }
    throw new Error(`Database error: ${error.message}`);
  }

  console.log('✅ Profile found:', profile.vorname, profile.nachname);
  return profile;
}

// Main Query Handler
async function handleQuery(request: QueryRequest) {
  const { endpoint, params = {} } = request;

  switch (endpoint) {
    case 'courses':
      return await getCourses(params.limit || 50, params.published_only !== false, params.min_price);

    case 'partner-deal-courses':
      return await getPartnerDealCourses(params.limit || 50);

    case 'blogs':
      return await getBlogs(params.limit || 50, params.published_only !== false);

    case 'course':
      if (!params.slug) {
        throw new Error('Slug parameter required for course endpoint');
      }
      return await getCourse(params.slug);

    case 'blog':
      if (!params.slug) {
        throw new Error('Slug parameter required for blog endpoint');
      }
      return await getBlog(params.slug);

    case 'profiles':
      return await getProfiles(params.limit || 50);

    case 'profile':
      if (!params.id && !params.user_id) {
        throw new Error('Either id or user_id parameter required for profile endpoint');
      }
      return await getProfile(params.id, params.user_id);

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

// Main Edge Function
serve(async (req) => {
  console.log('🚀 QUERY-DATA EDGE FUNCTION CALLED');
  console.log('📡 Method:', req.method);
  console.log('🔗 URL:', req.url);

  try {
    // Parse query parameters for GET requests
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const endpoint = url.searchParams.get('endpoint') as QueryRequest['endpoint'];

      if (!endpoint) {
        return new Response(JSON.stringify({
          error: 'Missing endpoint parameter',
          usage: 'GET /?endpoint=courses&limit=50&published_only=true',
          examples: [
            'GET /?endpoint=courses&limit=50&published_only=true',
            'GET /?endpoint=blogs&limit=20&published_only=true',
            'GET /?endpoint=partner-deal-courses&limit=20',
            'GET /?endpoint=course&slug=energy-code-basic',
            'GET /?endpoint=blog&slug=my-blog-post',
            'GET /?endpoint=courses&min_price=100'
          ],
          available_endpoints: ['courses', 'blogs', 'partner-deal-courses', 'course', 'blog', 'profiles', 'profile']
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        });
      }

      const params: QueryRequest['params'] = {};

      // Parse common parameters
      const limit = url.searchParams.get('limit');
      if (limit) params.limit = parseInt(limit);

      const publishedOnly = url.searchParams.get('published_only');
      if (publishedOnly !== null) params.published_only = publishedOnly === 'true';

      const minPrice = url.searchParams.get('min_price');
      if (minPrice) params.min_price = parseInt(minPrice);

      // Parse endpoint-specific parameters
      switch (endpoint) {
        case 'partner-deal-courses':
          // No additional parameters needed, uses default min_price=100
          break;
        case 'course':
          params.slug = url.searchParams.get('slug') || undefined;
          break;
        case 'profile':
          params.id = url.searchParams.get('id') || undefined;
          params.user_id = url.searchParams.get('user_id') || undefined;
          break;
      }

      const result = await handleQuery({ endpoint, params });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Parse JSON body for POST requests
    if (req.method === 'POST') {
      const request: QueryRequest = await req.json();
      const result = await handleQuery(request);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Method not allowed
    return new Response(JSON.stringify({
      error: 'Method not allowed',
      allowed_methods: ['GET', 'POST', 'OPTIONS']
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('💥 Query error:', error);

    return new Response(JSON.stringify({
      error: 'Query failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
});
