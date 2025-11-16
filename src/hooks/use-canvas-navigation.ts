
import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";
import { Position } from '@/types/canvas';

export interface SavedView {
  x: number;
  y: number;
  zoom: number;
}

export const useCanvasNavigation = (selectedNodeId: string | null) => {
  const { zoomIn, zoomOut, fitView, setCenter, getNodes, getViewport, setViewport } = useReactFlow();
  const [savedViews, setSavedViews] = useState<Record<string, SavedView>>({});
  const { toast } = useToast();

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 500, padding: 0.2 });
    toast({
      title: "View adjusted",
      description: "Canvas adjusted to fit all elements"
    });
  }, [fitView, toast]);

  const handleCenterSelected = useCallback(() => {
    if (!selectedNodeId) {
      toast({
        title: "No node selected",
        description: "Please select a node to center the view",
        variant: "destructive"
      });
      return;
    }

    const node = getNodes().find(n => n.id === selectedNodeId);
    if (node) {
      // Update this to match the correct API - removed nodeId
      setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.5 });
      toast({
        title: "View centered",
        description: "Canvas centered on selected node"
      });
    }
  }, [selectedNodeId, getNodes, setCenter, toast]);

  const handleSaveCurrentView = useCallback(() => {
    const viewport = getViewport();
    
    // Create a name for the view
    const viewName = `View ${Object.keys(savedViews).length + 1}`;
    
    // Save the current view
    setSavedViews(prev => ({
      ...prev,
      [viewName]: viewport
    }));
    
    toast({
      title: "View saved",
      description: `Current view saved as "${viewName}"`
    });
  }, [getViewport, savedViews, toast]);

  const handleLoadView = useCallback((viewName: string) => {
    const view = savedViews[viewName];
    if (!view) return;
    
    setViewport({ x: view.x, y: view.y, zoom: view.zoom }, { duration: 500 });
    
    toast({
      title: "View loaded",
      description: `Loaded "${viewName}"`
    });
  }, [savedViews, setViewport, toast]);

  return {
    savedViews,
    handleZoomIn,
    handleZoomOut,
    handleFitView, 
    handleCenterSelected,
    handleSaveCurrentView,
    handleLoadView
  };
};
