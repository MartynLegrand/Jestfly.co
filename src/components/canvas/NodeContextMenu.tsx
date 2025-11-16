
import React from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface NodeContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onDelete: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  position,
  onClose,
  onDelete
}) => {
  const style = {
    top: position.y,
    left: position.x
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-md shadow-md border border-gray-200"
      style={style}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="p-2 rounded-md hover:bg-gray-50">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <DropdownMenuItem 
            className={cn(
              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
