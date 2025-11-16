
import { useCallback } from 'react';
import { CanvasElement } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';
import {
  createNode,
  updateNode,
  deleteNode,
  batchUpdateNodePositions
} from '@/services/canvas/api/nodesApi';

export const useCanvasNodes = (projectId: string, nodes: CanvasElement[], setNodes: (nodes: CanvasElement[]) => void) => {
  const { toast } = useToast();

  const addNode = useCallback(async (node: Partial<CanvasElement>) => {
    if (!projectId) return null;
    
    try {
      const newNode = await createNode({
        ...node,
        projectId: projectId,
      });
      
      setNodes([...nodes, newNode]);
      return newNode;
    } catch (err) {
      console.error("Error adding node:", err);
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive",
      });
      return null;
    }
  }, [projectId, nodes, setNodes, toast]);

  const updateNodeData = useCallback(async (nodeId: string, updates: Partial<CanvasElement>) => {
    try {
      const updatedNode = await updateNode(nodeId, updates);
      
      setNodes(nodes.map(node => 
        node.id === nodeId ? updatedNode : node
      ));
      
      return updatedNode;
    } catch (err) {
      console.error("Error updating node:", err);
      toast({
        title: "Error",
        description: "Failed to update node",
        variant: "destructive",
      });
      return null;
    }
  }, [nodes, setNodes, toast]);

  const updateNodePosition = useCallback(async (nodeId: string, position: { x: number; y: number }) => {
    try {
      // Update state immediately for a responsive UI
      setNodes(nodes.map(node => 
        node.id === nodeId ? {...node, position} : node
      ));
      
      // Then update in database
      await updateNode(nodeId, { position });
      return true;
    } catch (err) {
      console.error("Error updating node position:", err);
      // No toast here to avoid spamming during drag operations
      return false;
    }
  }, [nodes, setNodes]);

  const updateMultipleNodePositions = useCallback(async (
    updatedNodes: { id: string; position: { x: number; y: number } }[]
  ) => {
    try {
      // Update state immediately
      setNodes(nodes.map(node => {
        const updatedNode = updatedNodes.find(n => n.id === node.id);
        return updatedNode ? {...node, position: updatedNode.position} : node;
      }));
      
      // Then update in database
      await batchUpdateNodePositions(updatedNodes);
      return true;
    } catch (err) {
      console.error("Error updating multiple node positions:", err);
      toast({
        title: "Error",
        description: "Failed to save node positions",
        variant: "destructive",
      });
      return false;
    }
  }, [nodes, setNodes, toast]);

  const removeNode = useCallback(async (nodeId: string) => {
    try {
      await deleteNode(nodeId);
      setNodes(nodes.filter(node => node.id !== nodeId));
      return true;
    } catch (err) {
      console.error("Error removing node:", err);
      toast({
        title: "Error",
        description: "Failed to remove node",
        variant: "destructive",
      });
      return false;
    }
  }, [nodes, setNodes, toast]);

  return {
    addNode,
    updateNodeData,
    updateNodePosition,
    updateMultipleNodePositions,
    removeNode,
  };
};
