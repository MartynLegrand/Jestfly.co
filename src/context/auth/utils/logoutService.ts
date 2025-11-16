
import { signOut } from "@/lib/supabase";

export async function performLogout() {
  try {
    console.log("Attempting to sign out");
    const { error } = await signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
    
    console.log("Sign out successful");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Logout service error:", error);
    return { success: false, error };
  }
}
