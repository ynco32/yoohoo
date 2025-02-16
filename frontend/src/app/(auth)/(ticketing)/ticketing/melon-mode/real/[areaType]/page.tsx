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

export default function Seat() {
  const [isActive, setIsActive] = useState(false);
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  const router = useRouter();
  const areaId = useParams().areaType as string;

  const { error, clearError, selectedSeatNumber, tryReserveSeat } =
    useTicketingSeatStore();

  const userId = useUserStore((state) => state.user?.userId);
  const { onSuccess, setSecurityPopupState } = useSecurityPopupStore();

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
