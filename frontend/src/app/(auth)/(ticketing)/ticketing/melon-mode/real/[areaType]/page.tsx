'use client';
import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import { useState } from 'react';
import TicketingSeatList from '@/components/features/ticketing/TicketingSeatList';
import { useParams } from 'next/navigation';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useEffect } from 'react';

export default function Seat() {
  const [isActive, setIsActive] = useState(false);
  const [seat, setSeat] = useState('');
  const { selectedSeatNumber } = useTicketingSeatStore();
  const areaId = useParams().id as string;

  // selectedSeatNumber가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (selectedSeatNumber) {
      setIsActive(true);
      setSeat(selectedSeatNumber);
    }
  }, [selectedSeatNumber]); // 의존성 배열에 selectedSeatNumber 추가

  const handleClick = () => {
    // 결과 페이지로 이동하기
  };

  return (
    <div>
      <TicketingSeatList areaId={areaId} />
      <TicketingBottomBar
        onClick={handleClick}
        isActive={isActive}
        selectedSeat={seat}
      />
    </div>
  );
}
