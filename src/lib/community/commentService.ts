
import { supabase } from "../supabase";
import { Comment, UserProfile } from "@/types";

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from("post_comments")
    .select(`
      *,
      author:profiles!post_comments_user_id_fkey(id, username, display_name, profile_type, avatar)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as (Comment & { author: UserProfile })[];
};

export const createComment = async (commentData: Omit<Comment, "id" | "created_at" | "likes_count" | "author">) => {
  const { data, error } = await supabase
    .from("post_comments")
    .insert(commentData)
    .select();

  if (error) throw error;
  return data[0] as Comment;
};

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
  return true;
};

export const subscribeToCommentsForPost = (postId: string, callback: (comment: Comment) => void) => {
  const channel = supabase
    .channel(`public:post_comments:post_id=eq.${postId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` }, 
      (payload) => callback(payload.new as Comment)
    )
    .subscribe();
  
  return () => supabase.removeChannel(channel);
};
