// types/ticketingSeat.ts
export interface ApiSeatResponse {
  seatNumber: string; // "1-1" 형식
  status: 'AVAILABLE' | 'RESERVED';
  userId: number | null;
}

export interface TicketingSeatProps {
  seatNumber: string; // 원본 "1-1" 형식 유지
  row: number; // 파싱된 row 값
  col: number; // 파싱된 col 값
  status: 'AVAILABLE' | 'RESERVED';
  userId: number | null;
  isSelected: boolean; // UI 상태
}
