import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { CanvasFlow } from './CanvasFlow';

interface CanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  selectedNodeId,
}) => {
  const [contextMenu, setContextMenu] = React.useState<{ nodeId: string; position: { x: number; y: number } } | null>(null);

  const handleNodeContextMenu = (event: React.MouseEvent, node: any) => {
    event.preventDefault();
    setContextMenu({
      nodeId: node.id,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
    setContextMenu(null);
  };

  const handleNodeDragStop = () => {
    // Node drag stop handler
  };

  return (
    <ReactFlowProvider>
      <CanvasFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        onNodeContextMenu={handleNodeContextMenu}
        contextMenu={contextMenu}
        onCloseContextMenu={handleCloseContextMenu}
        onDeleteNode={handleDeleteNode}
        nodeTypes={{}}
      />
    </ReactFlowProvider>
  );
};
