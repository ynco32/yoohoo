'use client';

import { SeatProps } from '@/types/seats';
import { useEffect, useState } from 'react';

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
  scrapped,
  isScrapMode,
  isSelected,
  reviewCount,
  x,
  y,
  width,
  height,
  onClick,
}: SeatComponentProps) => {
  const [seatColor, setSeatColor] = useState('#4A90E2');

  useEffect(() => {
    // reviewCount에 따라 색상 설정
    if (reviewCount === 0) {
      setSeatColor('#e0f6ff');
    } else if (reviewCount < 2) {
      setSeatColor('#63beff');
    } else {
      setSeatColor('#4788ff');
    }
  }, [reviewCount]); // reviewCount가 변경될 때만 실행

  const getFillColor = () => {
    if (isSelected) return '#2C3A8B';
    if (!isScrapMode) return seatColor;
    return scrapped ? '#FF6B6B' : seatColor;
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
