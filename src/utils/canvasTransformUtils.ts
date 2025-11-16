
import { Node, Edge } from '@xyflow/react';
import { CanvasElement, CanvasConnection } from '@/types/canvas';

export const transformToReactFlowNodes = (canvasNodes: CanvasElement[]): Node[] => {
  return canvasNodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: { ...node },
    draggable: true,
  }));
};

export const transformToReactFlowEdges = (canvasEdges: CanvasConnection[]): Edge[] => {
  return canvasEdges.map(edge => ({
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    label: edge.label,
    data: { ...edge },
  }));
};
