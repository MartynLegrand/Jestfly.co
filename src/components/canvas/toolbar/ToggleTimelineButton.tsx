
import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToggleTimelineButtonProps {
  onClick: () => void;
  showTimeline: boolean;
}

export const ToggleTimelineButton: React.FC<ToggleTimelineButtonProps> = ({ 
  onClick, 
  showTimeline 
}) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <LayoutGrid className="mr-1 h-4 w-4" />
      {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
    </Button>
  );
};
