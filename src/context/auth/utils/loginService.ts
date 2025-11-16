
import { signIn, getCurrentUser } from "@/lib/supabase";

export async function performLogin(email: string, password: string) {
  console.log("Login attempt for:", email);
  
  try {
    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }
    
    if (data?.user) {
      try {
        const { user: currentUser, error: userError } = await getCurrentUser();
        
        if (userError) {
          console.error("Error getting user after login:", userError);
          return { success: false, error: userError };
        }
        
        if (currentUser) {
          console.log("User fetched after login:", currentUser);
          return { success: true, user: currentUser };
        }
      } catch (getUserError) {
        console.error("Error in getCurrentUser after login:", getUserError);
        return { success: false, error: getUserError };
      }
    }
    
    return { success: false, error: { message: "Unknown error occurred during login" } };
  } catch (error: any) {
    console.error("Unexpected login error:", error);
    return { success: false, error };
  }
}
