
import React from 'react';
import { ConnectionLineComponentProps, getSmoothStepPath } from '@xyflow/react';

export const ConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        style={{ stroke: '#b1b1b7', strokeWidth: 1.5, fill: 'none', strokeDasharray: '5,5' }}
        d={edgePath}
        className="animated"
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#b1b1b7"
        r={3}
        stroke="none"
      />
    </g>
  );
};
