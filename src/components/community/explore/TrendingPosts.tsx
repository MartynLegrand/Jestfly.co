
import React from "react";
import { Post, UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../PostCard";

interface TrendingPostsProps {
  posts: (Post & { author: UserProfile })[];
  isLoading: boolean;
}

const TrendingPosts = ({ posts, isLoading }: TrendingPostsProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-24 w-full" />
          </GlassCard>
        ))}
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No posts found</p>
        <p className="text-sm mt-1">Try different search terms</p>
      </div>
    );
  }

  return (
    <>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default TrendingPosts;
