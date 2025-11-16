
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  onClick: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Save className="mr-1 h-4 w-4" /> Save
    </Button>
  );
};
