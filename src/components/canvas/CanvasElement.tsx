import React, { useState } from 'react';
import { useCanvas } from '@/context/canvas';
import { CanvasNode } from '@/types/canvas';

interface CanvasElementProps {
  element: CanvasNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, event: React.MouseEvent) => void;
  onDoubleClick: (id: string) => void;
  zoom: number;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onDragStart,
  onDoubleClick,
  zoom,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderElementContent = () => {
    switch (element.type) {
      case 'task':
        return (
          <div className="px-2 py-1">
            <div className="font-medium text-sm">{element.title}</div>
            {element.metadata?.status && (
              <div className="text-xs text-gray-500 mt-1">
                Status: {element.metadata.status}
              </div>
            )}
          </div>
        );
      case 'milestone':
        return (
          <div className="px-2 py-1">
            <div className="font-medium text-sm text-center">{element.title}</div>
            {element.metadata?.date && (
              <div className="text-xs text-gray-600 mt-1 text-center">
                {new Date(element.metadata.date as string).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      case 'note':
        return (
          <div className="px-2 py-1">
            <div className="font-medium text-sm">{element.title}</div>
            {element.content && (
              <div className="text-xs text-gray-700 mt-1">{element.content}</div>
            )}
          </div>
        );
      default:
        return <div className="text-sm">{element.title}</div>;
    }
  };
  
  const getElementStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: element.position.x * zoom,
      top: element.position.y * zoom,
      width: element.size.width * zoom,
      height: element.size.height * zoom,
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      cursor: 'pointer',
      overflow: 'hidden',
      ...element.style,
    };
    
    switch (element.type) {
      case 'task':
        return {
          ...baseStyle,
          backgroundColor: 'white',
          border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        };
      case 'milestone':
        return {
          ...baseStyle,
          backgroundColor: '#f3e8ff',
          border: isSelected ? '2px solid #8b5cf6' : '1px solid #d8b4fe',
        };
      case 'note':
        return {
          ...baseStyle,
          backgroundColor: '#fef9c3',
          border: isSelected ? '2px solid #facc15' : '1px solid #fde68a',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'white',
          border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        };
    }
  };
  
  return (
    <div
      style={getElementStyle()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      onMouseDown={(e) => onDragStart(element.id, e)}
      onDoubleClick={() => onDoubleClick(element.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderElementContent()}
      
      {isSelected && (
        <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-white shadow-sm border border-gray-200 rounded-md px-1 py-0.5">
          <button className="p-1 text-xs hover:bg-gray-100 rounded">Edit</button>
          <button className="p-1 text-xs hover:bg-gray-100 rounded">Delete</button>
        </div>
      )}
    </div>
  );
};

export default CanvasElement;
