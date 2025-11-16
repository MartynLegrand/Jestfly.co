
import React from 'react';
import { Link } from 'react-router-dom';
import { CanvasProject } from '@/types/canvas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: CanvasProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card key={project.id} className="overflow-hidden">
      {project.thumbnailUrl && (
        <div className="h-40 overflow-hidden">
          <img 
            src={project.thumbnailUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>
          <span className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            Created on {formatDate(project.createdAt)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 line-clamp-2">
          {project.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/canvas/${project.id}`}>Open Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
