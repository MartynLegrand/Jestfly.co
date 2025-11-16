
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostById } from "@/lib/community/postService";
import { Post, UserProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const usePostDetail = (postId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<(Post & { author: UserProfile }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const postData = await fetchPostById(postId);
        setPost(postData);
      } catch (error: any) {
        toast({
          title: "Error loading post",
          description: error.message,
          variant: "destructive",
        });
        navigate("/community");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [postId, toast, navigate]);

  return { post, isLoading };
};
