
import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Bookmark, Target } from 'lucide-react';
import { NavigationButton } from './NavigationButton';
import { SavedViewsMenu } from './SavedViewsMenu';
import { useCanvasNavigation } from '@/hooks/use-canvas-navigation';

interface CanvasNavigationProps {
  selectedNodeId: string | null;
}

export const CanvasNavigation: React.FC<CanvasNavigationProps> = ({ selectedNodeId }) => {
  const {
    savedViews,
    handleZoomIn,
    handleZoomOut,
    handleFitView,
    handleCenterSelected,
    handleSaveCurrentView,
    handleLoadView
  } = useCanvasNavigation(selectedNodeId);

  return (
    <div className="flex flex-col gap-2 absolute top-20 right-4 bg-white p-2 rounded-md shadow border z-10">
      <NavigationButton
        icon={<ZoomIn className="h-4 w-4" />}
        onClick={handleZoomIn}
        tooltip="Zoom In"
      />

      <NavigationButton
        icon={<ZoomOut className="h-4 w-4" />}
        onClick={handleZoomOut}
        tooltip="Zoom Out"
      />

      <NavigationButton
        icon={<Maximize className="h-4 w-4" />}
        onClick={handleFitView}
        tooltip="Fit View"
      />

      <NavigationButton
        icon={<Target className="h-4 w-4" />}
        onClick={handleCenterSelected}
        tooltip="Center on Selected Node"
        disabled={!selectedNodeId}
      />

      <div className="border-t my-1"></div>

      <NavigationButton
        icon={<Bookmark className="h-4 w-4" />}
        onClick={handleSaveCurrentView}
        tooltip="Save Current View"
      />

      <SavedViewsMenu
        savedViews={savedViews}
        onLoadView={handleLoadView}
      />
    </div>
  );
};
