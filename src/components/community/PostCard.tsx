
import { useState, useEffect } from "react";
import { Post } from "@/types/community";
import { UserProfile } from "@/types/user";
import UserAvatar from "@/components/ui/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { likePost, unlikePost, checkIfUserLikedPost } from "@/lib/community/likesService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

interface PostCardProps {
  post: Post & { author: UserProfile };
  onComment?: () => void;
  compact?: boolean;
}

const PostCard = ({ post, onComment, compact = false }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  useEffect(() => {
    if (user) {
      const checkLikeStatus = async () => {
        try {
          const hasLiked = await checkIfUserLikedPost(post.id);
          setIsLiked(hasLiked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      };
      
      checkLikeStatus();
    }
  }, [post.id, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLike(true);
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(post.id);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process like",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handlePostClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border animate-fade-in">
      <div className="flex items-start gap-3 mb-3">
        <Link to={`/community/profile/${post.author.id}`}>
          <UserAvatar user={post.author} />
        </Link>
        <div>
          <div className="flex items-center">
            <Link to={`/community/profile/${post.author.id}`}>
              <h3 className="font-semibold">{post.author.display_name}</h3>
            </Link>
            <span className="ml-2 text-xs text-primary px-2 py-0.5 rounded-full bg-primary/10">
              {post.author.profile_type}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            @{post.author.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {post.title && !compact && (
        <h4 className="font-semibold mb-2 cursor-pointer hover:text-primary" onClick={handlePostClick}>
          {post.title}
        </h4>
      )}

      <p className="mb-4 whitespace-pre-wrap cursor-pointer" onClick={handlePostClick}>
        {post.content}
      </p>

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex gap-6">
          <button 
            className={`flex items-center gap-1 text-sm ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 disabled:opacity-50`}
            onClick={handleLikeToggle}
            disabled={isLoadingLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
          <button 
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            onClick={onComment || (() => navigate(`/community/post/${post.id}`))}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </button>
        </div>
        <div className="flex gap-2">
          <Button className="p-1 rounded-full hover:bg-secondary" variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button className="p-1 rounded-full hover:bg-secondary" variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
