
import { useState, useCallback } from 'react';
import { CanvasProject, Position, CanvasElement, CanvasConnection } from '@/types/canvas';
import { CanvasContextType } from './types';
import { 
  getProjectById, 
  getFullProject, 
  updateProject, 
  createProject,
  createProjectFromTemplate as createFromTemplate
} from '@/services/canvas/canvasService';
import { useCanvasNodes } from '@/hooks/use-canvas-nodes';
import { useCanvasEdges } from '@/hooks/use-canvas-edges';
import { useCanvasView } from '@/hooks/use-canvas-view';

export const useCanvasProvider = (): CanvasContextType => {
  const [project, setProject] = useState<CanvasProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [canvasNodes, setCanvasNodes] = useState<CanvasElement[]>([]);
  const [canvasEdges, setCanvasEdges] = useState<CanvasConnection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  
  const {
    zoomLevel,
    viewPosition,
    setZoomLevel,
    setViewPosition,
    resetView
  } = useCanvasView();

  const {
    addNode,
    updateNodeData: updateNode,
    updateNodePosition,
    removeNode: deleteNode
  } = useCanvasNodes(project?.id || "", canvasNodes, setCanvasNodes);

  const {
    addEdge,
    updateEdgeData: updateEdge,
    removeEdge: deleteEdge,
    removeEdgesByNode
  } = useCanvasEdges(project?.id || "", canvasEdges, setCanvasEdges);

  const loadProject = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      const data = await getFullProject(projectId);
      if (data) {
        setProject(data.project);
        setCanvasNodes(data.nodes);
        setCanvasEdges(data.edges);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectDetails = useCallback(async (projectData: Partial<CanvasProject>) => {
    if (!project) return null;
    try {
      const updatedProject = await updateProject(project.id, projectData);
      setProject(updatedProject);
      return updatedProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      return null;
    }
  }, [project]);

  const createProjectFromTemplate = useCallback(async (templateId: string, title: string, description?: string) => {
    try {
      const newProject = await createFromTemplate(templateId, title, description);
      return newProject.id;
    } catch (error) {
      console.error('Failed to create project from template:', error);
      throw error;
    }
  }, []);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
    // Deselect edge when node is selected
    if (id) setSelectedEdgeId(null);
  }, []);

  const selectEdge = useCallback((id: string | null) => {
    setSelectedEdgeId(id);
    // Deselect node when edge is selected
    if (id) setSelectedNodeId(null);
  }, []);

  const handleRemoveNode = useCallback(async (id: string) => {
    // Remove associated edges first
    await removeEdgesByNode(id);
    // Then remove the node
    await deleteNode(id);
  }, [removeEdgesByNode, deleteNode]);

  // Type assertion functions to convert Promise<boolean> to Promise<void>
  const updateNodePositionWrapper = useCallback(async (id: string, position: Position): Promise<void> => {
    await updateNodePosition(id, position);
  }, [updateNodePosition]);

  const updateNodeDataWrapper = useCallback(async (id: string, data: Partial<CanvasElement>): Promise<void> => {
    await updateNode(id, data);
  }, [updateNode]);

  const removeNodeWrapper = useCallback(async (id: string): Promise<void> => {
    await handleRemoveNode(id);
  }, [handleRemoveNode]);

  const updateEdgeDataWrapper = useCallback(async (id: string, data: Partial<CanvasConnection>): Promise<void> => {
    await updateEdge(id, data);
  }, [updateEdge]);

  const removeEdgeWrapper = useCallback(async (id: string): Promise<void> => {
    await deleteEdge(id);
  }, [deleteEdge]);

  return {
    project,
    nodes: canvasNodes,
    edges: canvasEdges,
    loading,
    selectedNodeId,
    selectedEdgeId,
    zoomLevel,
    viewPosition,
    
    loadProject,
    updateProjectDetails,
    createProjectFromTemplate,
    
    addNode,
    updateNodePosition: updateNodePositionWrapper,
    updateNodeData: updateNodeDataWrapper,
    removeNode: removeNodeWrapper,
    selectNode,
    
    addEdge,
    updateEdgeData: updateEdgeDataWrapper,
    removeEdge: removeEdgeWrapper,
    selectEdge,
    
    setZoomLevel,
    setViewPosition,
    resetView
  };
};
