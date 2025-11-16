
// Export the Supabase client
export { supabase } from "./client";

// Export all authentication functions from auth.ts
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  resetPasswordForEmail
} from "./auth";
