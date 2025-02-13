'use client';

import { TicketingSeatProps } from '@/types/ticketingSeat';

interface TicketingSeatComponentProps extends TicketingSeatProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
}

const Seat = ({
  seatNumber,
  status,
  row,
  col,
  x,
  y,
  width,
  height,
  onClick,
}: TicketingSeatComponentProps) => {
  const getFillColor = () => {
    if (status === 'AVAILABLE') return '#2C3A8B';
    if (status === 'RESERVED') return '#4A90E2';
  };

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      data-seat-id={seatNumber}
    >
      <rect x={x} y={y} width={width} height={height} fill={getFillColor()} />
    </g>
  );
};

export default Seat;
