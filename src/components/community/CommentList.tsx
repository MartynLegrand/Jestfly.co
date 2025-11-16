
import { useState, useEffect } from "react";
import { Comment, UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchComments, createComment, subscribeToCommentsForPost } from "@/lib/community/commentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/ui/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, Flag, MoreHorizontal } from "lucide-react";

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<(Comment & { author: UserProfile })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId);
        setComments(data);
      } catch (error: any) {
        toast({
          title: "Error loading comments",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToCommentsForPost(postId, (newComment) => {
      setComments((prevComments) => {
        // Check if this comment already exists
        const exists = prevComments.some(c => c.id === newComment.id);
        if (exists) {
          // Update existing comment
          return prevComments.map(c => c.id === newComment.id ? {...c, ...newComment} : c);
        } else {
          // Add new comment
          return [...prevComments, newComment as any];
        }
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [postId, toast]);
  
  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        user_id: user.id,
        content: newComment,
      });
      
      setNewComment("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="my-4 text-center">Loading comments...</div>;
  }
  
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
      
      {user && (
        <div className="flex gap-3 mb-6">
          <UserAvatar user={user.profile} size="sm" />
          <div className="flex-1 flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || !newComment.trim()}
              size="sm"
            >
              Post
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 pb-3 border-b last:border-none">
              <UserAvatar user={comment.author} size="sm" />
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{comment.author.display_name}</p>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
                <div className="flex gap-3 mt-2">
                  <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary">
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes_count}</span>
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-destructive">
                    <Flag className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
