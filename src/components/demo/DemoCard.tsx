
import React from 'react';
import { DemoSubmission } from '@/types/demo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X, Eye, MessageSquare } from 'lucide-react';

interface DemoCardProps {
  demo: DemoSubmission;
  onViewDemo: () => void;
  onViewFeedback: () => void;
}

const DemoCard: React.FC<DemoCardProps> = ({ demo, onViewDemo, onViewFeedback }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center bg-yellow-100/50"><Clock className="h-3 w-3 mr-1" /> Pendente</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="flex items-center bg-blue-100/50"><Clock className="h-3 w-3 mr-1" /> Em análise</Badge>;
      case 'approved':
        return <Badge variant="outline" className="flex items-center bg-green-100/50"><Check className="h-3 w-3 mr-1" /> Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="flex items-center bg-red-100/50"><X className="h-3 w-3 mr-1" /> Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const hasFeedback = (demo: DemoSubmission) => {
    return demo.feedback && demo.feedback.some(f => f.is_public);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{demo.title}</CardTitle>
          {getStatusBadge(demo.status)}
        </div>
        <p className="text-sm text-muted-foreground">
          {demo.artist_name}
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Enviado em: {new Date(demo.created_at).toLocaleDateString()}</p>
            {demo.genre && <p>Gênero: {demo.genre}</p>}
            {demo.reviewed_at && (
              <p>Avaliado em: {new Date(demo.reviewed_at).toLocaleDateString()}</p>
            )}
          </div>
          <div className="flex flex-col md:items-end justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto flex items-center"
              onClick={onViewDemo}
            >
              <Eye className="h-4 w-4 mr-1" /> Ouvir Demo
            </Button>
            
            {hasFeedback(demo) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full md:w-auto flex items-center"
                onClick={onViewFeedback}
              >
                <MessageSquare className="h-4 w-4 mr-1" /> Ver Feedback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCard;
