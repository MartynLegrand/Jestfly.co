
import React, { useState, useEffect } from 'react';
import { CanvasProject } from '@/types/canvas';
import { getProjects } from '@/services/canvas/canvasService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProjectCreation } from '@/hooks/use-project-creation';
import { ProjectCard } from '@/components/canvas/ProjectCard';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    isDialogOpen,
    setIsDialogOpen,
    isCreating,
    handleCreateProject,
    navigateToProject
  } = useProjectCreation();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectList = await getProjects();
        setProjects(projectList);
      } catch (err) {
        console.error("Failed to load projects:", err);
        toast({
          title: "Error",
          description: "Failed to load your projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const onCreateProject = async () => {
    const newProject = await handleCreateProject(user?.id);
    if (newProject) {
      setProjects([newProject, ...projects]);
      navigateToProject(newProject.id);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Career Planning Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visualize and plan your career path with interactive tools
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new career planning project to visualize your goals and milestones.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="project-name"
                  placeholder="My Career Plan"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="project-description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  id="project-description"
                  placeholder="Career planning for the next 5 years"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreateProject} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first project to get started with career planning
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
