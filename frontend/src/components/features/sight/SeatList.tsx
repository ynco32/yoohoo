'use client';

import { Seat } from '@/components/ui/Seat';
import { seats } from '@/types/seats';
import { useParams, useRouter } from 'next/navigation';

/**
 * @component SeatList
 * @description 세부 좌석 배치도를 표시하는 컴포넌트
 */

// 섹션 데이터 인터페이스 정의
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

// 섹션 리스트 props 인터페이스 정의
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

  return (
    <svg viewBox="0 0 800 450" width="800" height="450">
      {filteredSections.map((section) => (
        <Seat
          key={section.seatId}
          {...section}
          isScrapMode={isScrapMode}
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
