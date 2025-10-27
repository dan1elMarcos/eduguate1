// Supabase configuration - These values come from your Supabase integration
const SUPABASE_URL = "https://your-project.supabase.co" // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = "your-anon-key" // Replace with your actual Supabase anon key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Export for use in other files
window.supabaseClient = supabase
