'use client';
import TicketingSeatList from '@/components/features/ticketing/TicketingSeatList';

export default function Grape() {
  return (
    <div>
      <TicketingSeatList
        areaId=""
        onReservationError={() => {}}
        onSeatTaken={() => {}}
      />
    </div>
  );
}
