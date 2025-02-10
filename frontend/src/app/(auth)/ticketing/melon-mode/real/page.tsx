'use client';
import Page1 from '@/components/features/ticketing/pages/1';
import SchedulePopup from '@/components/ui/SchedulePopup';
import ConcertScheduleButton from '@/components/ui/ConcertScheduleButton';
import QueuePopup from '@/components/ui/QueuePopup';
import { useState, useEffect } from 'react';

export default function Ticketing1() {
  ////// 더미 데이터 :
  const ranNum: number = 2343;
  const ranNum2: number = 1122;
  const ranTime: string = '1시간 23분 33초';
  //////
  const [isSchedulePopupOpen, setisSchedulePopupOpen] = useState(false);
  const [isQueuePopupOpen, setisQueuePopupOpen] = useState(false);

  const handleQueuePopupOpen = () => {
    setisSchedulePopupOpen(false);
    setisQueuePopupOpen(true);
  };

  useEffect(() => {
    if (isSchedulePopupOpen && isQueuePopupOpen) {
      // 두 팝업이 동시에 열리는 것을 방지
      setisSchedulePopupOpen(false);
    }
  }, [isQueuePopupOpen, isSchedulePopupOpen]);
  return (
    <div>
      <Page1 fixedButtonOnClick={() => setisSchedulePopupOpen(true)} />
      <SchedulePopup
        isOpen={isSchedulePopupOpen}
        onClose={() => setisSchedulePopupOpen(false)}
        title="공연 회차를 고르세요."
        width="md"
      >
        <div>
          <ConcertScheduleButton onClick={handleQueuePopupOpen}>
            2024.2.21(토) 20시 00분
          </ConcertScheduleButton>
          <ConcertScheduleButton onClick={handleQueuePopupOpen}>
            2024.2.22(일) 18시 00분
          </ConcertScheduleButton>
        </div>
      </SchedulePopup>
      <QueuePopup
        title="ASIA TOUR LOG in SEOUL"
        queueNumber={ranNum}
        behindMe={ranNum2}
        expectedTime={ranTime}
        onClose={() => setisQueuePopupOpen(false)}
        isOpen={isQueuePopupOpen}
      ></QueuePopup>
    </div>
  );
}
