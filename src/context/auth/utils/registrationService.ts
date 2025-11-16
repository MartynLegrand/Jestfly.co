
import { signUp } from "@/lib/supabase";

export type RegisterUserData = {
  username: string;
  display_name: string;
  profile_type: "artist" | "fan" | "collaborator" | "admin";
  [key: string]: any;
};

export async function registerUser(email: string, password: string, userData: RegisterUserData) {
  try {
    console.log("Registering user:", email, "with profile type:", userData.profile_type);
    
    const { data, error } = await signUp(email, password, userData);
    
    if (error) {
      console.error("Registration error:", error);
      return { data: null, error };
    }
    
    console.log("Registration successful:", data);
    return { data, error: null };
  } catch (error: any) {
    console.error("Unexpected registration error:", error);
    return { data: null, error };
  }
}
