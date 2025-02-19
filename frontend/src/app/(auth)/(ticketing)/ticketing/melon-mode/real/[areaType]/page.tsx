// app/(auth)/(ticketing)/ticketing/melon-mode/real/[areaType]/page.tsx
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
import api from '@/lib/api/axios';
import { useRevertSeat } from '@/store/useRevertSeatStore';

export default function Seat() {
  const [isActive, setIsActive] = useState(false);
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  const router = useRouter();
  const areaId = useParams().areaType as string;

  const { error, clearError, selectedSeatNumber, tryReserveSeat } =
    useTicketingSeatStore();

  const userId = useUserStore((state) => state.user?.userId);
  const { onSuccess, setSecurityPopupState } = useSecurityPopupStore();

  const hasVisitedPayment = useRevertSeat((state) => state.hasVisitedPayment);
  const setHasVisitedPayment = useRevertSeat(
    (state) => state.setHasVisitedPayment
  );
  const setPrevAdress = useRevertSeat((state) => state.setPrevAdress);
  const prevAdress = useRevertSeat((state) => state.prevAdress);

  console.log('🏁 Seat 컴포넌트 초기 렌더링:', {
    prevAdress,
    hasVisitedPayment,
    timestamp: new Date().toISOString(),
  });

  const cleanup = async () => {
    try {
      console.log('🧹 Cleanup API 호출 전 상태:', {
        prevAdress,
        hasVisitedPayment,
        timestamp: new Date().toISOString(),
      });

      await api.delete('/api/v1/ticketing/result');
      console.log('✅ Cleanup API 호출 성공');
    } catch (error) {
      console.error('❌ Cleanup API 호출 실패:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleMount = async () => {
      console.log('🎯 마운트 시 상태 체크:', {
        prevAdress,
        hasVisitedPayment,
        timestamp: new Date().toISOString(),
      });

      // 'payment'나 'payment-left' 상태 모두에서 cleanup 실행
      if (
        hasVisitedPayment &&
        (prevAdress === 'payment' || prevAdress === 'payment-left')
      ) {
        console.log('✨ Cleanup 조건 충족, 실행 시작');

        try {
          console.log('🧹 Cleanup API 호출 전');
          await cleanup();
          console.log('✅ Cleanup API 호출 성공');

          if (isMounted) {
            // 상태 초기화
            setPrevAdress('');
            setHasVisitedPayment(false);
            console.log('🔄 상태 초기화 완료');
          }
        } catch (error) {
          console.error('❌ Cleanup 실패:', error);
        }
      } else {
        console.log('❌ Cleanup 조건 불충족:', {
          hasVisitedPayment,
          prevAdress,
          timestamp: new Date().toISOString(),
        });
      }
    };

    handleMount();

    return () => {
      isMounted = false;
      console.log('🔚 Seat 페이지 언마운트:', {
        prevAdress,
        hasVisitedPayment,
        timestamp: new Date().toISOString(),
      });
    };
  }, []); // 최초 마운트시에만 실행하도록 변경

  useEffect(() => {
    setIsActive(!!selectedSeatNumber);
  }, [selectedSeatNumber]);

  const handleReservationClick = async () => {
    if (!selectedSeatNumber || !userId) return;

    if (!onSuccess) {
      setisSecurityMessageOpen(true);
      return;
    }

    try {
      await tryReserveSeat(areaId, selectedSeatNumber);
      document.cookie = 'ticketing-progress=3; path=/';
      router.push('payment1');
    } catch (_error) {
      // 에러는 store에서 처리됨
    }
  };

  return (
    <div>
      <TicketingSeatList areaId={areaId} />
      <TicketingBottomBar onClick={handleReservationClick} isActive={isActive}>
        {selectedSeatNumber
          ? `${areaId}구역 ${selectedSeatNumber}번 좌석 예매하기`
          : '선택된 좌석 없음'}
      </TicketingBottomBar>

      {error && (
        <ErrorPopup isOpen={!!error} onClick={clearError}>
          {error.message}
        </ErrorPopup>
      )}
      <SecurityMessagePopup
        isOpen={isSecurityMessageOpen}
        onPostpone={() => setisSecurityMessageOpen(false)}
        onSuccess={() => {
          setisSecurityMessageOpen(false);
          setSecurityPopupState(true);
        }}
      />
    </div>
  );
}
