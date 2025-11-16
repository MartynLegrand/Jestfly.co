
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fxbdwhwpgyqxmirujzcr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4YmR3aHdwZ3lxeG1pcnVqemNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzM0MzEsImV4cCI6MjA1NjE0OTQzMX0.0NdPIJIDCI8s-LADALM_jWja7ldCtStTAIVs_iei2lM";

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
