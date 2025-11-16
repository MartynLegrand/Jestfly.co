
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DemoSubmission } from '@/types';
import { MessageSquare } from 'lucide-react';
import DemoFeedback from './DemoFeedback';
import FeedbackForm from './FeedbackForm';
import EmptyFeedback from './EmptyFeedback';

interface FeedbackInterfaceProps {
  submission: DemoSubmission;
  onFeedbackSubmitted?: () => void;
  className?: string;
}

const FeedbackInterface: React.FC<FeedbackInterfaceProps> = ({
  submission,
  onFeedbackSubmitted,
  className = ''
}) => {
  const { user } = useAuth();
  
  // Verificar se o usuário pode dar feedback (apenas admin ou colaborador)
  const canGiveFeedback = user?.profile?.profile_type === 'admin' || user?.profile?.profile_type === 'collaborator';
  
  // Verificar se já existem feedbacks
  const existingFeedback = submission.feedback || [];
  const hasFeedback = existingFeedback.length > 0;
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Feedback</h3>
        {hasFeedback && (
          <div className="bg-muted px-2 py-1 rounded text-sm flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {existingFeedback.length} {existingFeedback.length === 1 ? 'avaliação' : 'avaliações'}
          </div>
        )}
      </div>
      
      {canGiveFeedback && (
        <FeedbackForm 
          submission={submission} 
          onFeedbackSubmitted={onFeedbackSubmitted} 
        />
      )}
      
      {hasFeedback ? (
        <div className="space-y-4">
          {existingFeedback.map((feedback) => (
            <DemoFeedback key={feedback.id} feedback={feedback} />
          ))}
        </div>
      ) : (
        <EmptyFeedback canGiveFeedback={canGiveFeedback} />
      )}
    </div>
  );
};

export default FeedbackInterface;
