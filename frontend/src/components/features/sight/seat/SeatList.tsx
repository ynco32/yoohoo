/**
 * @component SeatList
 * @description 특정 섹션의 모든 좌석을 SVG로 렌더링하는 컴포넌트입니다.
 *
 * @props {boolean} isScrapMode - 스크랩 모드 활성화 여부를 결정하는 플래그
 *
 * @details
 * - URL 파라미터에서 arenaId와 sectionId를 추출하여 해당 섹션의 좌석만 필터링합니다.
 * - 좌석들은 SVG 내에서 격자 형태로 배치되며, 각 좌석의 위치는 row와 col 값을 기반으로 계산됩니다.
 * - 각 좌석은 클릭 시 해당 좌석의 상세 페이지로 라우팅됩니다.
 */

'use client';

import Seat from '@/components/ui/Seat';
import { seats } from '@/types/seats';
import { useParams, useRouter } from 'next/navigation';

/**
 * @interface SeatData
 * @description 개별 좌석의 데이터 구조를 정의합니다.
 */
// interface SeatData {
//   seatId: number; // 좌석 고유 식별자
//   arenaId: number; // 공연장 식별자
//   sectionId: number; // 섹션 식별자
//   row: number; // 좌석 행 번호
//   col: number; // 좌석 열 번호
//   isScraped: boolean; // 스크랩 여부
//   isScrapMode: boolean; // 스크랩 모드 상태
//   isSelected: boolean; // 선택 상태
// }

/**
 * @interface SeatListProps
 * @description SeatList 컴포넌트의 props 타입을 정의합니다.
 */
interface SeatListProps {
  isScrapMode: boolean; // 스크랩 모드 활성화 상태
}

export const SeatList = ({ isScrapMode }: SeatListProps) => {
  // URL 파라미터에서 arenaId와 sectionId 추출
  const { stageType, sectionId } = useParams();
  const sectionIdNumber = Number(sectionId);
  const currentStageType = Number(stageType);

  // 현재 섹션에 해당하는 좌석만 필터링
  const filteredSections = seats.filter(
    (seat) => seat.sectionId === sectionIdNumber
  );

  const router = useRouter();

  /**
   * 좌석 레이아웃 관련 상수
   * @constant
   */
  const SEAT_WIDTH = 30; // 좌석 너비 (픽셀)
  const SEAT_HEIGHT = 30; // 좌석 높이 (픽셀)
  const SEAT_MARGIN = 5; // 좌석 간 여백 (픽셀)

  /**
   * 전체 섹션의 최대 행/열 계산
   * - 모든 좌석의 row, col 값 중 최댓값을 찾아 SVG 크기 결정에 사용
   */
  const maxRow = Math.max(...filteredSections.map((seat) => seat.row));
  const maxCol = Math.max(...filteredSections.map((seat) => seat.col));

  /**
   * SVG 뷰포트 크기 계산
   * - 좌석 크기와 여백을 고려하여 전체 SVG 영역 크기 설정
   */
  const viewBoxWidth = (maxCol + 1) * (SEAT_WIDTH + SEAT_MARGIN);
  const viewBoxHeight = (maxRow + 1) * (SEAT_HEIGHT + SEAT_MARGIN);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
    >
      {/* 필터링된 좌석들을 SVG 내에 배치 */}
      {filteredSections.map((section) => (
        <Seat
          key={section.seatId}
          {...section}
          isScrapMode={isScrapMode}
          x={section.col * (SEAT_WIDTH + SEAT_MARGIN)} // 열 위치에 따른 x 좌표 계산
          y={section.row * (SEAT_HEIGHT + SEAT_MARGIN)} // 행 위치에 따른 y 좌표 계산
          width={SEAT_WIDTH}
          height={SEAT_HEIGHT}
          onClick={() =>
            router.push(
              `/sight/${section.arenaId}/${currentStageType}/${section.sectionId}/${section.seatId}`
            )
          }
        />
      ))}
    </svg>
  );
};

export default SeatList;
