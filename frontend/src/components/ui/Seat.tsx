'use client';

interface SeatProps {
  seatId: number;
  arenaId: number;
  sectionId: number;
  row: number;
  col: number;
  isScraped: boolean;
  isScrapMode: boolean;
  isSelected: boolean;
  onClick?: () => void;
}

export const Seat = ({
  seatId,
  arenaId,
  sectionId,
  row,
  col,
  isScraped,
  isScrapMode,
  isSelected,
  onClick,
}: SeatProps) => {
  const getFillColor = () => {
    if (isSelected) return '#2C3A8B';
    if (!isScrapMode) return '#4A90E2';
    return isScraped ? '#FF6B6B' : '#4A90E2';
  };

  return (
    // 클릭 이벤트를 처리하는 그룹 컴포넌트
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }} // 클릭 가능한 경우 커서 스타일 변경
      data-seat-id={seatId} // 좌석 식별자
      data-arena-id={arenaId} // 영역 식별자
      data-section-id={sectionId} // 섹션 식별자
    >
      {/* 직사각형 도형 */}
      <rect
        x={row} // x 좌표
        y={col} // y 좌표
        width={100} // 너비
        height={100} // 높이
        fill={getFillColor()} // 채우기 색상
        stroke="#fff" // 테두리 색상
        strokeWidth="1" // 테두리 두께
      />
    </g>
  );
};
