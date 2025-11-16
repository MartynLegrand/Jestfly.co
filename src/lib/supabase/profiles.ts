
import { supabase } from "./client";
import { UserProfile } from "@/types";

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { data: null, error };
  }
};

export const getUserActivityLogs = async (userId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from("user_activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { data: null, error };
  }
};

export const logUserActivity = async (
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any,
  success = true
) => {
  try {
    const { data, error } = await supabase.rpc("log_user_activity", {
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ? JSON.stringify(details) : null,
      success
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error logging user activity:", error);
    return { data: null, error };
  }
};

export const checkUserPermission = async (requiredType: string) => {
  try {
    const { data, error } = await supabase.rpc("check_user_profile_type", {
      required_type: requiredType
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error checking user permission:", error);
    return { data: null, error };
  }
};
