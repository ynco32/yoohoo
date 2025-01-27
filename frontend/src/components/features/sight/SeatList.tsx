'use client';

import Seat from '@/components/ui/Seat';
import { seats } from '@/types/seats';
import { useParams, useRouter } from 'next/navigation';

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

interface SeatListProps {
  isScrapMode: boolean;
}

export const SeatList = ({ isScrapMode }: SeatListProps) => {
  const { arenaId, sectionId } = useParams();
  const sectionIdNumber = Number(sectionId);
  const filteredSections = seats.filter(
    (seat) => seat.sectionId === sectionIdNumber
  );

  const router = useRouter();

  // 좌석 크기와 간격 설정
  const SEAT_WIDTH = 30;
  const SEAT_HEIGHT = 30;
  const SEAT_MARGIN = 5;

  // 전체 섹션의 행과 열 수 계산
  const maxRow = Math.max(...filteredSections.map((seat) => seat.row));
  const maxCol = Math.max(...filteredSections.map((seat) => seat.col));

  // SVG 뷰포트 크기 계산
  const viewBoxWidth = (maxCol + 1) * (SEAT_WIDTH + SEAT_MARGIN);
  const viewBoxHeight = (maxRow + 1) * (SEAT_HEIGHT + SEAT_MARGIN);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
    >
      {filteredSections.map((section) => (
        <Seat
          key={section.seatId}
          {...section}
          isScrapMode={isScrapMode}
          x={section.col * (SEAT_WIDTH + SEAT_MARGIN)}
          y={section.row * (SEAT_HEIGHT + SEAT_MARGIN)}
          width={SEAT_WIDTH}
          height={SEAT_HEIGHT}
          onClick={() =>
            router.push(
              `/sight/${section.arenaId}/${section.sectionId}/${section.seatId}`
            )
          }
        />
      ))}
    </svg>
  );
};

export default SeatList;
