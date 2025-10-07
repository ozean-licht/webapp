import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Browser Client for client-side usage
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Legacy compatibility - create a browser client instance for backward compatibility
export const supabase = createBrowserSupabaseClient()

// Function to create a new client instance (useful for server-side rendering and API routes)
export function createSupabaseClient() {
  return createBrowserSupabaseClient()
}

// ALTERNATIVE: Kurse aus Airtable mit direkten Bild-URLs laden
export async function getCoursesFromAirtable(limit: number = 50) {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const AIRTABLE_BASE_ID = 'app5e7mJQhxDYD5Zy';
    const AIRTABLE_TABLE = 'courses';

    if (!AIRTABLE_API_KEY || AIRTABLE_API_KEY.includes('XXXX')) {
      console.log('⚠️ Airtable API Key nicht konfiguriert, verwende Supabase Fallback');
      return getCoursesWithReliableImages(limit);
    }

    console.log('🔍 Fetching courses directly from Airtable...');

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?view=Grid%20view&maxRecords=${limit}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const courses = data.records
      .filter((record: any) => record.fields.is_public)
      .map((record: any) => ({
        slug: record.fields.slug,
        course_code: record.fields.course_code || 100,
        title: record.fields.title,
        description: record.fields.description || '',
        price: record.fields.price || 0,
        is_public: record.fields.is_public || false,
        // Verwende DIREKTE Airtable URLs - viel zuverlässiger!
        thumbnail_url_desktop: record.fields.thumbnail ? record.fields.thumbnail[0].url : null,
        thumbnail_url_mobile: record.fields.thumbnail ? record.fields.thumbnail[0].url : null,
        reliable_image_url: record.fields.thumbnail ? record.fields.thumbnail[0].url : createFallbackImageUrl(record.fields.title),
        created_at: record.createdTime,
        updated_at: record.fields.updated_at || record.createdTime,
        // Markiere als Airtable-Quelle
        source: 'airtable'
      }));

    console.log(`✅ Loaded ${courses.length} courses directly from Airtable`);
    return courses;

  } catch (error) {
    console.error('💥 Error loading from Airtable:', error.message);
    console.log('🔄 Falling back to Supabase...');
    return getCoursesWithReliableImages(limit);
  }
}

// Direkte Supabase-Abfragen - Keine Edge Functions mehr nötig

// Erstelle eine zuverlässige Fallback-Image-URL
export function createFallbackImageUrl(title: string) {
  const shortTitle = title.substring(0, 25)
  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#001212"/>
    <rect x="20" y="20" width="560" height="297" fill="#00D4FF" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${shortTitle}...</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Edge Function Helper Functions

export async function getCoursesFromEdge(limit: number = 50): Promise<any[]> {
  try {
    console.log('🚀 Loading courses directly from Supabase...');
    const courses = await getCoursesDirect(limit);

    console.log(`✅ Loaded ${courses.length} courses`);

    // Debug problematic courses
    courses.forEach(course => {
      if (course.title.includes('Q&A') || course.title.includes('Energie Update') || course.title.includes('Partner & Friends')) {
        console.log(`🔧 Course: ${course.title.substring(0, 50)}...`);
        console.log(`   Desktop: ${course.thumbnail_url_desktop ? '✅' : '❌'}`);
        console.log(`   Mobile:  ${course.thumbnail_url_mobile ? '✅' : '❌'}`);
      }
    });

    return courses;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return [];
  }
}

export async function getCourseFromEdge(slug: string): Promise<any | null> {
  try {
    console.log('🚀 Loading single course from Supabase...');
    const course = await getCourseDirect(slug);

    console.log(`✅ Loaded course: ${course?.title || 'Not found'}`);
    return course;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return null;
  }
}

// Fallback functions
async function getCoursesDirect(limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, title, subtitle, description, price, is_public, thumbnail_url_desktop, thumbnail_url_mobile, tags, created_at, updated_at')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Direct query error:', error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error('💥 Direct query failed:', error)
    return []
  }
}

