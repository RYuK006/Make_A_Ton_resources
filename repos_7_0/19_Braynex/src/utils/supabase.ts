import { createClient } from "@supabase/supabase-js";

// Use import.meta.env to access environment variables in Vite
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
