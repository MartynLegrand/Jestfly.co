
import React from 'react';
import { CanvasProvider } from '@/context/canvas';
import { ProjectList } from '@/components/canvas/ProjectList';

const CareerDashboard: React.FC = () => {
  return (
    <CanvasProvider>
      <div className="container mx-auto py-4">
        <ProjectList />
      </div>
    </CanvasProvider>
  );
};

export default CareerDashboard;
