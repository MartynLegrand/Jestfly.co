
import React from "react";
import { Post, UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import PostList from "../PostList";

interface UserPostsSectionProps {
  user: UserProfile;
  posts: (Post & { author: UserProfile })[];
  isLoading: boolean;
}

const UserPostsSection = ({ user, posts, isLoading }: UserPostsSectionProps) => {
  if (isLoading) {
    return (
      <GlassCard>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-md"></div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <h3 className="text-xl font-semibold mb-6">Posts by {user.display_name}</h3>
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          <PostList 
            posts={posts} 
            isLoading={false} 
            hasMore={false} 
            onLoadMore={() => {}} 
            searchTerm=""
          />
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No posts yet</p>
          <p className="text-sm mt-1">This user hasn't posted anything yet.</p>
        </div>
      )}
    </GlassCard>
  );
};

export default UserPostsSection;
