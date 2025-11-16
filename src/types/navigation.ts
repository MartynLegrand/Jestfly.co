
// Navigation-related types
export interface SidebarItem {
  title: string;
  path: string;
  icon: any; // Component
  children?: SidebarItem[];
}

// Canvas navigation types
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasNavigationState {
  currentView: CanvasViewport;
  savedViews: Record<string, CanvasViewport>;
  history: CanvasViewport[];
  historyIndex: number;
}

export interface CanvasNavigationAction {
  type: 'ZOOM_IN' | 'ZOOM_OUT' | 'PAN' | 'FIT_VIEW' | 'CENTER_NODE' | 'SAVE_VIEW' | 'LOAD_VIEW' | 'UNDO' | 'REDO';
  payload?: any;
}
