'use client';

import PerformanceInfo from '../../ui/PerformanceInfo';
import TicketingDetails from '../../ui/TicketingDetails';
import SeatType from '../../ui/SeatType';
// import TicketingButton from '../features/ticketing/TicketingButton';
// import { useRouter } from 'next/navigation';
import FixedButton from '../../ui/FixedButton';
import { useState } from 'react';
import SchedulePopup from '../../ui/SchedulePopup';
import ConcertScheduleButton from '../../ui/ConcertScheduleButton';
import QueuePopup from '../../ui/QueuePopup';
import { useEffect } from 'react';

const TicketingInfo = () => {
  const [isSchedulePopupOpen, setisSchedulePopupOpen] = useState(false);
  const [isQueuePopupOpen, setisQueuePopupOpen] = useState(false);

  ////// 더미 데이터 :
  const ranNum: number = 2343;
  const ranNum2: number = 1122;
  const ranTime: string = '1시간 23분 33초';
  //////

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
      <div className="px-4 py-6">
        <PerformanceInfo title="공연기간" info="20XX.03.21 - 20XX.03.23" />
        <PerformanceInfo title="공연장" info="KSPO DOME " />
        <PerformanceInfo title="관람시간" info="-" />
        <PerformanceInfo title="할인혜택" info="무이자" />
      </div>
      <div className="flex gap-6 px-4 py-2">
        <span className="text-[#00C73C]">상세 정보</span>
        <span className="text-gray-500">공연장정보</span>
        <span className="text-gray-500">예매안내</span>
      </div>
      <TicketingDetails
        title="공연시간"
        info={`2025년 3월 15일(토) ~ 3월 16일(일)
        \n 토 오후 6시/ 일 오후 5시`}
      />
      <TicketingDetails title="가격정보" info="기본가" />
      <div className="flex justify-center gap-9 bg-white px-4 py-4">
        <SeatType seat_color="VIP" seat_name="VIP석" />
        <span>198,000원</span>
        <SeatType seat_color="normal" seat_name="일반석" />
        <span>154,000원</span>
      </div>
      {/* <TicketingButton onReservationStart={reservationStart} />
       */}
      <FixedButton
        onClick={() => setisSchedulePopupOpen(true)}
        disabled={false}
      >
        예매하기
      </FixedButton>
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
};

export default TicketingInfo;
