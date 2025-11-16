
import { CanvasElement, NodeType } from '@/types/canvas';
import { db, handleApiError } from './baseApi';

export const getProjectNodes = async (projectId: string): Promise<CanvasElement[]> => {
  try {
    const { data, error } = await db
      .from('canvas_elements')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      type: item.element_type as NodeType,
      title: item.title || '',
      content: item.content,
      position: item.position as any,
      size: item.size as any,
      style: item.style as any,
      metadata: item.metadata as any,
      projectId: item.project_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: item.created_by
    })) as CanvasElement[];
  } catch (error) {
    handleApiError(error, `Failed to fetch nodes for project ${projectId}:`);
  }
};

export const createNode = async (node: Partial<CanvasElement>): Promise<CanvasElement> => {
  try {
    const dbNode = {
      project_id: node.projectId || node.project_id,
      element_type: (node.type || node.element_type) as NodeType,
      title: node.title,
      content: node.content,
      position: JSON.stringify(node.position), // Convert to JSON string for database
      size: JSON.stringify(node.size), // Convert to JSON string for database
      style: JSON.stringify(node.style), // Convert to JSON string for database
      metadata: JSON.stringify(node.metadata), // Convert to JSON string for database
      created_by: node.createdBy // Fix: Use createdBy instead of created_by
    };

    const { data, error } = await db
      .from('canvas_elements')
      .insert(dbNode)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      type: data.element_type as NodeType,
      title: data.title || '',
      content: data.content,
      position: data.position as any,
      size: data.size as any,
      style: data.style as any,
      metadata: data.metadata as any,
      projectId: data.project_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by
    } as CanvasElement;
  } catch (error) {
    handleApiError(error, 'Failed to create node:');
  }
};

export const updateNode = async (
  nodeId: string,
  updates: Partial<CanvasElement>
): Promise<CanvasElement> => {
  try {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.position !== undefined) dbUpdates.position = updates.position;
    if (updates.size !== undefined) dbUpdates.size = updates.size;
    if (updates.style !== undefined) dbUpdates.style = updates.style;
    if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;
    if (updates.type !== undefined) dbUpdates.element_type = updates.type;

    const { data, error } = await db
      .from('canvas_elements')
      .update(dbUpdates)
      .eq('id', nodeId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      type: data.element_type as NodeType,
      title: data.title || '',
      content: data.content,
      position: data.position as any,
      size: data.size as any,
      style: data.style as any,
      metadata: data.metadata as any,
      projectId: data.project_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by
    } as CanvasElement;
  } catch (error) {
    handleApiError(error, `Failed to update node with ID ${nodeId}:`);
  }
};

export const deleteNode = async (nodeId: string): Promise<void> => {
  try {
    const { error } = await db
      .from('canvas_elements')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
  } catch (error) {
    handleApiError(error, `Failed to delete node with ID ${nodeId}:`);
  }
};

export const batchUpdateNodePositions = async (
  nodes: { id: string; position: { x: number; y: number } }[]
): Promise<void> => {
  try {
    const updates = nodes.map((node) => ({
      id: node.id,
      position: node.position,
    }));

    for (const update of updates) {
      const { error } = await db
        .from('canvas_elements')
        .update({ position: update.position })
        .eq('id', update.id);

      if (error) throw error;
    }
  } catch (error) {
    handleApiError(error, 'Failed to batch update node positions:');
  }
};
