'use client';

interface SeatData {
  seatId: number;
  arenaId: number;
  sectionId: number;
  row: number;
  col: number;
  isScraped: boolean;
  isScrapMode: boolean;
  isSelected: boolean;
}

interface SeatProps extends Omit<SeatData, 'isScrapMode'> {
  x: number;
  y: number;
  width: number;
  height: number;
  isScrapMode: boolean;
  onClick: () => void;
}

const Seat = ({
  seatId,
  arenaId,
  sectionId,
  row,
  col,
  isScraped,
  isScrapMode,
  isSelected,
  x,
  y,
  width,
  height,
  onClick,
}: SeatProps) => {
  const getFillColor = () => {
    if (isSelected) return '#2C3A8B';
    if (!isScrapMode) return '#4A90E2';
    return isScraped ? '#FF6B6B' : '#4A90E2';
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
