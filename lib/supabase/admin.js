import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client uses the SECRET service-role key and must never be imported
// into any client component or exposed to the browser. Server-only.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
