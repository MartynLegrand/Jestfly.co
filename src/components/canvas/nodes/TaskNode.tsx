import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvas } from '@/context/canvas';
import { CheckSquare, Calendar, AlertCircle } from 'lucide-react';

export const TaskNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState((data.title as string) || 'Task');
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
  const priority = metadata.priority as string | undefined;
  const status = metadata.status as string | undefined;
  const dueDate = metadata.dueDate as string | undefined;
  
  // Helper function to get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to get status background
  const getStatusBackground = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'in_progress':
        return 'bg-blue-100';
      case 'blocked':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div
      className={`px-4 py-2 rounded-md shadow-md ${
        selected ? 'border-2 border-primary' : 'border border-gray-300'
      } ${getStatusBackground(status)}`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center mb-1">
        <CheckSquare className="w-4 h-4 text-blue-600 mr-1" />
        
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
          <div className="font-medium text-sm">{title}</div>
        )}
        
        {priority && (
          <AlertCircle className={`ml-auto w-3 h-3 ${getPriorityColor(priority)}`} />
        )}
      </div>
      
      {dueDate && (
        <div className="text-xs text-gray-600 mt-1 flex items-center">
          <Calendar className="mr-1 w-3 h-3" />
          {new Date(dueDate).toLocaleDateString()}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};
