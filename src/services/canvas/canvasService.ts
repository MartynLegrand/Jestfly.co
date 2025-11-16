import { CanvasProject, CanvasElement, CanvasConnection } from '@/types/canvas';
import { db, handleApiError } from './api/baseApi';
import { getProjectNodes } from './api/nodesApi';
import { getProjectEdges } from './api/edgesApi';

export const getProjects = async (): Promise<CanvasProject[]> => {
  try {
    const { data, error } = await db
      .from('canvas_projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    // Map DB fields to our types
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      userId: item.user_id,
      isTemplate: item.is_template,
      templateId: item.template_id,
      thumbnailUrl: item.thumbnail_url,
      isPublic: item.is_public,
      collaborators: item.collaborators || [],
      tags: item.tags || [],
      metadata: item.metadata,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) as CanvasProject[];
  } catch (error) {
    handleApiError(error, 'Failed to fetch projects:');
  }
};

export const getProjectById = async (projectId: string): Promise<CanvasProject | null> => {
  try {
    const { data, error } = await db
      .from('canvas_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.user_id,
      isTemplate: data.is_template,
      templateId: data.template_id,
      thumbnailUrl: data.thumbnail_url,
      isPublic: data.is_public,
      collaborators: data.collaborators || [],
      tags: data.tags || [],
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as CanvasProject;
  } catch (error) {
    handleApiError(error, `Failed to fetch project with ID ${projectId}:`);
  }
};

export const createProject = async (project: Partial<CanvasProject>): Promise<CanvasProject> => {
  try {
    // Map to database fields
    const dbProject = {
      title: project.title,
      description: project.description,
      user_id: project.userId,
      is_template: project.isTemplate,
      template_id: project.templateId,
      thumbnail_url: project.thumbnailUrl,
      is_public: project.isPublic,
      collaborators: project.collaborators,
      tags: project.tags,
      metadata: project.metadata
    };

    const { data, error } = await db
      .from('canvas_projects')
      .insert(dbProject)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.user_id,
      isTemplate: data.is_template,
      templateId: data.template_id,
      thumbnailUrl: data.thumbnail_url,
      isPublic: data.is_public,
      collaborators: data.collaborators || [],
      tags: data.tags || [],
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as CanvasProject;
  } catch (error) {
    handleApiError(error, 'Failed to create project:');
  }
};

export const updateProject = async (
  projectId: string,
  updates: Partial<CanvasProject>
): Promise<CanvasProject> => {
  try {
    // Map to database fields
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isTemplate !== undefined) dbUpdates.is_template = updates.isTemplate;
    if (updates.templateId !== undefined) dbUpdates.template_id = updates.templateId;
    if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl;
    if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;
    if (updates.collaborators !== undefined) dbUpdates.collaborators = updates.collaborators;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;

    const { data, error } = await db
      .from('canvas_projects')
      .update(dbUpdates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.user_id,
      isTemplate: data.is_template,
      templateId: data.template_id,
      thumbnailUrl: data.thumbnail_url,
      isPublic: data.is_public,
      collaborators: data.collaborators || [],
      tags: data.tags || [],
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as CanvasProject;
  } catch (error) {
    handleApiError(error, `Failed to update project with ID ${projectId}:`);
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const { error } = await db
      .from('canvas_projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  } catch (error) {
    handleApiError(error, `Failed to delete project with ID ${projectId}:`);
  }
};

export const getFullProject = async (projectId: string): Promise<{
  project: CanvasProject;
  nodes: CanvasElement[];
  edges: CanvasConnection[];
}> => {
  try {
    const project = await getProjectById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const nodes = await getProjectNodes(projectId);
    const edges = await getProjectEdges(projectId);

    return {
      project,
      nodes,
      edges,
    };
  } catch (error) {
    handleApiError(error, `Failed to fetch full project with ID ${projectId}:`);
  }
};

export async function createProjectFromTemplate(
  templateId: string,
  title: string,
  description?: string
): Promise<CanvasProject> {
  try {
    // Get the current user's ID
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // The RPC returns a string (the project ID), not a full project object
    const { data, error } = await db.rpc('create_project_from_template', {
      p_user_id: user.id,
      p_template_id: templateId,
      p_title: title,
      p_description: description || null
    });

    if (error) throw error;
    
    if (!data) throw new Error('No data returned from create_project_from_template function');
    
    // Since the RPC just returns the ID, fetch the full project details
    const project = await getProjectById(data as string);
    
    if (!project) {
      throw new Error(`Failed to fetch newly created project with ID ${data}`);
    }
    
    return project;
  } catch (error) {
    handleApiError(error, 'Failed to create project from template:');
    throw error; // Re-throw to ensure the promise rejects
  }
};
