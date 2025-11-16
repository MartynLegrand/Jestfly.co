
import React from 'react';
import { useUserDemos } from '@/components/demo/hooks/useUserDemos';
import DemoCard from '@/components/demo/DemoCard';
import DemoDetailDialog from '@/components/demo/DemoDetailDialog';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoSubmission } from '@/types/demo';

export const UserDemoList: React.FC = () => {
  const { demos, loading, selectedDemo, setSelectedDemo, viewingFeedback, setViewingFeedback, handleSwitchToSubmit } = useUserDemos();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse border rounded-lg">
            <div className="p-6 pb-2">
              <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
            <div className="p-6 pt-2">
              <div className="h-16 bg-muted rounded"></div>
            </div>
            <div className="p-6 pt-0">
              <div className="h-8 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Music className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">Nenhuma demo enviada</h3>
        <p className="text-muted-foreground mb-6">
          Você ainda não enviou nenhuma demo. Utilize o formulário para enviar sua primeira música.
        </p>
        <Button onClick={handleSwitchToSubmit}>
          Enviar Demo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Suas Demos</h3>
      
      {demos.map((demo) => (
        <DemoCard
          key={demo.id}
          demo={demo}
          onViewDemo={() => setSelectedDemo(demo)}
          onViewFeedback={() => {
            setSelectedDemo(demo);
            setViewingFeedback(true);
          }}
        />
      ))}
      
      {selectedDemo && (
        <DemoDetailDialog
          demo={selectedDemo}
          viewingFeedback={viewingFeedback}
          onClose={() => {
            setSelectedDemo(null);
            setViewingFeedback(false);
          }}
          onToggleView={() => setViewingFeedback(!viewingFeedback)}
        />
      )}
    </div>
  );
};
