
import { CanvasProject } from "@/types/canvas";
import { db, handleApiError } from "./baseApi";

export async function getProjects(): Promise<CanvasProject[]> {
  const { data, error } = await db
    .from('canvas_projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    handleApiError(error, 'Error fetching projects:');
  }

  return data.map(transformProjectFromDB);
}

export async function getProject(id: string): Promise<CanvasProject> {
  const { data, error } = await db
    .from('canvas_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    handleApiError(error, 'Error fetching project:');
  }

  return transformProjectFromDB(data);
}

export async function createProject(project: Partial<CanvasProject>): Promise<CanvasProject> {
  const { data, error } = await db
    .from('canvas_projects')
    .insert([transformProjectToDB(project)])
    .select()
    .single();

  if (error) {
    handleApiError(error, 'Error creating project:');
  }

  return transformProjectFromDB(data);
}

export async function updateProject(id: string, project: Partial<CanvasProject>): Promise<CanvasProject> {
  const { data, error } = await db
    .from('canvas_projects')
    .update(transformProjectToDB(project))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleApiError(error, 'Error updating project:');
  }

  return transformProjectFromDB(data);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await db
    .from('canvas_projects')
    .delete()
    .eq('id', id);

  if (error) {
    handleApiError(error, 'Error deleting project:');
  }
}

export function transformProjectFromDB(project: any): CanvasProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    userId: project.user_id,
    isTemplate: project.is_template || false,
    templateId: project.template_id,
    thumbnailUrl: project.thumbnail_url,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    isPublic: project.is_public || false,
    collaborators: project.collaborators || [],
    tags: project.tags || [],
    metadata: project.metadata || {}
  };
}

export function transformProjectToDB(project: Partial<CanvasProject>): any {
  const dbProject: any = {};

  if ('title' in project) dbProject.title = project.title;
  if ('description' in project) dbProject.description = project.description;
  if ('userId' in project) dbProject.user_id = project.userId;
  if ('isTemplate' in project) dbProject.is_template = project.isTemplate;
  if ('templateId' in project) dbProject.template_id = project.templateId;
  if ('thumbnailUrl' in project) dbProject.thumbnail_url = project.thumbnailUrl;
  if ('isPublic' in project) dbProject.is_public = project.isPublic;
  if ('collaborators' in project) dbProject.collaborators = project.collaborators;
  if ('tags' in project) dbProject.tags = project.tags;
  if ('metadata' in project) dbProject.metadata = project.metadata;

  return dbProject;
}
