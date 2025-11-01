import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase'

const supabaseUrl = SUPABASE_CONFIG.url
const supabaseAnonKey = SUPABASE_CONFIG.anonKey

// For development, use placeholder values if environment variables are missing or incomplete
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-key'

// Check if we have valid Supabase credentials
const isValidUrl = supabaseUrl && supabaseUrl.includes('.supabase.co') && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project-id')
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 100 && !supabaseAnonKey.includes('placeholder') && !supabaseAnonKey.includes('your_supabase_anon_key_here')

// Create Supabase client with proper configuration for Next.js
export const supabase = createClient(
  isValidUrl ? supabaseUrl : fallbackUrl,
  isValidKey ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: false, // Disable session persistence for SSR compatibility
    },
  }
)

// Check if we're using real Supabase credentials
export const isSupabaseConfigured = () => {
  return isValidUrl && isValidKey
}
