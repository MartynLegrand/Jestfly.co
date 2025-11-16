
import { CanvasProject, Position, CanvasElement, CanvasConnection } from '@/types/canvas';

/**
 * Type definitions for Canvas Context
 */
export interface CanvasContextType {
  project: CanvasProject | null;
  nodes: CanvasElement[];
  edges: CanvasConnection[];
  loading: boolean;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  zoomLevel: number;
  viewPosition: Position;
  
  // Project methods
  loadProject: (projectId: string) => Promise<void>;
  updateProjectDetails: (projectData: Partial<CanvasProject>) => Promise<CanvasProject | null>;
  createProjectFromTemplate: (templateId: string, title: string, description?: string) => Promise<string>;
  
  // Node methods
  addNode: (node: Partial<CanvasElement>) => Promise<CanvasElement | null>;
  updateNodePosition: (id: string, position: Position) => Promise<void>;
  updateNodeData: (id: string, data: Partial<CanvasElement>) => Promise<void>;
  removeNode: (id: string) => Promise<void>;
  selectNode: (id: string | null) => void;
  
  // Edge methods
  addEdge: (edge: Partial<CanvasConnection>) => Promise<CanvasConnection | null>;
  updateEdgeData: (id: string, data: Partial<CanvasConnection>) => Promise<void>;
  removeEdge: (id: string) => Promise<void>;
  selectEdge: (id: string | null) => void;
  
  // View methods
  setZoomLevel: (level: number) => void;
  setViewPosition: (position: Position) => void;
  resetView: () => void;
}
