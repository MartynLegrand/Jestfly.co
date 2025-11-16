
import { useCallback } from 'react';
import { CanvasConnection } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';
import {
  createEdge,
  updateEdge,
  deleteEdge
} from '@/services/canvas/api/edgesApi';

export const useCanvasEdges = (
  projectId: string, 
  edges: CanvasConnection[], 
  setEdges: (edges: CanvasConnection[]) => void
) => {
  const { toast } = useToast();

  const addEdge = useCallback(async (edge: Partial<CanvasConnection>) => {
    if (!projectId) return null;
    
    try {
      const newEdge = await createEdge({
        ...edge,
        projectId: projectId,
      });
      
      setEdges([...edges, newEdge]);
      return newEdge;
    } catch (err) {
      console.error("Error adding edge:", err);
      toast({
        title: "Error",
        description: "Failed to add connection",
        variant: "destructive",
      });
      return null;
    }
  }, [projectId, edges, setEdges, toast]);

  const updateEdgeData = useCallback(async (edgeId: string, updates: Partial<CanvasConnection>) => {
    try {
      const updatedEdge = await updateEdge(edgeId, updates);
      
      setEdges(edges.map(edge => 
        edge.id === edgeId ? updatedEdge : edge
      ));
      
      return updatedEdge;
    } catch (err) {
      console.error("Error updating edge:", err);
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive",
      });
      return null;
    }
  }, [edges, setEdges, toast]);

  const removeEdge = useCallback(async (edgeId: string) => {
    try {
      await deleteEdge(edgeId);
      setEdges(edges.filter(edge => edge.id !== edgeId));
      return true;
    } catch (err) {
      console.error("Error removing edge:", err);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      });
      return false;
    }
  }, [edges, setEdges, toast]);

  const removeEdgesByNode = useCallback(async (nodeId: string) => {
    try {
      const edgesToRemove = edges.filter(edge => 
        edge.sourceId === nodeId || edge.targetId === nodeId
      );
      
      // Remove each edge
      for (const edge of edgesToRemove) {
        await deleteEdge(edge.id);
      }
      
      // Update state
      setEdges(edges.filter(edge => 
        edge.sourceId !== nodeId && edge.targetId !== nodeId
      ));
      
      return true;
    } catch (err) {
      console.error("Error removing edges by node:", err);
      toast({
        title: "Error",
        description: "Failed to remove connections",
        variant: "destructive",
      });
      return false;
    }
  }, [edges, setEdges, toast]);

  return {
    addEdge,
    updateEdgeData,
    removeEdge,
    removeEdgesByNode,
  };
};
