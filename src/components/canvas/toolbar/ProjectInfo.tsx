
import React from 'react';
import { CanvasProject } from '@/types/canvas';

interface ProjectInfoProps {
  project: CanvasProject;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">{project.title}</h2>
      {project.description && <p className="text-sm text-gray-500">{project.description}</p>}
    </div>
  );
};
