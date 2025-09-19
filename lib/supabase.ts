import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for client-side usage - single instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to create a new client instance (useful for server-side rendering and API routes)
// Returns the same instance to avoid multiple GoTrueClient instances
export function createSupabaseClient() {
  return supabase
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
        is_published: record.fields.is_public || false,
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

// Query-Data Edge Function - Zentralisierte Datenabfragen
async function queryData(endpoint: string, params: Record<string, any> = {}) {
  try {
    const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/query-data`;

    console.log(`🚀 Calling Query-Data Edge Function: ${endpoint}`, params);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        endpoint,
        params
      })
    });

    if (!response.ok) {
      throw new Error(`Query-Data Edge Function error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Query-Data returned ${Array.isArray(data) ? data.length : 'single'} ${endpoint}`);

    return data;
  } catch (error) {
    console.error(`❌ Query-Data Edge Function call failed for ${endpoint}:`, error);
    throw error;
  }
}

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
const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getCoursesFromEdge(limit: number = 50): Promise<any[]> {
  try {
    console.log('🚀 Calling Query-Data Edge Function for courses...');
    const courses = await queryData('courses', {
      limit,
      published_only: true
    });

    console.log(`✅ Query-Data returned ${courses.length} courses`);

    // Debug problematic courses
    courses.forEach(course => {
      if (course.title.includes('Q&A') || course.title.includes('Energie Update') || course.title.includes('Partner & Friends')) {
        console.log(`🔧 Edge Course: ${course.title.substring(0, 50)}...`);
        console.log(`   Desktop: ${course.thumbnail_url_desktop ? '✅' : '❌'}`);
        console.log(`   Mobile:  ${course.thumbnail_url_mobile ? '✅' : '❌'}`);
      }
    });

    return courses;
  } catch (error) {
    console.error('❌ Query-Data Edge Function call failed:', error);
    // Fallback to direct Supabase query
    console.log('🔄 Falling back to direct Supabase query...');
    return getCoursesDirect(limit);
  }
}

export async function getCourseFromEdge(slug: string): Promise<any | null> {
  try {
    console.log('🚀 Calling Query-Data Edge Function for single course...');
    const course = await queryData('course', { slug });

    console.log(`✅ Query-Data returned course: ${course.title}`);
    return course;
  } catch (error) {
    console.error('❌ Query-Data Edge Function call failed:', error);
    // Fallback to direct Supabase query
    console.log('🔄 Falling back to direct Supabase query...');
    return getCourseDirect(slug);
  }
}

// Fallback functions
async function getCoursesDirect(limit: number = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
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
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
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

// Eigene Query-Funktion für einen einzelnen Kurs
export async function getCourseWithReliableImages(slug: string) {
  try {
    console.log('🚀 Calling Query-Data Edge Function for single course...');
    const course = await queryData('course', { slug });

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
    console.error('💥 Error calling Query-Data Edge Function:', error);
    return null;
  }
}

// Profile Query Functions (über Query-Data Edge Function)
export async function getProfilesFromEdge(limit: number = 50): Promise<any[]> {
  try {
    console.log('🚀 Calling Query-Data Edge Function for profiles...');
    const profiles = await queryData('profiles', { limit });
    console.log(`✅ Query-Data returned ${profiles.length} profiles`);
    return profiles;
  } catch (error) {
    console.error('❌ Query-Data Edge Function call failed:', error);
    console.log('🔄 Falling back to direct Supabase query...');
    return getProfilesDirect(limit);
  }
}

export async function getProfileFromEdge(id?: string, userId?: string): Promise<any | null> {
  try {
    console.log('🚀 Calling Query-Data Edge Function for single profile...');
    const profile = await queryData('profile', {
      id,
      user_id: userId
    });
    console.log(`✅ Query-Data returned profile: ${profile.vorname} ${profile.nachname}`);
    return profile;
  } catch (error) {
    console.error('❌ Query-Data Edge Function call failed:', error);
    console.log('🔄 Falling back to direct Supabase query...');
    return getProfileDirect(id, userId);
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