async function getCourseDirect(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, title, subtitle, description, price, is_public, thumbnail_url_desktop, thumbnail_url_mobile, tags, created_at, updated_at')
      .eq('slug', slug)
      .eq('is_public', true)
      .single()

    if (error) {
      console.error('❌ Direct query error:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('💥 Direct query failed:', error)
    return null
  }
}

// Eigene Query-Funktion für mehrere Kurse mit zuverlässigen Bildern
export async function getCoursesWithReliableImages(limit: number = 50) {
  try {
    console.log('🚀 Loading courses with reliable images directly from Supabase...');
    const courses = await getCoursesDirect(limit);

    // Verarbeite die Bilder für zuverlässiges Loading
    return courses.map(course => ({
      ...course,
      // Stelle sicher, dass die URLs korrekt sind
      thumbnail_url_desktop: course.thumbnail_url_desktop || null,
      thumbnail_url_mobile: course.thumbnail_url_mobile || null,
      // Füge eine zuverlässige Image-URL hinzu
      reliable_image_url: course.thumbnail_url_desktop ||
                         course.thumbnail_url_mobile ||
                         createFallbackImageUrl(course.title)
    }));

  } catch (error) {
    console.error('💥 Error loading courses:', error);
    return [];
  }
}

// Eigene Query-Funktion für einen einzelnen Kurs
export async function getCourseWithReliableImages(slug: string) {
  try {
    console.log('🚀 Loading single course with reliable images from Supabase...');
    const course = await getCourseDirect(slug);

    if (!course) return null;

    // Verarbeite die Bilder für zuverlässiges Loading
    return {
      ...course,
      // Stelle sicher, dass die URLs korrekt sind
      thumbnail_url_desktop: course.thumbnail_url_desktop || null,
      thumbnail_url_mobile: course.thumbnail_url_mobile || null,
      // Füge eine zuverlässige Image-URL hinzu
      reliable_image_url: course.thumbnail_url_desktop ||
                         course.thumbnail_url_mobile ||
                         createFallbackImageUrl(course.title)
    };

  } catch (error) {
    console.error('💥 Error loading course:', error);
    return null;
  }
}

// Funktion für Partner Deal - Kurse über 100€
export async function getCoursesForPartnerDeal(): Promise<any[]> {
  try {
    console.log('🚀 Loading courses over 100€ for Partner Deal via Edge Function...');

    // Verwende die bestehende query-data Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/query-data?endpoint=partner-deal-courses&limit=50`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      console.error('❌ Edge Function error:', response.status, response.statusText);
      throw new Error(`Edge Function returned ${response.status}`);
    }

    const courses = await response.json();

    if (!Array.isArray(courses)) {
      console.error('❌ Unexpected response format:', courses);
      return [];
    }

    console.log(`✅ Loaded ${courses.length} courses over 100€ for Partner Deal via Edge Function`);

    // Debug: Zeige erste paar Kurse
    if (courses.length > 0) {
      console.log('📊 Sample Partner Deal courses:', courses.slice(0, 3).map(c => ({
        title: c.title,
        price: c.price,
        slug: c.slug
      })));
    }

    return courses;
  } catch (error) {
    console.error('💥 Error loading Partner Deal courses via Edge Function:', error);
    // Fallback zur direkten Supabase-Abfrage falls Edge Function fehlschlägt
    console.log('🔄 Falling back to direct Supabase query...');
    return await getCoursesForPartnerDealFallback();
  }
}

// Fallback-Funktion falls Edge Function nicht funktioniert
async function getCoursesForPartnerDealFallback(): Promise<any[]> {
  try {
    console.log('🔄 Using fallback: Direct Supabase query for Partner Deal courses...');

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_public', true)
      .gte('price', 100)
      .order('price', { ascending: false })
      .limit(50);

    if (error) {
      console.error('❌ Fallback query error:', error.message);
      return [];
    }

    console.log(`✅ Fallback loaded ${data?.length || 0} courses over 100€`);
    return data || [];
  } catch (error) {
    console.error('💥 Fallback also failed:', error);
    return [];
  }
}

// Profile Query Functions (direkte Supabase-Abfragen)
export async function getProfilesFromEdge(limit: number = 50): Promise<any[]> {
  try {
    console.log('🚀 Loading profiles from Supabase...');
    const profiles = await getProfilesDirect(limit);
    console.log(`✅ Loaded ${profiles.length} profiles`);
    return profiles;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return [];
  }
}

export async function getProfileFromEdge(id?: string, userId?: string): Promise<any | null> {
  try {
    console.log('🚀 Loading single profile from Supabase...');
    const profile = await getProfileDirect(id, userId);
    console.log(`✅ Loaded profile: ${profile?.vorname} ${profile?.nachname}`);
    return profile;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return null;
  }
}

// Fallback functions für direkte Datenbank-Abfragen
async function getProfilesDirect(limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Direct profiles query error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('💥 Direct profiles query failed:', error);
    return [];
  }
}

async function getProfileDirect(id?: string, userId?: string): Promise<any | null> {
  try {
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

    const { data, error } = await query.single();

    if (error) {
      console.error('❌ Direct profile query error:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('💥 Direct profile query failed:', error);
    return null;
  }
}

// Blog Query Functions (direkte Supabase-Abfragen)
export async function getBlogsFromEdge(limit: number = 50): Promise<any[]> {
  try {
    console.log('🚀 Loading blogs directly from Supabase...');
    const blogs = await getBlogsDirect(limit);
    console.log(`✅ Loaded ${blogs.length} blogs`);
    return blogs;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return [];
  }
}

export async function getBlogFromEdge(slug: string): Promise<any | null> {
  try {
    console.log('🚀 Loading single blog from Supabase...');
    const blog = await getBlogDirect(slug);
    console.log(`✅ Loaded blog: ${blog?.title || 'Not found'}`);
    return blog;
  } catch (error) {
    console.error('❌ Direct query failed:', error);
    return null;
  }
}

// Fallback functions für direkte Blog-Datenbank-Abfragen
async function getBlogsDirect(limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      // Removed .eq('is_public', true) - column doesn't exist in schema
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Direct blogs query error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('💥 Direct blogs query failed:', error);
    return [];
  }
}

async function getBlogDirect(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      // Removed .eq('is_public', true) - column doesn't exist in schema
      .single();

    if (error) {
      console.error('❌ Direct blog query error:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('💥 Direct blog query failed:', error);
    return null;
  }
}

// Database Types (optional - kannst du später mit Supabase CLI generieren)
export type Database = {
  // Hier werden deine Datenbanktypen definiert
  // Beispiel:
  // public: {
  //   Tables: {
  //     users: {
  //       Row: {
  //         id: string
  //         email: string
  //         created_at: string
  //       }
  //       Insert: {
  //         id?: string
  //         email: string
  //         created_at?: string
  //       }
  //       Update: {
  //         id?: string
  //         email?: string
  //         created_at?: string
  //       }
  //     }
  //   }
  // }
}
