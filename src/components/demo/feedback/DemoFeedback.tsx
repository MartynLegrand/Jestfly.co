
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DemoFeedback as DemoFeedbackType } from '@/types';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/ui/UserAvatar';
import { updateDemoFeedback } from '@/lib/demo/feedbackService';

interface DemoFeedbackProps {
  feedback: DemoFeedbackType;
}

const DemoFeedback: React.FC<DemoFeedbackProps> = ({ feedback }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(feedback.is_public);
  
  const togglePublic = async () => {
    try {
      await updateDemoFeedback(feedback.id, { is_public: !isPublic });
      setIsPublic(!isPublic);
      toast({
        title: `Feedback ${!isPublic ? 'publicado' : 'despublicado'} com sucesso`,
        description: `O feedback agora ${!isPublic ? 'é' : 'não é'} visível para o artista.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao alterar visibilidade',
        description: 'Não foi possível alterar a visibilidade do feedback.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <UserAvatar 
              user={{ 
                username: feedback.reviewer?.username || 'Avaliador', 
                display_name: feedback.reviewer?.display_name || 'Avaliador',
                avatar_url: feedback.reviewer?.avatar_url 
              }} 
              size="sm" 
            />
            <div>
              <CardTitle className="text-base">{feedback.reviewer?.display_name || 'Avaliador'}</CardTitle>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          {user?.profile?.profile_type === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePublic}
              title={isPublic ? 'Tornar privado' : 'Tornar público'}
            >
              {isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{feedback.comment}</p>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
          {isPublic && <span className="flex items-center"><Eye className="h-3 w-3 mr-1" /> Público</span>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DemoFeedback;
