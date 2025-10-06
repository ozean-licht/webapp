import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

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
  endpoint: 'courses' | 'profiles' | 'course' | 'profile';
  params?: {
    slug?: string;
    id?: string;
    user_id?: string;
    limit?: number;
    published_only?: boolean;
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

serve(async (req) => {
  console.log('🚀 GET COURSES EDGE FUNCTION CALLED');

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    console.log('📋 Request params:', { slug, limit });

    if (slug) {
      // Single course request
      console.log(`🔍 Fetching single course: ${slug}`);

      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) {
        console.error('❌ Error fetching course:', error);
        return new Response(JSON.stringify({ error: 'Course not found', details: error.message }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
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

      return new Response(JSON.stringify(course), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        }
      });
    } else {
      // Multiple courses request
      console.log(`🔍 Fetching ${limit} courses`);

      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching courses:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch courses', details: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
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
              course.title.includes('Partner & Friends') || course.title.includes('Sirian') ||
              course.title.includes('Equinox') || course.title.includes('Lions Gate')) {
            console.log(`🔧 Course: ${course.title.substring(0, 50)}...`);
            console.log(`   Desktop: ${course.thumbnail_url_desktop ? '✅' : '❌'}`);
            console.log(`   Mobile:  ${course.thumbnail_url_mobile ? '✅' : '❌'}`);
            console.log(`   Problematic: ${isProblematic ? '🚨 YES' : '✅ NO'}`);
          }
        });
      }

      return new Response(JSON.stringify(courses || []), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
        }
      });
    }

  } catch (error) {
    console.error('💥 Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
