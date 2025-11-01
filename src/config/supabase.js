// Supabase Configuration
// Replace these values with your actual Supabase project credentials
// You can also set these as environment variables in your system

export const SUPABASE_CONFIG = {
  // Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
 
  // Alternative: You can hardcode your credentials here temporarily for testing
  // Uncomment and replace with your actual values:
   url: 'https://gexqvoyormusfyhqktud.supabase.co',
   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdleHF2b3lvcm11c2Z5aHFrdHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTg0NDEsImV4cCI6MjA3NzA3NDQ0MX0.6X2OkqlgavNRvuoQQ5EJGor-UPF_hkbqHzL7aY9UZiA',
}

// Instructions:
// 1. Replace the placeholder values above with your real Supabase credentials
// 2. Or create a .env.local file with:
//    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
// 3. Or set them as system environment variables
// 4. Or uncomment and use the hardcoded values above
