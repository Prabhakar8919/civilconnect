import { createClient } from "@supabase/supabase-js";

// Retrieve environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// A common mistake is forgetting to prefix environment variables with VITE_
// This will throw a more helpful error message if they are missing.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and/or Publishable Key are missing from .env file. Make sure to prefix them with VITE_");
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);