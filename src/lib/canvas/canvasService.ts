
import { supabase } from "@/lib/supabase";
import {
  CanvasProject,
  CanvasElement,
  CanvasConnection,
  CanvasTask,
  CanvasCalendarEvent,
  CanvasTemplate,
  CanvasHistory,
  CanvasSharing
} from "@/types/canvas";
import { UserProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Projetos
export const fetchUserProjects = async (userId: string): Promise<CanvasProject[]> => {
  const { data, error } = await supabase
    .from('canvas_projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }

  return data || [];
};

export const fetchProjectById = async (projectId: string): Promise<CanvasProject> => {
  const { data, error } = await supabase
    .from('canvas_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return data;
};

export const createProject = async (
  project: Partial<CanvasProject>, 
  userId: string
): Promise<CanvasProject> => {
  const { data, error } = await supabase
    .from('canvas_projects')
    .insert({
      ...project,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
};

export const updateProject = async (
  projectId: string, 
  updates: Partial<CanvasProject>
): Promise<CanvasProject> => {
  const { data, error } = await supabase
    .from('canvas_projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Elementos
export const fetchElementsByProjectId = async (projectId: string): Promise<CanvasElement[]> => {
  const { data, error } = await supabase
    .from('canvas_elements')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project elements:', error);
    throw error;
  }

  return data || [];
};

export const createElement = async (
  element: Partial<CanvasElement>, 
  userId: string
): Promise<CanvasElement> => {
  const { data, error } = await supabase
    .from('canvas_elements')
    .insert({
      ...element,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating element:', error);
    throw error;
  }

  return data;
};

export const updateElement = async (
  elementId: string, 
  updates: Partial<CanvasElement>
): Promise<CanvasElement> => {
  const { data, error } = await supabase
    .from('canvas_elements')
    .update(updates)
    .eq('id', elementId)
    .select()
    .single();

  if (error) {
    console.error('Error updating element:', error);
    throw error;
  }

  return data;
};

export const deleteElement = async (elementId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_elements')
    .delete()
    .eq('id', elementId);

  if (error) {
    console.error('Error deleting element:', error);
    throw error;
  }
};

// Conexões
export const fetchConnectionsByProjectId = async (projectId: string): Promise<CanvasConnection[]> => {
  const { data, error } = await supabase
    .from('canvas_connections')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project connections:', error);
    throw error;
  }

  return data || [];
};

export const createConnection = async (
  connection: Partial<CanvasConnection>, 
  userId: string
): Promise<CanvasConnection> => {
  const { data, error } = await supabase
    .from('canvas_connections')
    .insert({
      ...connection,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating connection:', error);
    throw error;
  }

  return data;
};

export const updateConnection = async (
  connectionId: string, 
  updates: Partial<CanvasConnection>
): Promise<CanvasConnection> => {
  const { data, error } = await supabase
    .from('canvas_connections')
    .update(updates)
    .eq('id', connectionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating connection:', error);
    throw error;
  }

  return data;
};

export const deleteConnection = async (connectionId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_connections')
    .delete()
    .eq('id', connectionId);

  if (error) {
    console.error('Error deleting connection:', error);
    throw error;
  }
};

// Templates
export const fetchTemplates = async (category?: string): Promise<CanvasTemplate[]> => {
  let query = supabase
    .from('canvas_templates')
    .select('*')
    .eq('is_public', true);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }

  return data || [];
};

export const fetchTemplateById = async (templateId: string): Promise<CanvasTemplate> => {
  const { data, error } = await supabase
    .from('canvas_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (error) {
    console.error('Error fetching template:', error);
    throw error;
  }

  return data;
};

export const createProjectFromTemplate = async (
  templateId: string,
  title: string,
  description: string,
  userId: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('create_project_from_template', {
        p_user_id: userId,
        p_template_id: templateId,
        p_title: title,
        p_description: description
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project from template:', error);
    throw error;
  }
};

// Histórico e Snapshots
export const createProjectSnapshot = async (
  projectId: string,
  comment?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('create_project_snapshot', {
        p_project_id: projectId,
        p_comment: comment
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project snapshot:', error);
    throw error;
  }
};

export const fetchProjectHistory = async (projectId: string): Promise<CanvasHistory[]> => {
  const { data, error } = await supabase
    .from('canvas_history')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project history:', error);
    throw error;
  }

  return data || [];
};

// Tarefas
export const fetchTasksByProjectId = async (projectId: string): Promise<CanvasTask[]> => {
  const { data, error } = await supabase
    .from('canvas_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }

  return data || [];
};

export const createTask = async (
  task: Partial<CanvasTask>, 
  userId: string
): Promise<CanvasTask> => {
  const { data, error } = await supabase
    .from('canvas_tasks')
    .insert({
      ...task,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
};

export const updateTask = async (
  taskId: string, 
  updates: Partial<CanvasTask>
): Promise<CanvasTask> => {
  const { data, error } = await supabase
    .from('canvas_tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Calendário
export const fetchEventsByProjectId = async (projectId: string): Promise<CanvasCalendarEvent[]> => {
  const { data, error } = await supabase
    .from('canvas_calendar_events')
    .select('*')
    .eq('project_id', projectId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching project events:', error);
    throw error;
  }

  return data || [];
};

export const createEvent = async (
  event: Partial<CanvasCalendarEvent>, 
  userId: string
): Promise<CanvasCalendarEvent> => {
  const { data, error } = await supabase
    .from('canvas_calendar_events')
    .insert({
      ...event,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data;
};

export const updateEvent = async (
  eventId: string, 
  updates: Partial<CanvasCalendarEvent>
): Promise<CanvasCalendarEvent> => {
  const { data, error } = await supabase
    .from('canvas_calendar_events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_calendar_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Compartilhamento
export const shareProject = async (
  projectId: string,
  email: string,
  permission: 'view' | 'edit' | 'admin' = 'view',
  expiresAt?: string,
  userId?: string
): Promise<CanvasSharing> => {
  const { data, error } = await supabase
    .from('canvas_sharing')
    .insert({
      project_id: projectId,
      email,
      permission,
      expires_at: expiresAt,
      created_by: userId,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error sharing project:', error);
    throw error;
  }

  return data;
};

export const fetchProjectSharings = async (projectId: string): Promise<CanvasSharing[]> => {
  const { data, error } = await supabase
    .from('canvas_sharing')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching project sharings:', error);
    throw error;
  }

  return data || [];
};

export const revokeProjectSharing = async (sharingId: string): Promise<void> => {
  const { error } = await supabase
    .from('canvas_sharing')
    .update({ is_active: false })
    .eq('id', sharingId);

  if (error) {
    console.error('Error revoking project sharing:', error);
    throw error;
  }
};
