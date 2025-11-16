
import { useState, useCallback, RefObject } from 'react';
import { useReactFlow, Node, Edge, Connection, OnConnect } from '@xyflow/react';
import { CanvasProject, CanvasElement, Position } from '@/types/canvas';
import { useCanvas } from '@/context/canvas';
import { useToast } from '@/hooks/use-toast';
import { transformToReactFlowNodes, transformToReactFlowEdges } from '@/utils/canvasTransformUtils';

export const useCanvasBase = (projectId: string) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    nodeId: string;
    position: { x: number; y: number };
  } | null>(null);
  
  const { toast } = useToast();
  const { 
    project, 
    nodes: canvasNodes, 
    edges: canvasEdges, 
    loading, 
    loadProject
  } = useCanvas();
  
  const reactFlowInstance = useReactFlow();

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      
      setContextMenu({
        nodeId: node.id,
        position: {
          x: event.clientX,
          y: event.clientY,
        },
      });
    },
    []
  );

  const updateNodesAndEdges = useCallback(() => {
    if (canvasNodes.length > 0 || canvasEdges.length > 0) {
      setNodes(transformToReactFlowNodes(canvasNodes));
      setEdges(transformToReactFlowEdges(canvasEdges));
    }
  }, [canvasNodes, canvasEdges]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    contextMenu,
    setContextMenu,
    project,
    loading,
    reactFlowInstance,
    onNodeContextMenu,
    closeContextMenu,
    loadProject,
    updateNodesAndEdges
  };
};
