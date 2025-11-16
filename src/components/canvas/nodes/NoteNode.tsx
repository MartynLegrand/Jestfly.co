
import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvas } from '@/context/canvas';
import { StickyNote } from 'lucide-react';

export const NoteNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState((data.title as string) || 'Note');
  const [content, setContent] = useState((data.content as string) || '');
  const { updateNodeData } = useCanvas();

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (title !== data.title || content !== data.content) {
      updateNodeData(id, { title, content });
    }
  }, [id, title, content, data.title, data.content, updateNodeData]);

  const handleTitleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const textArea = document.getElementById(`note-content-${id}`) as HTMLTextAreaElement;
        if (textArea) {
          textArea.focus();
        }
      }
    },
    [id]
  );

  return (
    <div
      className={`px-3 py-2 rounded-md shadow-md ${
        selected ? 'border-2 border-primary' : 'border border-gray-300'
      } bg-yellow-50`}
      style={{ minHeight: '100px' }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center mb-1">
        <StickyNote className="w-4 h-4 text-yellow-600 mr-1" />
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            className="w-full px-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        ) : (
          <div className="font-medium text-sm">{title}</div>
        )}
      </div>
      
      {isEditing ? (
        <textarea
          id={`note-content-${id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-full h-16 px-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      ) : (
        <div className="text-xs text-gray-700 overflow-y-auto h-16">{content}</div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};
