'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TicketingSeatList from '@/components/features/ticketing/TicketingSeatList';
import TicketingBottomButton from '@/components/ticketing/TicketingBottomButton/TicketingBottomButton';
import ErrorPopup from '@/components/ticketing/ErrorPopup/ErrorPopup';
import Captcha from '@/components/ticketing/Captcha/Captcha';

import { apiClient } from '@/api/api';
import { ApiResponse } from '@/types/api';

import {
  clearError,
  tryReserveSeat,
  selectSelectedSeatNumber,
  selectError,
} from '@/store/slices/ticketingSeatSlice';
import { setCaptchaState } from '@/store/slices/captchaSlice';

// 커스텀 훅 사용
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
// RootState 타입 import
import { RootState } from '@/store/types';

import styles from './page.module.scss';

export default function SeatPage() {
  const [isActive, setIsActive] = useState(false);
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  const router = useRouter();
  const areaId = useParams().areaType as string;

  const dispatch = useAppDispatch();

  // 선택자 함수 사용
  const error = useAppSelector(selectError);
  const selectedSeatNumber = useAppSelector(selectSelectedSeatNumber);
  const userId = useAppSelector((state: RootState) => state.user.data?.id);
  const onSuccess = useAppSelector(
    (state: RootState) => state.captcha.onSuccess
  );

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
      // dispatch 후 fulfilled 상태 확인
      const resultAction = await dispatch(
        tryReserveSeat({ section: areaId, seat: selectedSeatNumber })
      );

      // 성공 시에만 페이지 이동
      if (tryReserveSeat.fulfilled.match(resultAction)) {
        router.push('payment1');
      }
    } catch (_error) {
      // 에러는 store에서 처리됨
    }
  };

  return (
    <div className={styles.container}>
      <TicketingSeatList areaId={areaId} />
      <TicketingBottomButton
        onClick={handleReservationClick}
        isActive={isActive}
      >
        {selectedSeatNumber
          ? `${areaId}구역 ${selectedSeatNumber}번 좌석 예매하기`
          : '선택된 좌석 없음'}
      </TicketingBottomButton>

      {error && <ErrorPopup isOpen={!!error}>{error.message}</ErrorPopup>}
      <Captcha
        isOpen={isSecurityMessageOpen}
        onPostpone={() => setisSecurityMessageOpen(false)}
        onSuccess={() => {
          setisSecurityMessageOpen(false);
          dispatch(setCaptchaState(true));
        }}
      />
    </div>
  );
}
