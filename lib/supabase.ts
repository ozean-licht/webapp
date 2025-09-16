import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suwevnhwtmcazjugfmps.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to create a new client instance (useful for server-side rendering and API routes)
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
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
