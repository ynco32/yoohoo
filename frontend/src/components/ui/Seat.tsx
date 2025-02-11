'use client';

import { SeatProps } from '@/types/seats';

interface SeatComponentProps extends SeatProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
}

const Seat = ({
  seatId,
  arenaId,
  sectionId,
  row,
  col,
  scrapped,
  isScrapMode,
  isSelected,
  x,
  y,
  width,
  height,
  onClick,
}: SeatComponentProps) => {
  const getFillColor = () => {
    if (isSelected) return '#2C3A8B';
    if (!isScrapMode) return '#4A90E2';
    return scrapped ? '#FF6B6B' : '#4A90E2';
  };

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      data-seat-id={seatId}
      data-arena-id={arenaId}
      data-section-id={sectionId}
    >
      <rect x={x} y={y} width={width} height={height} fill={getFillColor()} />
    </g>
  );
};

export default Seat;
