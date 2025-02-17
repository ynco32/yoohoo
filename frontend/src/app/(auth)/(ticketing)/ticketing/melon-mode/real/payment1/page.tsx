'use client';

import { StepIndicator } from '@/components/features/ticketing/StepIndicator';
import { TicketInfo } from '@/components/features/ticketing/TicketInfo';
import { DiscountSection } from '@/components/features/ticketing/DiscountSelection';
import { TicketPrice } from '@/components/features/ticketing/TicketPrice';
import { PriceDetail } from '@/components/features/ticketing/PriceDetail';
import { useState } from 'react';
import { TicketingBillButton } from '@/components/ui/TicketingBillButton';
import Link from 'next/link';
import { useReservationCleanup } from '@/hooks/useReservationCleanup';

export default function TicketingPage() {
  const [quantity, setQuantity] = useState(1);
  useReservationCleanup();

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
