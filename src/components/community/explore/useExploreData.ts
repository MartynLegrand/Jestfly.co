
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile, Post } from "@/types";

export type ExploreTab = "trending" | "people";

export const useExploreData = (activeTab: ExploreTab, searchTerm: string) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<(Post & { author: UserProfile })[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const { data, error } = await supabase
          .from("community_posts")
          .select(`
            *,
            author:profiles!community_posts_user_id_fkey(id, username, display_name, profile_type, avatar)
          `)
          .order("likes_count", { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setPosts(data as (Post & { author: UserProfile })[]);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    const fetchPopularUsers = async () => {
      try {
        setIsLoadingUsers(true);
        // This is a simplified way to fetch "popular" users
        // In a real app, you'd calculate this based on follows or activity
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .limit(15);
          
        if (error) throw error;
        setUsers(data as UserProfile[]);
      } catch (error) {
        console.error("Error fetching popular users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    if (activeTab === "trending") {
      fetchTrendingPosts();
    } else if (activeTab === "people") {
      fetchPopularUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(user => 
    user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    filteredUsers,
    filteredPosts,
    isLoadingUsers,
    isLoadingPosts
  };
};
