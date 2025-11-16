import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCanvas } from '@/context/canvas';
import { CanvasTemplate } from '@/types/canvas';
import { Loader2, Search, LayoutTemplate, Plus } from 'lucide-react';

export const TemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<CanvasTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<CanvasTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CanvasTemplate | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createProjectFromTemplate } = useCanvas(); // This will be added to the context
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // This would be replaced with a real API call
        const mockTemplates: CanvasTemplate[] = [
          {
            id: '1',
            title: 'Career Progression',
            description: 'Plan your career progression with milestones and goals',
            thumbnailUrl: '/placeholder.svg',
            category: 'Career',
            elements: [],
            connections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOfficial: true,
            isPublic: true,
            metadata: {}
          },
          {
            id: '2',
            title: 'Skills Development',
            description: 'Track and plan your skills development journey',
            thumbnailUrl: '/placeholder.svg',
            category: 'Learning',
            elements: [],
            connections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOfficial: true,
            isPublic: true,
            metadata: {}
          },
          {
            id: '3',
            title: 'Goal Setting',
            description: 'Set and track your personal and professional goals',
            thumbnailUrl: '/placeholder.svg',
            category: 'Goals',
            elements: [],
            connections: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOfficial: false,
            isPublic: true,
            metadata: {}
          }
        ];
        
        setTemplates(mockTemplates);
        setFilteredTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load templates',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTemplates(templates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = templates.filter(
        template => 
          template.title.toLowerCase().includes(query) || 
          (template.description && template.description.toLowerCase().includes(query)) ||
          (template.category && template.category.toLowerCase().includes(query))
      );
      setFilteredTemplates(filtered);
    }
  }, [searchQuery, templates]);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleTemplateSelect = (template: CanvasTemplate) => {
    setSelectedTemplate(template);
    setNewProjectTitle(template.title);
    setIsCreateDialogOpen(true);
  };
  
  const handleCreateProject = async () => {
    if (!selectedTemplate || !newProjectTitle.trim()) return;
    
    try {
      setIsLoading(true);
      // This would be implemented in CanvasContext
      // const projectId = await createProjectFromTemplate(selectedTemplate.id, newProjectTitle);
      // navigate(`/career-canvas/${projectId}`);
      
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      
      // For now, just close the dialog
      setIsCreateDialogOpen(false);
      setSelectedTemplate(null);
      setNewProjectTitle('');
    } catch (error) {
      console.error('Error creating project from template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Template Gallery</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-10">
          <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No templates found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                {template.isOfficial && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Official
                  </div>
                )}
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <LayoutTemplate className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{template.title}</CardTitle>
                {template.category && (
                  <div className="text-xs text-gray-500">{template.category}</div>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription className="line-clamp-2">
                  {template.description || 'No description available'}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project based on the {selectedTemplate?.title} template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="projectTitle" className="text-sm font-medium">
                Project Title
              </label>
              <Input
                id="projectTitle"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={isLoading || !newProjectTitle.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
