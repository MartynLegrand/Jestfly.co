
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyFeedbackProps {
  canGiveFeedback: boolean;
}

const EmptyFeedback: React.FC<EmptyFeedbackProps> = ({ canGiveFeedback }) => {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg">
      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h4 className="text-lg font-medium">Nenhum feedback ainda</h4>
      <p className="text-muted-foreground">
        {canGiveFeedback 
          ? 'Seja o primeiro a avaliar esta demo.'
          : 'Esta demo ainda não recebeu feedback da nossa equipe.'}
      </p>
    </div>
  );
};

export default EmptyFeedback;
