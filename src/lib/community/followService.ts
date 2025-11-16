
import { supabase } from "../supabase";

export const followUser = async (userId: string) => {
  const { error } = await supabase.rpc("follow_user", { following: userId });
  
  if (error) throw error;
  return true;
};

export const unfollowUser = async (userId: string) => {
  const { error } = await supabase.rpc("unfollow_user", { following: userId });
  
  if (error) throw error;
  return true;
};

export const isFollowing = async (followingId: string) => {
  const { data, error } = await supabase.rpc("is_following", { 
    follower: (await supabase.auth.getUser()).data.user?.id,
    following: followingId 
  });
  
  if (error) throw error;
  return data;
};

export const getFollowersCount = async (userId: string) => {
  const { data, error } = await supabase.rpc("count_followers", { user_id: userId });
  
  if (error) throw error;
  return data;
};

export const getFollowingCount = async (userId: string) => {
  const { data, error } = await supabase.rpc("count_following", { user_id: userId });
  
  if (error) throw error;
  return data;
};
