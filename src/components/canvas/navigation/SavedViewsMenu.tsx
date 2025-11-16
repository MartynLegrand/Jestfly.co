
import React from 'react';
import { BookmarkCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { SavedView } from '@/hooks/use-canvas-navigation';

interface SavedViewsMenuProps {
  savedViews: Record<string, SavedView>;
  onLoadView: (viewName: string) => void;
}

export const SavedViewsMenu: React.FC<SavedViewsMenuProps> = ({
  savedViews,
  onLoadView
}) => {
  if (Object.keys(savedViews).length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <BookmarkCheck className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Load Saved View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        {Object.keys(savedViews).map((viewName) => (
          <DropdownMenuItem key={viewName} onClick={() => onLoadView(viewName)}>
            {viewName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
