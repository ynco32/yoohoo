'use client';
import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import { useState } from 'react';
import TicketingSeatList from '@/components/features/ticketing/TicketingSeatList';
import { useParams } from 'next/navigation';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SeatTakenPopup } from '@/components/features/ticketing/SeatTakenPopup';
import { ErrorPopup } from '@/components/features/ticketing/ErrorPopup';
import { useUserStore } from '@/store/useUserStore';

export default function Seat() {
  const [isActive, setIsActive] = useState(false);
  const [_seat, setSeat] = useState('');
  const { selectedSeatNumber, tryReserveSeat } = useTicketingSeatStore();
  const [isSeatTakenPopupOpen, setIsSeatTakenPopupOpen] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null); // 에러 뜰 경우
  const router = useRouter();

  const userId = useUserStore((state) => state.user?.userId);
  const handleReservationError = (errorMessage: string) => {
    setReservationError(errorMessage);
  };
  const areaId = useParams().areaType as string;

  // selectedSeatNumber가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (selectedSeatNumber) {
      setIsActive(true);
      setSeat(selectedSeatNumber);
    } else {
      // selectedSeatNumber가 null일 때 처리 추가
      setIsActive(false);
      setSeat('');
    }
  }, [selectedSeatNumber]);

  // 이선좌
  const onSeatTaken = () => {
    setIsSeatTakenPopupOpen(true);
  };

  // [React] 예매하기 버튼 클릭 시 실행되는 함수
  const handleReservationClick = async () => {
    if (!selectedSeatNumber || !userId) {
      setReservationError('좌석을 선택해주세요.');
      return;
    }

    try {
      // 여기서 실제 예매 API 호출
      await tryReserveSeat(areaId, selectedSeatNumber);
      // 성공하면 결제 페이지로 이동
      router.push('payment1');
    } catch (error) {
      // 실패하면 에러 메시지 표시
      setReservationError(
        error instanceof Error ? error.message : '예매에 실패했습니다.'
      );
    }
  };

  // let children: string = '';

  // if (selectedSeatNumber) {
  //   children = ' 번 좌석 선택';
  // } else {
  //   children = '선택된 좌석 없음';
  // }
  const bottomBarContent = selectedSeatNumber
    ? `${areaId}구역 ${selectedSeatNumber}번 좌석 예매하기`
    : '선택된 좌석 없음';

  const errorOnClick = () => {
    setReservationError(null);
  };

  return (
    <div>
      <TicketingSeatList
        onReservationError={handleReservationError}
        onSeatTaken={onSeatTaken}
        areaId={areaId}
      />
      <TicketingBottomBar
        onClick={handleReservationClick}
        isActive={isActive}
        // selectedSeat={selectedSeatNumber ? selectedSeatNumber : ''}
      >
        {bottomBarContent}
      </TicketingBottomBar>
      <SeatTakenPopup
        onClick={() => setIsSeatTakenPopupOpen(false)}
        isOpen={isSeatTakenPopupOpen}
      />
      <ErrorPopup isOpen={reservationError != null} onClick={errorOnClick}>
        {reservationError}
      </ErrorPopup>
    </div>
  );
}
