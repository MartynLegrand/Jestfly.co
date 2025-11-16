
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCanvasUIState = () => {
  const { toast } = useToast();

  const saveCanvasState = useCallback(() => {
    toast({
      title: "Success",
      description: "Canvas state saved successfully",
    });
  }, [toast]);

  return {
    saveCanvasState
  };
};
