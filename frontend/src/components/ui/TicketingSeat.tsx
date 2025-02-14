// components/ui/TicketingSeat.tsx
import React from 'react';

interface TicketingSeatProps {
  x: number;
  y: number;
  width: number;
  height: number;
  number: string;
  status: 'AVAILABLE' | 'RESERVED';
  isSelected: boolean;
  onClick: () => void;
}

const TicketingSeat = ({
  x,
  y,
  width,
  height,
  number,
  status,
  isSelected,
  onClick,
}: TicketingSeatProps) => {
  const getFillColor = () => {
    if (isSelected) return '#4CAF50';
    if (status === 'RESERVED') return '#9E9E9E';
    return '#2196F3';
  };

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={status === 'AVAILABLE' ? onClick : undefined}
      className={
        status === 'AVAILABLE' ? 'cursor-pointer' : 'cursor-not-allowed'
      }
    >
      <rect
        width={width}
        height={height}
        rx={4}
        fill={getFillColor()}
        className="transition-colors duration-200"
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={10}
      >
        {number}
      </text>
    </g>
  );
};

export default TicketingSeat;
