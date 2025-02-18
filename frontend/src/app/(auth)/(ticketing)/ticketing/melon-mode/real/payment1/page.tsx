'use client';

import { StepIndicator } from '@/components/features/ticketing/StepIndicator';
import { TicketInfo } from '@/components/features/ticketing/TicketInfo';
import { DiscountSection } from '@/components/features/ticketing/DiscountSelection';
import { TicketPrice } from '@/components/features/ticketing/TicketPrice';
import { PriceDetail } from '@/components/features/ticketing/PriceDetail';
import { useState, useEffect } from 'react';
import { TicketingBillButton } from '@/components/ui/TicketingBillButton';
import Link from 'next/link';
// import { useReservationCleanup } from '@/hooks/useReservationCleanup';
import { useRevertSeat } from '@/store/useRevertSeatStore';

export default function TicketingPage() {
  const [quantity, setQuantity] = useState(1);
  // useReservationCleanup();
  const setPrevAdress = useRevertSeat((state) => state.setPrevAdress);
  const prevAdress = useRevertSeat((state) => state.prevAdress); // 구조분해가 아닌 selector 사용

  useEffect(() => {
    if (!prevAdress) {
      // 이미 설정되어 있지 않을 때만 실행
      setPrevAdress('payment');
      console.log('PrevAdress 설정됨.' + prevAdress);
    }
  }, []);
  // 상태 변경 감지를 위한 별도 useEffect
  useEffect(() => {
    console.log('PrevAdress 변경됨: ' + prevAdress);
  }, [prevAdress]);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex-1 pb-16">
        <StepIndicator currentStep={2} />
        <TicketInfo />
        <DiscountSection />
        <TicketPrice quantity={quantity} setQuantity={setQuantity} />
        <PriceDetail quantity={quantity} />
      </div>
      <div className="fixed bottom-0 w-full max-w-[430px]">
        <Link href="payment1/payment2" className="block">
          <TicketingBillButton>다음</TicketingBillButton>
        </Link>
      </div>
    </div>
  );
}
