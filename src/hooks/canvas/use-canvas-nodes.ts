import { useCallback, RefObject } from 'react';
import { Node } from '@xyflow/react';
import { CanvasElement, Position } from '@/types/canvas';
import { useCanvas } from '@/context/canvas';
import { useToast } from '@/hooks/use-toast';

export const useCanvasNodeOperations = () => {
  const { toast } = useToast();
  const { 
    updateNodePosition, 
    removeNode,
    addNode,
    selectNode
  } = useCanvas();

  const onNodeDragStop = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      try {
        await updateNodePosition(node.id, node.position as Position);
      } catch (error) {
        console.error('Failed to update node position:', error);
      }
    },
    [updateNodePosition]
  );

  const deleteNode = useCallback(
    async (nodeId: string) => {
      try {
        await removeNode(nodeId);
        return true;
      } catch (error) {
        console.error('Failed to delete node:', error);
        toast({
          title: "Error",
          description: "Failed to delete node",
          variant: "destructive",
        });
        return false;
      }
    },
    [removeNode, toast]
  );

  const addNewNode = useCallback(
    async (type: 'task' | 'milestone' | 'note', projectId: string, reactFlowInstance: any, reactFlowWrapperRef: RefObject<HTMLDivElement>) => {
      if (!reactFlowWrapperRef.current) return;
      
      const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
      
      const centerX = (reactFlowBounds.width / 2);
      const centerY = (reactFlowBounds.height / 2);
      
      const { x, y, zoom } = reactFlowInstance.getViewport();
      
      const position = {
        x: x + centerX / zoom,
        y: y + centerY / zoom
      };
      
      try {
        const newNode = await addNode({
          type,
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          position,
          size: {
            width: 150,
            height: type === 'note' ? 100 : 60
          },
          projectId
        });
        
        if (newNode) {
          selectNode(newNode.id);
        }
        
        toast({
          title: "Success",
          description: `Added new ${type}`,
        });
        
        return newNode;
      } catch (error) {
        console.error(`Failed to add ${type}:`, error);
        toast({
          title: "Error",
          description: `Failed to add ${type}`,
          variant: "destructive",
        });
        return null;
      }
    },
    [addNode, selectNode, toast]
  );

  return {
    onNodeDragStop,
    deleteNode,
    addNewNode
  };
};
