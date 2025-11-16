
import React from 'react';
import { CanvasProject } from '@/types/canvas';
import { 
  AddNodeButton, 
  SaveButton, 
  ToggleTimelineButton,
  ProjectInfo 
} from './toolbar';

interface CanvasToolbarProps {
  project: CanvasProject;
  onAddNode: (type: 'task' | 'milestone' | 'note') => void;
  onSave: () => void;
  onToggleTimeline?: () => void;
  showTimeline?: boolean;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  project,
  onAddNode,
  onSave,
  onToggleTimeline,
  showTimeline,
}) => {
  return (
    <div className="border-b border-gray-200 bg-white p-4 flex justify-between items-center">
      <ProjectInfo project={project} />
      
      <div className="flex space-x-2">
        <AddNodeButton type="task" onClick={onAddNode} />
        <AddNodeButton type="milestone" onClick={onAddNode} />
        <AddNodeButton type="note" onClick={onAddNode} />
        <SaveButton onClick={onSave} />
        
        {onToggleTimeline && (
          <ToggleTimelineButton 
            onClick={onToggleTimeline}
            showTimeline={showTimeline || false}
          />
        )}
      </div>
    </div>
  );
};
