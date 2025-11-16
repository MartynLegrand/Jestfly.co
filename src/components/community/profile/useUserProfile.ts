
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile, Post } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useUserProfile = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<(Post & { author: UserProfile })[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [joinDate, setJoinDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setIsLoadingUser(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*, created_at")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        // Store the join date separately since it's not in the UserProfile type
        if (data) {
          setJoinDate(data.created_at || null);
          // Remove created_at before setting as UserProfileType to avoid type issues
          const { created_at, ...profileData } = data;
          setUser(profileData as UserProfile);
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
        navigate("/community");
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    const fetchUserPosts = async () => {
      if (!id) return;
      
      try {
        setIsLoadingPosts(true);
        const { data, error } = await supabase
          .from("community_posts")
          .select(`
            *,
            author:profiles!community_posts_user_id_fkey(id, username, display_name, profile_type, avatar)
          `)
          .eq("user_id", id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setPosts(data as (Post & { author: UserProfile })[]);
      } catch (error: any) {
        console.error("Error loading user posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    fetchUser();
    fetchUserPosts();
  }, [id, toast, navigate]);

  return {
    user,
    posts,
    isLoadingUser,
    isLoadingPosts,
    joinDate
  };
};
