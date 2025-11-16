
import React, { useRef, useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useToast } from "@/hooks/use-toast";
import { TaskNode } from './nodes/TaskNode';
import { MilestoneNode } from './nodes/MilestoneNode';
import { NoteNode } from './nodes/NoteNode';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasFlow } from './CanvasFlow';
import { useCanvasElements } from '@/hooks/use-canvas-elements';
import { CanvasNavigation } from './navigation/CanvasNavigation';
import { Timeline } from './Timeline';

const nodeTypes = {
  task: TaskNode,
  milestone: MilestoneNode,
  note: NoteNode,
};

interface CanvasEditorProps {
  projectId: string;
  onSelectNode?: (nodeId: string | null) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ 
  projectId,
  onSelectNode 
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState<boolean>(true);
  
  const {
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
    addNewNode,
    saveCanvasState,
    loadProject,
    updateNodesAndEdges
  } = useCanvasElements(projectId);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId).catch(err => {
        console.error('Failed to load project:', err);
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        });
      });
    }
  }, [projectId, loadProject, toast]);

  useEffect(() => {
    updateNodesAndEdges();
  }, [updateNodesAndEdges]);

  useEffect(() => {
    if (onSelectNode) {
      const selectedNode = nodes.find(node => node.selected);
      const nodeId = selectedNode ? selectedNode.id : null;
      setSelectedNodeId(nodeId);
      onSelectNode(nodeId);
    }
  }, [nodes, onSelectNode]);

  const handleNodeSelect = (nodeId: string) => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      selected: node.id === nodeId
    }));
    
    onNodesChange([
      {
        type: 'select',
        id: nodeId,
        selected: true
      }
    ]);
    
    setSelectedNodeId(nodeId);
    if (onSelectNode) {
      onSelectNode(nodeId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-medium">Project not found</h3>
        <p className="text-gray-500 mt-2">The project you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const handleAddNode = (type: 'task' | 'milestone' | 'note') => {
    addNewNode(type, reactFlowWrapper);
  };

  return (
    <div className="flex flex-col h-full">
      <CanvasToolbar 
        project={project}
        onAddNode={handleAddNode}
        onSave={saveCanvasState}
        onToggleTimeline={() => setShowTimeline(!showTimeline)}
        showTimeline={showTimeline}
      />
      
      <div className="flex h-[calc(100vh-7rem)]">
        <div className={`flex-grow relative ${showTimeline ? 'w-3/4' : 'w-full'}`} ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <CanvasFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeContextMenu={onNodeContextMenu}
              contextMenu={contextMenu}
              onCloseContextMenu={closeContextMenu}
              onDeleteNode={deleteNode}
              nodeTypes={nodeTypes}
            />
            <CanvasNavigation selectedNodeId={selectedNodeId} />
          </ReactFlowProvider>
        </div>
        
        {showTimeline && (
          <div className="w-1/4 border-l overflow-y-auto p-4">
            <Timeline selectedNodeId={selectedNodeId} />
          </div>
        )}
      </div>
    </div>
  );
};
