
import { supabase } from "../supabase";
import { Post, UserProfile } from "@/types";

export const fetchPosts = async (category?: string, limit = 10, page = 0) => {
  let query = supabase
    .from("community_posts")
    .select(`
      *,
      author:profiles!community_posts_user_id_fkey(id, username, display_name, profile_type, avatar)
    `)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as (Post & { author: UserProfile })[];
};

export const fetchPostById = async (postId: string) => {
  const { data, error } = await supabase
    .from("community_posts")
    .select(`
      *,
      author:profiles!community_posts_user_id_fkey(id, username, display_name, profile_type, avatar)
    `)
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data as Post & { author: UserProfile };
};

export const createPost = async (postData: Omit<Post, "id" | "created_at" | "updated_at" | "likes_count" | "comments_count" | "author">) => {
  const { data, error } = await supabase
    .from("community_posts")
    .insert(postData)
    .select();

  if (error) throw error;
  return data[0] as Post;
};

export const updatePost = async (postId: string, updates: Partial<Post>) => {
  const { data, error } = await supabase
    .from("community_posts")
    .update(updates)
    .eq("id", postId)
    .select();

  if (error) throw error;
  return data[0] as Post;
};

export const deletePost = async (postId: string) => {
  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId);

  if (error) throw error;
  return true;
};

export const subscribeToPostUpdates = (callback: (post: Post) => void) => {
  const channel = supabase
    .channel('public:community_posts')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'community_posts' }, 
      (payload) => callback(payload.new as Post)
    )
    .subscribe();
  
  return () => supabase.removeChannel(channel);
};
