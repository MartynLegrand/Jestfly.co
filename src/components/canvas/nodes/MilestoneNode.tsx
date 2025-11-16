import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvas } from '@/context/canvas';
import { Award, Calendar } from 'lucide-react';

export const MilestoneNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState((data.title as string) || 'Milestone');
  const { updateNodeData } = useCanvas();

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (title !== data.title) {
      updateNodeData(id, { title });
    }
  }, [id, title, data.title, updateNodeData]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsEditing(false);
        updateNodeData(id, { title });
      }
    },
    [id, title, updateNodeData]
  );

  // Safely access metadata
  const metadata = data.metadata as Record<string, any> || {};
  const date = metadata.date as string | undefined;

  return (
    <div
      className={`px-4 py-2 rounded-md shadow-md ${
        selected ? 'border-2 border-primary' : 'border border-gray-300'
      } bg-gradient-to-r from-violet-100 to-purple-100`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center justify-center mb-1">
        <Award className="w-4 h-4 text-purple-600" />
      </div>
      
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      ) : (
        <div className="font-medium text-sm text-center">{title}</div>
      )}
      
      {date && (
        <div className="text-xs text-gray-600 mt-1 flex items-center justify-center">
          <Calendar className="mr-1 w-3 h-3" />
          {new Date(date).toLocaleDateString()}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};
