import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import { useState } from 'react';

export default function Seat() {
  const [isActiive, setIsActive] = useState(false);
  const [seat, setSeat] = useState(0);

  const handleSelectSeat = () => {
    setIsActive(true);
    /// 더미 데이터
    setSeat(5);
  };

  return (
    <div>
      <span onClick={handleSelectSeat} className="m-5 inline-block">
        임시 좌석
      </span>
      <TicketingBottomBar isActiive={isActiive} selectedSeat={seat} />
    </div>
  );
}
