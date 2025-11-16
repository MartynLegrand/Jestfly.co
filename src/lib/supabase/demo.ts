
import { supabase } from "./client";
import { signUp } from "./auth";

export const createDemoAdminAccount = async () => {
  try {
    const email = "saintgangltda@gmail.com";
    const password = "jestflydemo";
    
    // Check if account already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    
    if (existingUser) {
      return { success: true, message: "Admin demo account already exists", userId: existingUser.id };
    }
    
    // Create the user account
    const { data, error } = await signUp(email, password, {
      username: "saintgang_admin",
      display_name: "Saint Gang Admin",
      profile_type: "admin",
    });
    
    if (error) throw error;
    
    if (data?.user) {
      // Verify email immediately for demo account
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      );
      
      if (confirmError) {
        console.warn("Could not auto-verify email:", confirmError);
      }
      
      // Set initial wallet balance for admin demo
      await supabase.rpc("reward_user", {
        user_id: data.user.id,
        amount: 1000,
        reward_description: "Initial admin demo account balance"
      });
      
      return { success: true, message: "Admin demo account created successfully", userId: data.user.id };
    }
    
    return { success: false, message: "Failed to create admin demo account" };
  } catch (error: any) {
    console.error("Error creating demo admin account:", error);
    return { success: false, message: error.message || "Unknown error occurred" };
  }
};
