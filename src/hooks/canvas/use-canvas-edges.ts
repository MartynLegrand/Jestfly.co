
import { useCallback } from 'react';
import { Connection, Edge, addEdge as reactFlowAddEdge } from '@xyflow/react';
import { useCanvas } from '@/context/canvas';
import { useToast } from '@/hooks/use-toast';

export const useCanvasEdgeOperations = (setEdges: React.Dispatch<React.SetStateAction<Edge[]>>) => {
  const { toast } = useToast();
  const { addEdge: addCanvasEdge } = useCanvas();

  const onConnect = useCallback(
    async (params: Connection) => {
      try {
        if (!params.source || !params.target) {
          console.error('Connection is missing source or target');
          return;
        }

        const newEdge = await addCanvasEdge({
          sourceId: params.source,
          targetId: params.target,
        });
        
        if (!newEdge) {
          console.error('Failed to create edge');
          return;
        }

        setEdges((eds) =>
          reactFlowAddEdge(
            {
              id: newEdge.id,
              source: newEdge.sourceId,
              target: newEdge.targetId,
              data: { ...newEdge },
            },
            eds
          )
        );
      } catch (error) {
        console.error('Failed to create connection:', error);
        toast({
          title: "Error",
          description: "Failed to create connection between nodes",
          variant: "destructive",
        });
      }
    },
    [addCanvasEdge, setEdges, toast]
  );

  return {
    onConnect
  };
};
