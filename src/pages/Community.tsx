
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Post, UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchPosts, subscribeToPostUpdates } from "@/lib/community/postService";
import CreatePostModal from "@/components/community/CreatePostModal";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import PostList from "@/components/community/PostList";
import CreatePostPrompt from "@/components/community/CreatePostPrompt";
import CommunityActions from "@/components/community/CommunityActions";
import ErrorDisplay from "@/components/error/ErrorDisplay";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { tryCatch } from "@/utils/error-utils";

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [posts, setPosts] = useState<(Post & { author: UserProfile })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [data, fetchError] = await tryCatch(() => fetchPosts(category || undefined));
        
        if (fetchError) {
          setError(new Error(fetchError.message));
          handleError(fetchError);
          return;
        }
        
        if (data) {
          setPosts(data);
          setHasMore(data.length >= 10);
        }
      } catch (error: any) {
        setError(error instanceof Error ? error : new Error(String(error)));
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
    setPage(0);
  }, [category, handleError]);
  
  useEffect(() => {
    const unsubscribe = subscribeToPostUpdates((newPost) => {
      setPosts(prevPosts => {
        const postIndex = prevPosts.findIndex(p => p.id === newPost.id);
        
        if (postIndex !== -1) {
          const updatedPosts = [...prevPosts];
          updatedPosts[postIndex] = { ...updatedPosts[postIndex], ...newPost };
          return updatedPosts;
        } else if (!category || newPost.category === category) {
          return [newPost as any, ...prevPosts];
        }
        
        return prevPosts;
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [category]);
  
  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
  };
  
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      return;
    }
    
    setCreatePostOpen(true);
  };
  
  const retryLoading = () => {
    setError(null);
    setPosts([]);
    setPage(0);
    
    // Reload posts
    setIsLoading(true);
    fetchPosts(category || undefined)
      .then(data => {
        setPosts(data);
        setHasMore(data.length >= 10);
      })
      .catch(error => {
        handleError(error);
        setError(error instanceof Error ? error : new Error(String(error)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const trendingTopics = [
    "#NewMusic", "#Collaboration", "#JestCoinTips", "#UpcomingArtists", "#VirtualConcerts"
  ];

  return (
    <MainLayout>
      <CommunityHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <CommunityActions 
            onCreatePost={handleCreatePost} 
            onCategoryChange={handleCategoryChange} 
          />

          <CreatePostPrompt 
            user={user} 
            onCreatePost={handleCreatePost} 
          />

          {error ? (
            <ErrorDisplay 
              title="Erro ao carregar posts"
              message={error.message || "Não foi possível carregar os posts. Por favor, tente novamente."}
              retry={retryLoading}
            />
          ) : (
            <PostList 
              posts={posts}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              searchTerm={searchTerm}
            />
          )}
        </div>

        <CommunitySidebar trendingTopics={trendingTopics} />
      </div>
      
      <CreatePostModal 
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
    </MainLayout>
  );
};

export default Community;
