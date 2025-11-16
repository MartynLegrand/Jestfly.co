
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("[Supabase] Initializing client");

if (!supabaseUrl || !supabaseAnonKey) {
  const error = "Missing Supabase configuration";
  console.error("[Supabase]", error);
  throw new Error(error);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'jestfly_supabase_auth'
  }
});

// Test the connection immediately
console.log("[Supabase] Testing connection...");

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("[Supabase] Connection error:", error);
    return;
  }
  console.log("[Supabase] Connection successful, session exists:", !!data.session);
}).catch(err => {
  console.error("[Supabase] Fatal connection error:", err);
});

// Subscribe to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("[Supabase] Auth state changed:", { event, userId: session?.user?.id });
});
