export interface SeatProps {
  seatId: number;
  arenaId: number;
  sectionId: number;
  row: number;
  col: number;
  scrapped: boolean;
  isScrapMode: boolean;
  isSelected: boolean;
}
