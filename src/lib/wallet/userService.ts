
import { supabase } from "@/lib/supabase";

// Search for users (for transfers)
export const searchUsers = async (query: string) => {
  console.log("Searching users with query:", query);
  
  if (!query || query.length < 2) return [];
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, profile_type, avatar')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);
    
    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("User search error:", error);
    return [];
  }
};
