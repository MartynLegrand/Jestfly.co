
import { useEffect, RefObject } from 'react';
import { Node, Edge, Connection, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import { useCanvasBase } from './canvas/use-canvas-base';
import { useCanvasNodeOperations } from './canvas/use-canvas-nodes';
import { useCanvasEdgeOperations } from './canvas/use-canvas-edges';
import { useCanvasUIState } from './canvas/use-canvas-ui-state';

export const useCanvasElements = (projectId: string) => {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    contextMenu,
    project,
    loading,
    reactFlowInstance,
    onNodeContextMenu,
    closeContextMenu,
    loadProject,
    updateNodesAndEdges
  } = useCanvasBase(projectId);

  const { onNodeDragStop, deleteNode, addNewNode } = useCanvasNodeOperations();
  const { onConnect } = useCanvasEdgeOperations(setEdges);
  const { saveCanvasState } = useCanvasUIState();

  // Implementation of onNodesChange and onEdgesChange
  const onNodesChange: OnNodesChange = (changes) => {
    setNodes((nds) => {
      // Apply the changes to the nodes
      return applyNodeChanges(changes, nds);
    });
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    setEdges((eds) => {
      // Apply the changes to the edges
      return applyEdgeChanges(changes, eds);
    });
  };

  // Helper function to apply node changes
  const applyNodeChanges = (changes, nodes) => {
    return changes.reduce((acc, change) => {
      if (change.type === 'remove') {
        return acc.filter((node) => node.id !== change.id);
      } else if (change.type === 'add') {
        return [...acc, change.item];
      } else if (change.type === 'select') {
        return acc.map((node) => ({
          ...node,
          selected: node.id === change.id ? change.selected : false,
        }));
      } else if (change.type === 'position') {
        return acc.map((node) =>
          node.id === change.id
            ? { ...node, position: change.position }
            : node
        );
      }
      return acc;
    }, nodes);
  };

  // Helper function to apply edge changes
  const applyEdgeChanges = (changes, edges) => {
    return changes.reduce((acc, change) => {
      if (change.type === 'remove') {
        return acc.filter((edge) => edge.id !== change.id);
      } else if (change.type === 'add') {
        return [...acc, change.item];
      } else if (change.type === 'select') {
        return acc.map((edge) => ({
          ...edge,
          selected: edge.id === change.id ? change.selected : false,
        }));
      }
      return acc;
    }, edges);
  };

  // Handle adding a new node with the wrapper ref
  const handleAddNewNode = (type: 'task' | 'milestone' | 'note', reactFlowWrapperRef: RefObject<HTMLDivElement>) => {
    if (!project) return;
    return addNewNode(type, project.id, reactFlowInstance, reactFlowWrapperRef);
  };

  useEffect(() => {
    updateNodesAndEdges();
  }, [updateNodesAndEdges]);

  return {
    nodes,
    edges,
    contextMenu,
    project,
    loading,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onNodeContextMenu,
    closeContextMenu,
    deleteNode,
    addNewNode: handleAddNewNode,
    saveCanvasState,
    loadProject,
    updateNodesAndEdges
  };
};

// Add imports for react-flow helpers that were in the original file
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
