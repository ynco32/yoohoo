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

'use client';

import { useEffect, useState } from 'react';
import Seat from '@/components/ui/Seat';
import { fetchSeats, SeatProps } from '@/lib/api/seats';
import { useParams, useRouter } from 'next/navigation';

interface SeatListProps {
  isScrapMode: boolean;
}

export const SeatList = ({ isScrapMode }: SeatListProps) => {
  const [seats, setSeats] = useState<SeatProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { arenaId, sectionId, stageType } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function loadSeats() {
      try {
        setIsLoading(true);
        const seatsData = await fetchSeats(
          Number(arenaId),
          //Number(stageType),
          'stageType',
          Number(sectionId)
        );
        setSeats(seatsData);
      } catch (error) {
        console.error('Failed to load seats:', error);
        // 에러 처리를 추가하세요 (예: 에러 상태 설정)
      } finally {
        setIsLoading(false);
      }
    }

    loadSeats();
  }, [arenaId, stageType, sectionId]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  const SEAT_WIDTH = 30;
  const SEAT_HEIGHT = 30;
  const SEAT_MARGIN = 5;

  const maxRow = Math.max(...seats.map((seat) => seat.row));
  const maxCol = Math.max(...seats.map((seat) => seat.col));

  const viewBoxWidth = (maxCol + 1) * (SEAT_WIDTH + SEAT_MARGIN);
  const viewBoxHeight = (maxRow + 1) * (SEAT_HEIGHT + SEAT_MARGIN);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
    >
      {seats.map((seat) => (
        <Seat
          key={seat.seatId}
          {...seat}
          isScrapMode={isScrapMode}
          x={seat.col * (SEAT_WIDTH + SEAT_MARGIN)}
          y={seat.row * (SEAT_HEIGHT + SEAT_MARGIN)}
          width={SEAT_WIDTH}
          height={SEAT_HEIGHT}
          onClick={() =>
            router.push(
              `/sight/${seat.arenaId}/${seat.sectionId}/${seat.seatId}`
            )
          }
        />
      ))}
    </svg>
  );
};

export default SeatList;
