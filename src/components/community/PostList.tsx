
import { useState, useEffect } from "react";
import { Post } from "@/types/community";
import { UserProfile } from "@/types/user";
import PostCard from "@/components/community/PostCard";
import GlassCard from "@/components/ui/GlassCard";
import CommentList from "@/components/community/CommentList";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

interface PostListProps {
  posts: (Post & { author: UserProfile })[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  searchTerm: string;
}

const PostList = ({ posts, isLoading, hasMore, onLoadMore, searchTerm }: PostListProps) => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  const handlePostComment = (postId: string) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <GlassCard key={i} className="animate-pulse h-48">
            <div className="h-full"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found.</p>
          <p className="text-sm mt-1">Be the first to start a conversation!</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <div key={post.id}>
          <PostCard 
            post={post} 
            onComment={() => handlePostComment(post.id)}
          />
          {activePostId === post.id && (
            <GlassCard className="mt-1">
              <CommentList postId={post.id} />
            </GlassCard>
          )}
        </div>
      ))}
      
      {hasMore && !isLoading && (
        <div ref={ref} className="py-4 text-center">
          <Button 
            variant="outline"
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
