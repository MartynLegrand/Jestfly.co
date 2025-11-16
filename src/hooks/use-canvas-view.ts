
import { useState, useCallback } from 'react';
import { Position } from '@/types/canvas';

export const useCanvasView = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewPosition, setViewPosition] = useState<Position>({ x: 0, y: 0 });

  const resetView = useCallback(() => {
    setZoomLevel(1);
    setViewPosition({ x: 0, y: 0 });
  }, []);

  return {
    zoomLevel,
    viewPosition,
    setZoomLevel,
    setViewPosition,
    resetView
  };
};
