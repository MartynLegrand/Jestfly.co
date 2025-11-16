
import React from "react";
import { Post, UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import PostCard from "../PostCard";
import CommentList from "../CommentList";
import UserProfileCard from "../UserProfileCard";

interface PostContentProps {
  post: Post & { author: UserProfile };
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GlassCard>
        <PostCard post={post} />
      </GlassCard>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <CommentList postId={post.id} />
          </GlassCard>
        </div>
        
        <div>
          <UserProfileCard user={post.author} />
        </div>
      </div>
    </div>
  );
};

export default PostContent;
