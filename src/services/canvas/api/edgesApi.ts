import { CanvasConnection } from '@/types/canvas';
import { db, handleApiError } from './baseApi';

export const getProjectEdges = async (projectId: string): Promise<CanvasConnection[]> => {
  try {
    const { data, error } = await db
      .from('canvas_connections')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Map database columns to our type
    return (data || []).map(item => ({
      id: item.id,
      sourceId: item.source_id,
      targetId: item.target_id,
      label: item.label,
      style: item.style as any,
      projectId: item.project_id,
      metadata: item.metadata as any,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: item.created_by
    })) as CanvasConnection[];
  } catch (error) {
    handleApiError(error, `Failed to fetch edges for project ${projectId}:`);
  }
};

export const createEdge = async (edge: Partial<CanvasConnection>): Promise<CanvasConnection> => {
  try {
    // Map to database columns - fix the property name createdBy to created_by
    const dbEdge = {
      project_id: edge.projectId || edge.project_id,
      source_id: edge.sourceId || edge.source_id,
      target_id: edge.targetId || edge.target_id,
      label: edge.label,
      style: edge.style,
      metadata: edge.metadata,
      created_by: edge.createdBy
    };

    const { data, error } = await db
      .from('canvas_connections')
      .insert(dbEdge)
      .select()
      .single();

    if (error) throw error;
    
    // Map back to our type
    return {
      id: data.id,
      sourceId: data.source_id,
      targetId: data.target_id,
      label: data.label,
      style: data.style as any,
      projectId: data.project_id,
      metadata: data.metadata as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by
    } as CanvasConnection;
  } catch (error) {
    handleApiError(error, 'Failed to create edge:');
  }
};

export const updateEdge = async (
  edgeId: string,
  updates: Partial<CanvasConnection>
): Promise<CanvasConnection> => {
  try {
    // Map to database columns
    const dbUpdates: any = {};
    if (updates.label !== undefined) dbUpdates.label = updates.label;
    if (updates.style !== undefined) dbUpdates.style = updates.style;
    if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;

    const { data, error } = await db
      .from('canvas_connections')
      .update(dbUpdates)
      .eq('id', edgeId)
      .select()
      .single();

    if (error) throw error;
    
    // Map back to our type
    return {
      id: data.id,
      sourceId: data.source_id,
      targetId: data.target_id,
      label: data.label,
      style: data.style as any,
      projectId: data.project_id,
      metadata: data.metadata as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by
    } as CanvasConnection;
  } catch (error) {
    handleApiError(error, `Failed to update edge with ID ${edgeId}:`);
  }
};

export const deleteEdge = async (edgeId: string): Promise<void> => {
  try {
    const { error } = await db
      .from('canvas_connections')
      .delete()
      .eq('id', edgeId);

    if (error) throw error;
  } catch (error) {
    handleApiError(error, `Failed to delete edge with ID ${edgeId}:`);
  }
};
