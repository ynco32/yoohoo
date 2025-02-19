// app/(auth)/(ticketing)/ticketing/melon-mode/real/payment1/page.tsx
'use client';

import { StepIndicator } from '@/components/features/ticketing/StepIndicator';
import { TicketInfo } from '@/components/features/ticketing/TicketInfo';
import { DiscountSection } from '@/components/features/ticketing/DiscountSelection';
import { TicketPrice } from '@/components/features/ticketing/TicketPrice';
import { PriceDetail } from '@/components/features/ticketing/PriceDetail';
import { useState, useEffect } from 'react';
import { TicketingBillButton } from '@/components/ui/TicketingBillButton';
import { useRouter } from 'next/navigation';
import { useRevertSeat } from '@/store/useRevertSeatStore';

export default function TicketingPage() {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const setPrevAdress = useRevertSeat((state) => state.setPrevAdress);
  const setHasVisitedPayment = useRevertSeat(
    (state) => state.setHasVisitedPayment
  );
  const prevAdress = useRevertSeat((state) => state.prevAdress);
  const hasVisitedPayment = useRevertSeat((state) => state.hasVisitedPayment);
  const resetState = useRevertSeat((state) => state.resetState);

  useEffect(() => {
    // document.referrer가 비어있으면 직접 URL 입력으로 접근한 것
    if (!document.referrer) {
      router.replace('./'); // 메인으로 돌려보내기
    }
  }, [router]);

  // 초기 마운트 시 상태 초기화
  useEffect(() => {
    console.log('📝 Payment 페이지 마운트 - 상태 초기화 전:', {
      prevAdress,
      hasVisitedPayment,
      timestamp: new Date().toISOString(),
    });

    resetState();

    console.log('🔄 상태 초기화 완료', {
      timestamp: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    console.log('💫 Payment useEffect 실행:', {
      isSubscribed,
      prevAdress,
      hasVisitedPayment,
      timestamp: new Date().toISOString(),
    });

    const initializeState = async () => {
      if (!hasVisitedPayment && isSubscribed) {
        console.log('🔄 상태 업데이트 시작 전:', {
          prevAdress,
          hasVisitedPayment,
          timestamp: new Date().toISOString(),
        });

        await setPrevAdress('payment');
        await setHasVisitedPayment(true);

        console.log('✅ 상태 업데이트 완료:', {
          newPrevAddress: 'payment',
          newHasVisitedPayment: true,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('⏩ 이미 payment 상태임:', {
          prevAdress,
          hasVisitedPayment,
          timestamp: new Date().toISOString(),
        });
      }
    };

    initializeState();

    return () => {
      isSubscribed = false;

      console.log('🔚 Payment cleanup 시작:', {
        prevAdress,
        hasVisitedPayment,
        timestamp: new Date().toISOString(),
      });
    };
  }, [hasVisitedPayment, setPrevAdress, setHasVisitedPayment, prevAdress]);

  const handleNextClick = () => {
    console.log('🖱️ 다음 버튼 클릭 전 상태:', {
      prevAdress,
      hasVisitedPayment,
      timestamp: new Date().toISOString(),
    });

    setPrevAdress('payment-left');

    setTimeout(() => {
      console.log('이동 직전 최종 상태:', {
        prevAdress,
        hasVisitedPayment,
        timestamp: new Date().toISOString(),
      });
      router.push('payment1/payment2');
    }, 100);
  };

  console.log('🎨 Payment 렌더링 시점 상태:', {
    prevAdress,
    hasVisitedPayment,
    timestamp: new Date().toISOString(),
  });

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
        <button onClick={handleNextClick} className="block w-full">
          <TicketingBillButton>다음</TicketingBillButton>
        </button>
      </div>
    </div>
  );
}
