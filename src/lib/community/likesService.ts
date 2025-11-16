
import { supabase } from "../supabase";

export const likePost = async (postId: string) => {
  const { error } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: (await supabase.auth.getUser()).data.user?.id });

  if (error) throw error;
  return true;
};

export const unlikePost = async (postId: string) => {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return true;
};

export const checkIfUserLikedPost = async (postId: string) => {
  const { data, error } = await supabase
    .from("post_likes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return data.length > 0;
};
