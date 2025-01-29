/**
 * @component Seat
 * @description 개별 좌석을 SVG 요소로 렌더링하는 컴포넌트입니다.
 *
 * @details
 * - 좌석의 상태(선택됨, 스크랩됨)에 따라 다른 색상을 표시합니다.
 * - SVG <g> 요소를 사용하여 좌석 정보를 data 속성으로 저장합니다.
 * - 클릭 가능한 인터랙티브 요소로 작동합니다.
 */

'use client';

/**
 * @interface SeatData
 * @description 좌석의 기본 데이터 구조를 정의합니다.
 */
interface SeatData {
  seatId: number; // 좌석 고유 식별자
  arenaId: number; // 공연장 식별자
  sectionId: number; // 섹션 식별자
  row: number; // 좌석 행 번호
  col: number; // 좌석 열 번호
  isScraped: boolean; // 스크랩 여부
  isScrapMode: boolean; // 스크랩 모드 상태
  isSelected: boolean; // 선택 상태
}

/**
 * @interface SeatProps
 * @description Seat 컴포넌트의 props 타입을 정의합니다.
 * @extends Omit<SeatData, 'isScrapMode'> - SeatData에서 isScrapMode를 제외한 모든 속성을 상속
 */
interface SeatProps extends Omit<SeatData, 'isScrapMode'> {
  x: number; // SVG 내 좌석의 x 좌표
  y: number; // SVG 내 좌석의 y 좌표
  width: number; // 좌석의 너비
  height: number; // 좌석의 높이
  isScrapMode: boolean; // 스크랩 모드 상태
  onClick: () => void; // 클릭 이벤트 핸들러
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
  /**
   * 좌석의 상태에 따른 색상을 결정하는 함수
   * @returns {string} 좌석을 채울 색상 코드
   *
   * - 선택된 상태: #2C3A8B (짙은 파랑)
   * - 스크랩된 상태: #FF6B6B (빨강)
   * - 기본 상태: #4A90E2 (파랑)
   */
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
