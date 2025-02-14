'use client';

import PerformanceInfo from '../../ui/PerformanceInfo';
import TicketingDetails from '../../ui/TicketingDetails';
import SeatType from '../../ui/SeatType';
import FixedButton from '../../ui/FixedButton';
interface TicketingInfoProps {
  fixedButtonOnClick: () => void;
  isfixedButtonDisabled: boolean;
  fixedButtonMessage: React.ReactNode;
}

const TicketingInfo = ({
  fixedButtonOnClick,
  isfixedButtonDisabled = false,
  fixedButtonMessage,
}: TicketingInfoProps) => {
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
      <FixedButton
        fixedButtonOnClick={fixedButtonOnClick}
        isfixedButtonDisabled={isfixedButtonDisabled}
      >
        {fixedButtonMessage}
      </FixedButton>
    </div>
  );
};

export default TicketingInfo;
