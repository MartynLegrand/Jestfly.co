
import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ConnectionLine } from './ConnectionLine';
import { NodeContextMenu } from './NodeContextMenu';

interface CanvasFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: Connection) => void;
  onNodeDragStop: NodeMouseHandler;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  contextMenu: { nodeId: string; position: { x: number; y: number } } | null;
  onCloseContextMenu: () => void;
  onDeleteNode: (nodeId: string) => void;
  nodeTypes: Record<string, React.ComponentType<any>>;
}

export const CanvasFlow: React.FC<CanvasFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDragStop,
  onNodeContextMenu,
  contextMenu,
  onCloseContextMenu,
  onDeleteNode,
  nodeTypes,
}) => {
  const reactFlowInstance = useReactFlow();

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onCloseContextMenu}
        nodeTypes={nodeTypes}
        connectionLineComponent={ConnectionLine}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      
      {contextMenu && (
        <NodeContextMenu
          position={contextMenu.position}
          onClose={onCloseContextMenu}
          onDelete={() => onDeleteNode(contextMenu.nodeId)}
        />
      )}
    </>
  );
};
