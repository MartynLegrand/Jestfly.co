
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, MoreHorizontal, Plus } from 'lucide-react';

interface NodeToolbarProps {
  onDelete: () => void;
  onDuplicate: () => void;
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  onDelete,
  onDuplicate,
}) => {
  return (
    <div className="absolute -top-10 left-0 flex items-center space-x-1 bg-white shadow-sm border border-gray-200 rounded-md px-1 py-0.5">
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDuplicate}>
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
