
import { useState, useEffect } from 'react';
import { CanvasProject, CanvasElement, CanvasConnection } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';
import {
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFullProject,
  createProjectFromTemplate
} from '@/services/canvas/canvasService';

export const useCanvasProject = (projectId?: string) => {
  const [project, setProject] = useState<CanvasProject | null>(null);
  const [nodes, setNodes] = useState<CanvasElement[]>([]);
  const [edges, setEdges] = useState<CanvasConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const fullProject = await getFullProject(projectId);
        setProject(fullProject.project);
        setNodes(fullProject.nodes);
        setEdges(fullProject.edges);
      } catch (err) {
        console.error("Error loading project:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, toast]);

  const saveProject = async (updates: Partial<CanvasProject>) => {
    if (!project) return null;
    
    try {
      const updatedProject = await updateProject(project.id, updates);
      setProject(updatedProject);
      toast({
        title: "Success",
        description: "Project saved successfully",
      });
      return updatedProject;
    } catch (err) {
      console.error("Error saving project:", err);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
      return null;
    }
  };

  const createNewProject = async (newProject: Partial<CanvasProject>) => {
    try {
      const createdProject = await createProject(newProject);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      return createdProject;
    } catch (err) {
      console.error("Error creating project:", err);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return null;
    }
  };

  const createFromTemplate = async (templateId: string, title: string, description?: string) => {
    try {
      const createdProject = await createProjectFromTemplate(templateId, title, description);
      toast({
        title: "Success",
        description: "Project created from template successfully",
      });
      return createdProject;
    } catch (err) {
      console.error("Error creating project from template:", err);
      toast({
        title: "Error",
        description: "Failed to create project from template",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeProject = async () => {
    if (!project) return false;
    
    try {
      await deleteProject(project.id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      return true;
    } catch (err) {
      console.error("Error deleting project:", err);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    project,
    nodes,
    edges,
    loading,
    error,
    saveProject,
    createNewProject,
    createFromTemplate,
    removeProject,
  };
};
