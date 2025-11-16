export type NodeType = 'task' | 'milestone' | 'note' | 'goal' | 'group' | 'connection' | 'image' | 'document';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;
  content?: string;
  position: Position;
  size: Size;
  style?: Record<string, any>;
  metadata?: Record<string, any>;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CanvasEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  style?: Record<string, any>;
  projectId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CanvasProject {
  id: string;
  title: string;
  description?: string;
  userId: string;
  isTemplate: boolean;
  templateId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  collaborators: string[];
  tags: string[];
  metadata?: Record<string, any>;
}

export interface CanvasTask {
  id: string;
  projectId: string;
  elementId?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  metadata?: Record<string, any>;
}

export interface CanvasTemplateElement {
  id: string;
  type: NodeType;
  position: Position;
  size: Size;
  title: string;
  content?: string;
  style?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CanvasTemplateConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  style?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CanvasTemplate {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  category?: string;
  elements: CanvasTemplateElement[];
  connections: CanvasTemplateConnection[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isOfficial: boolean;
  isPublic: boolean;
  metadata?: Record<string, any>;
}

export interface CanvasElement extends CanvasNode {
  element_type?: string; // For database compatibility
  project_id?: string; // For database compatibility
  created_at?: string; // For database compatibility
  updated_at?: string; // For database compatibility
}

export interface CanvasConnection extends CanvasEdge {
  source_id?: string; // For database compatibility
  target_id?: string; // For database compatibility
  project_id?: string; // For database compatibility
  created_at?: string; // For database compatibility
  updated_at?: string; // For database compatibility
}

export interface CanvasCalendarEvent {
  id: string;
  projectId: string;
  taskId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  metadata?: Record<string, any>;
}

export interface CanvasHistory {
  id: string;
  projectId: string;
  snapshot: Record<string, any>;
  createdAt: string;
  createdBy?: string;
  comment?: string;
}

export interface CanvasSharing {
  id: string;
  projectId: string;
  userId?: string;
  email?: string;
  permission: 'view' | 'edit' | 'admin';
  token?: string;
  createdAt: string;
  expiresAt?: string;
  createdBy?: string;
  isActive: boolean;
}
