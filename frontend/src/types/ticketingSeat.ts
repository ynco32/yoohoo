export interface TicketingSeatProps {
  seatNumber: string | number;
  status: 'AVAILABLE' | 'RESERVED';
  userId: number | null;
}
