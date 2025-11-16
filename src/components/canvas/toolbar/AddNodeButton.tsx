
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddNodeButtonProps {
  type: 'task' | 'milestone' | 'note';
  onClick: (type: 'task' | 'milestone' | 'note') => void;
}

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({ type, onClick }) => {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <Button variant="outline" size="sm" onClick={() => onClick(type)}>
      <Plus className="mr-1 h-4 w-4" /> {typeLabel}
    </Button>
  );
};
