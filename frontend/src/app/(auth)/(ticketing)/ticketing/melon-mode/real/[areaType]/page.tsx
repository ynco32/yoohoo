'use client';

import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import { useState, useEffect } from 'react';
import TicketingSeatList from '@/components/features/ticketing/TicketingSeatList';
import { useParams, useRouter } from 'next/navigation';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { ErrorPopup } from '@/components/features/ticketing/ErrorPopup';
import { useUserStore } from '@/store/useUserStore';
import { useSecurityPopupStore } from '@/store/useSecurityPopupStore';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useRevertSeat } from '@/store/useRevertSeatStore';
import api from '@/lib/api/axios';

export default function Seat() {
  const [isActive, setIsActive] = useState(false);
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  const router = useRouter();
  const areaId = useParams().areaType as string;

  const { error, clearError, selectedSeatNumber, tryReserveSeat } =
    useTicketingSeatStore();

  const userId = useUserStore((state) => state.user?.userId);
  const { onSuccess, setSecurityPopupState } = useSecurityPopupStore();

  const setPrevAdress = useRevertSeat((state) => state.setPrevAdress);
  const { prevAdress } = useRevertSeat();

  const cleanup = async () => {
    try {
      console.log('🪑 예약 취소 API 호출 시도');
      await api.delete('/api/v1/ticketing/result');
      console.log('🪑 예약이 성공적으로 취소되었습니다.');
    } catch (error) {
      console.error('🪑 예약 취소 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    console.log('🪑 useEffect 시작작');
    if (prevAdress === 'payment') {
      console.log('🪑 전에 갔던 페이지가 결제창입니다.');
      cleanup();
      setPrevAdress(''); // 삭제했으니 초기화
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // selectedSeatNumber 변경 시 버튼 활성화 상태 업데이트
  useEffect(() => {
    setIsActive(!!selectedSeatNumber);
  }, [selectedSeatNumber]);

  // 예매하기 버튼 클릭 핸들러
  const handleReservationClick = async () => {
    if (!selectedSeatNumber || !userId) {
      return;
    }

    // 보안 문자 인증 확인
    if (!onSuccess) {
      setisSecurityMessageOpen(true);
      return;
    }

    try {
      await tryReserveSeat(areaId, selectedSeatNumber);
      router.push('payment1');
    } catch (_error) {
      // 에러는 store에서 처리됨
    }
  };

  // 보안 문자 관련
  const handleSecurityPostpone = () => {
    setisSecurityMessageOpen(false);
  };

  const handleSecuritySuccess = () => {
    setisSecurityMessageOpen(false);
    setSecurityPopupState(true);
  };

  const bottomBarContent = selectedSeatNumber
    ? `${areaId}구역 ${selectedSeatNumber}번 좌석 예매하기`
    : '선택된 좌석 없음';

  return (
    <div>
      <TicketingSeatList areaId={areaId} />
      <TicketingBottomBar onClick={handleReservationClick} isActive={isActive}>
        {bottomBarContent}
      </TicketingBottomBar>

      {error && (
        <ErrorPopup isOpen={!!error} onClick={clearError}>
          {error.message}
        </ErrorPopup>
      )}
      <SecurityMessagePopup
        isOpen={isSecurityMessageOpen}
        onPostpone={handleSecurityPostpone}
        onSuccess={handleSecuritySuccess}
      />
    </div>
  );
}
