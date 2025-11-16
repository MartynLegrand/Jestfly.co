
import React from 'react';
import { DemoSubmission } from '@/types/demo';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/demo/AudioPlayer';
import FeedbackInterface from '@/components/demo/feedback/FeedbackInterface';

interface DemoDetailDialogProps {
  demo: DemoSubmission;
  viewingFeedback: boolean;
  onClose: () => void;
  onToggleView: () => void;
}

const DemoDetailDialog: React.FC<DemoDetailDialogProps> = ({ 
  demo, 
  viewingFeedback, 
  onClose, 
  onToggleView 
}) => {
  const hasFeedback = demo.feedback && demo.feedback.some(f => f.is_public);

  return (
    <Dialog open={!!demo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{viewingFeedback ? 'Feedback' : demo.title}</DialogTitle>
          <DialogDescription>
            {viewingFeedback ? 
              'Feedback da nossa equipe para sua demo' : 
              `Artista: ${demo.artist_name}`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh] pr-4">
          {viewingFeedback ? (
            <FeedbackInterface submission={demo} />
          ) : (
            <div className="space-y-4">
              <AudioPlayer 
                src={demo.audio_url} 
                title={demo.title}
                artist={demo.artist_name}
              />
              
              {demo.biography && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Biografia:</h4>
                  <p className="text-sm text-muted-foreground">{demo.biography}</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-end gap-2">
          {!viewingFeedback && hasFeedback && (
            <Button variant="outline" onClick={onToggleView}>
              Ver Feedback
            </Button>
          )}
          {viewingFeedback && (
            <Button variant="outline" onClick={onToggleView}>
              Ver Demo
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDetailDialog;
