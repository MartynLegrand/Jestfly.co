import React from 'react';
import { CanvasEdge, CanvasNode } from '@/types/canvas';
import { useCanvas } from '@/context/canvas';

interface CanvasConnectionProps {
  connection: CanvasEdge;
  elements: CanvasNode[];
  isSelected: boolean;
  onSelect: (connection: CanvasEdge) => void;
  zoom: number;
}

const CanvasConnection: React.FC<CanvasConnectionProps> = ({
  connection,
  elements,
  isSelected,
  onSelect,
  zoom,
}) => {
  const sourceElement = elements.find(el => el.id === connection.sourceId);
  const targetElement = elements.find(el => el.id === connection.targetId);
  
  if (!sourceElement || !targetElement) {
    return null;
  }
  
  const sourceX = sourceElement.position.x + sourceElement.size.width / 2;
  const sourceY = sourceElement.position.y + sourceElement.size.height / 2;
  const targetX = targetElement.position.x + targetElement.size.width / 2;
  const targetY = targetElement.position.y + targetElement.size.height / 2;
  
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  
  const path = `M${sourceX * zoom},${sourceY * zoom} L${targetX * zoom},${targetY * zoom}`;
  
  const arrowLength = 10 * zoom;
  const arrowWidth = 6 * zoom;
  
  const arrowX1 = targetX * zoom - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle);
  const arrowY1 = targetY * zoom - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle);
  const arrowX2 = targetX * zoom - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle);
  const arrowY2 = targetY * zoom - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle);
  
  const labelX = (sourceX + targetX) / 2 * zoom;
  const labelY = (sourceY + targetY) / 2 * zoom;
  
  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(connection);
      }}
    >
      <path
        d={path}
        stroke={isSelected ? '#0ea5e9' : '#94a3b8'}
        strokeWidth={isSelected ? 2 : 1}
        fill="none"
        strokeDasharray={connection.style?.strokeDasharray || (isSelected ? 'none' : 'none')}
      />
      
      <polygon
        points={`${targetX * zoom},${targetY * zoom} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={isSelected ? '#0ea5e9' : '#94a3b8'}
      />
      
      {connection.label && (
        <g>
          <rect
            x={labelX - 40 * zoom}
            y={labelY - 10 * zoom}
            width={80 * zoom}
            height={20 * zoom}
            fill={isSelected ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255, 255, 255, 0.7)'}
            rx={4 * zoom}
            ry={4 * zoom}
            stroke={isSelected ? '#0ea5e9' : 'none'}
            strokeWidth={isSelected ? 1 : 0}
          />
          <text
            x={labelX}
            y={labelY + 4 * zoom}
            fontSize={12 * zoom}
            textAnchor="middle"
            fill={isSelected ? '#0ea5e9' : '#64748b'}
          >
            {connection.label}
          </text>
        </g>
      )}
    </g>
  );
};

export default CanvasConnection;
