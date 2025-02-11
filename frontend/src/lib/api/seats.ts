// lib/api/seats.ts

interface ApiSeat {
  seatId: number;
  rowLine: number;
  columnLine: number;
  reviewCount: number;
  sectionNumber: number;
  scrapped: boolean;
}

interface ApiResponse {
  seats: ApiSeat[];
}

export interface SeatProps {
  seatId: number;
  arenaId: number;
  sectionId: number;
  row: number;
  col: number;
  isScraped: boolean;
  isScrapMode: boolean;
  isSelected: boolean;
}

export async function fetchSeats(
  arenaId: number,
  stageType: number,
  sectionNumber: number
): Promise<SeatProps[]> {
  try {
    const response = await fetch(
      `/api/v1/view/arenas/${arenaId}?stageType=${stageType}&section=${sectionNumber}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch seats');
    }

    const data: ApiResponse = await response.json();

    // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
    return data.seats.map((seat) => ({
      seatId: seat.seatId,
      arenaId: arenaId,
      sectionId: seat.sectionNumber,
      row: seat.rowLine,
      col: seat.columnLine,
      isScraped: seat.scrapped,
      isScrapMode: false, // 기본값으로 설정
      isSelected: false, // 기본값으로 설정
    }));
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw error;
  }
}
