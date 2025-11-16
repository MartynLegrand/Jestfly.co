
import { useState } from 'react';
import { CanvasProject } from '@/types/canvas';
import { createProject } from '@/services/canvas/canvasService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useProjectCreation() {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateProject = async (userId?: string) => {
    if (!newProjectName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a project name",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCreating(true);
      const newProject = await createProject({
        title: newProjectName,
        description: newProjectDescription,
        userId: userId,
        isTemplate: false,
        isPublic: false,
        collaborators: [],
        tags: []
      });
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Reset form fields
      setNewProjectName('');
      setNewProjectDescription('');
      setIsDialogOpen(false);
      
      // Return the new project
      return newProject;
    } catch (err) {
      console.error("Failed to create project:", err);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    isDialogOpen,
    setIsDialogOpen,
    isCreating,
    handleCreateProject,
    navigateToProject: (projectId: string) => navigate(`/canvas/${projectId}`)
  };
}
