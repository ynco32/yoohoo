'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TicketingSeatList from '@/components/ticketing/TicketingSeatList/TicketingSeatList';
import TicketingBottomButton from '@/components/ticketing/TicketingBottomButton/TicketingBottomButton';
import ErrorPopup from '@/components/ticketing/ErrorPopup/ErrorPopup';
import Captcha from '@/components/ticketing/Captcha/Captcha';

import {
  tryReserveSeat,
  fetchSeatsByArea,
  selectTicketingState,
} from '@/store/slices/ticketingSeatSlice';
import { setCaptchaState } from '@/store/slices/captchaSlice';

// 커스텀 훅 사용
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks';
// RootState 타입 import
import { RootState } from '@/store/types';

import styles from './page.module.scss';

export default function SeatPage() {
  const [isActive, setIsActive] = useState(false);
  const [isSecurityMessageOpen, setIsSecurityMessageOpen] = useState(false);
  const router = useRouter();

  // params 디버깅
  const params = useParams();
  console.log('URL 파라미터:', params);

  // URL 파라미터에서 areaId 가져오기 (params.areaId로 접근)
  const areaId = (params?.areaId as string) || '';
  console.log('사용할 areaId:', areaId);

  const dispatch = useAppDispatch();

  // 선택자 함수 사용 - 기존 코드처럼 다시 돌아가기
  const ticketingState = useAppSelector((state) =>
    selectTicketingState(state as any)
  );
  const selectedSeatNumber = ticketingState?.selectedSeatNumber;
  const error = ticketingState?.error;

  const userId = useAppSelector((state: RootState) => state.user?.data?.userId);
  const onSuccess = useAppSelector(
    (state: RootState) => state.captcha?.onSuccess
  );

  // 컴포넌트 마운트 시 해당 구역의 좌석 정보 로드
  useEffect(() => {
    if (areaId) {
      console.log('좌석 정보 로드 요청:', areaId);
      dispatch(fetchSeatsByArea(areaId));
    } else {
      console.error('areaId가 없어 좌석 정보를 로드할 수 없습니다');
    }
  }, [areaId, dispatch]);

  useEffect(() => {
    setIsActive(!!selectedSeatNumber);
  }, [selectedSeatNumber]);

  const handleReservationClick = async () => {
    if (!selectedSeatNumber || !userId) {
      console.log("선택된 좌석이 없거나 유저 아이디가 없음")
      return;
    }

    if (!onSuccess) {
      setIsSecurityMessageOpen(true);
      return;
    }

    try {
      // 여기서 타입 단언(as any)을 사용하여 TypeScript 오류를 우회합니다
      const resultAction = await dispatch(
        tryReserveSeat({ section: areaId, seat: selectedSeatNumber }) as any
      );

      // 성공 시에만 페이지 이동
      if (tryReserveSeat.fulfilled.match(resultAction)) {
        router.push('payment1');
      }
    } catch (_error) {
      // 에러는 store에서 처리됨
    }
  };

  // areaId가 없는 경우 처리
  if (!areaId) {
    return (
      <div className={styles.container}>
        <div className='error-message'>
          <p>구역 정보가 없습니다. 올바른 URL로 접근해 주세요.</p>
        </div>
      </div>
    );
  }

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
        onPostpone={() => setIsSecurityMessageOpen(false)}
        onSuccess={() => {
          setIsSecurityMessageOpen(false);
          dispatch(setCaptchaState(true));
        }}
      />
    </div>
  );
}
