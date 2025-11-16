import React from 'react';
import { useCanvas } from '@/context/canvas';
import { format } from 'date-fns';

interface TimelineProps {
  selectedNodeId: string | null;
}

export const Timeline: React.FC<TimelineProps> = ({ selectedNodeId }) => {
  const { nodes, edges } = useCanvas();
  
  // Sort nodes by creation date
  const sortedNodes = [...nodes].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="timeline-container">
      <h3 className="text-lg font-medium mb-4">Project Timeline</h3>
      
      {sortedNodes.length === 0 ? (
        <p className="text-gray-500 text-sm">No elements in this project yet.</p>
      ) : (
        <div className="space-y-4">
          {sortedNodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            const connectedEdges = edges.filter(
              edge => edge.sourceId === node.id || edge.targetId === node.id
            );
            
            return (
              <div 
                key={node.id} 
                className={`p-3 border rounded-md ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{node.title}</h4>
                    <p className="text-xs text-gray-500">
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(node.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                
                {connectedEdges.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Connected to {connectedEdges.length} element{connectedEdges.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
