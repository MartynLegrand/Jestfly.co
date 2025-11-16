
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

interface Review {
  id: string;
  userId: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    username: string;
    displayName: string;
    avatar?: string;
  };
}

interface ProductReviewsProps {
  productId: number;
}

// UserAvatar component
const UserAvatar = ({ user, className }: { user: { avatar_url?: string, display_name: string }, className?: string }) => {
  return (
    <Avatar className={className}>
      {user.avatar_url ? (
        <AvatarImage src={user.avatar_url} alt={user.display_name} />
      ) : (
        <AvatarFallback>{user.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
      )}
    </Avatar>
  );
};

// Mock function to fetch product reviews - replace with actual API call
const fetchProductReviews = async (productId: number): Promise<Review[]> => {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data for now
  return [
    {
      id: '1',
      userId: 'user1',
      productId,
      rating: 5,
      comment: 'Absolutely love this product! The quality is exceptional and it arrived earlier than expected.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        username: 'music_lover',
        displayName: 'Melody Jackson',
        avatar: 'https://random.imagecdn.app/150/150',
      }
    },
    {
      id: '2',
      userId: 'user2',
      productId,
      rating: 4,
      comment: 'Great product overall. The only thing that could be improved is the packaging.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        username: 'beatmaker99',
        displayName: 'Ryan Cooper',
        avatar: 'https://random.imagecdn.app/151/151',
      }
    }
  ];
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newReview, setNewReview] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);
  
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => fetchProductReviews(productId),
  });
  
  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      toast({
        title: "Review cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review submitted",
      description: "Your review has been submitted successfully",
    });
    
    // Reset form
    setNewReview('');
    setNewRating(5);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <GlassCard>
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }
  
  if (error) {
    return (
      <GlassCard>
        <div className="text-center py-6">
          <p className="text-red-500">Failed to load reviews</p>
          <Button variant="outline" className="mt-2">Retry</Button>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-medium mb-6">Customer Reviews</h3>
        
        {/* Write a review section */}
        {user && (
          <div className="mb-8 border-b pb-6">
            <h4 className="font-medium mb-3">Write a Review</h4>
            
            {/* Rating selector */}
            <div className="flex items-center mb-3">
              <p className="text-sm text-muted-foreground mr-3">Your Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`h-5 w-5 ${
                        star <= newRating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Textarea
              placeholder="Share your thoughts about this product..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="mb-3"
            />
            
            <Button onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        )}
        
        {/* Reviews list */}
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <UserAvatar 
                    user={{
                      avatar_url: review.user.avatar,
                      display_name: review.user.displayName
                    }} 
                    className="h-10 w-10" 
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{review.user.displayName}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-2">No reviews yet</p>
            <p className="text-sm text-muted-foreground">Be the first to share your thoughts on this product!</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ProductReviews;
