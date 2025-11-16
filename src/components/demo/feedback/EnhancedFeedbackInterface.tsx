
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DemoSubmission } from '@/types';
import { MessageSquare } from 'lucide-react';
import DemoFeedback from './DemoFeedback';
import FeedbackForm from './FeedbackForm';
import EmptyFeedback from './EmptyFeedback';
import FeedbackStats from './FeedbackStats';
import { useDemoFeedback } from '@/hooks/use-demo-feedback';
import { Skeleton } from '@/components/ui/skeleton';

interface EnhancedFeedbackInterfaceProps {
  submission: DemoSubmission;
  className?: string;
}

const EnhancedFeedbackInterface: React.FC<EnhancedFeedbackInterfaceProps> = ({
  submission,
  className = ''
}) => {
  const { user } = useAuth();
  const { feedback, isLoading, refreshFeedback } = useDemoFeedback(submission.id);
  
  // Check if user can give feedback (admin or collaborator)
  const canGiveFeedback = user?.profile?.profile_type === 'admin' || user?.profile?.profile_type === 'collaborator';
  
  // Check if there are any feedback items
  const hasFeedback = feedback.length > 0;
  
  const handleFeedbackSubmitted = () => {
    refreshFeedback();
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Feedback</h3>
        </div>
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Feedback</h3>
        {hasFeedback && (
          <div className="bg-muted px-2 py-1 rounded text-sm flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
          </div>
        )}
      </div>
      
      {hasFeedback && <FeedbackStats feedback={feedback} />}
      
      {canGiveFeedback && (
        <FeedbackForm 
          submission={submission} 
          onFeedbackSubmitted={handleFeedbackSubmitted} 
        />
      )}
      
      {hasFeedback ? (
        <div className="space-y-4">
          {feedback.map((feedbackItem) => (
            <DemoFeedback key={feedbackItem.id} feedback={feedbackItem} />
          ))}
        </div>
      ) : (
        <EmptyFeedback canGiveFeedback={canGiveFeedback} />
      )}
    </div>
  );
};

export default EnhancedFeedbackInterface;
