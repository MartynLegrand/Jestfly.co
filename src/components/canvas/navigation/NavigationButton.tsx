
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavigationButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon,
  onClick,
  tooltip,
  disabled = false
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClick}
            disabled={disabled}
            className={disabled ? "opacity-50 cursor-not-allowed" : ""}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
