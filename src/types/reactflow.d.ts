
import '@xyflow/react';
import { Node, Edge, XYPosition } from '@xyflow/react';

declare module '@xyflow/react' {
  interface ReactFlowInstance<NodeData = any, EdgeData = any> {
    project: (position: XYPosition) => XYPosition;
    getViewport: () => { x: number; y: number; zoom: number };
  }
}
