'use client';

import { StepIndicator } from '@/components/features/ticketing/StepIndicator';
import { TicketInfo } from '@/components/features/ticketing/TicketInfo';
import { DiscountSection } from '@/components/features/ticketing/DiscountSelection';
import { TicketPrice } from '@/components/features/ticketing/TicketPrice';
import { PriceDetail } from '@/components/features/ticketing/PriceDetail';
import { useState } from 'react';
import { TicketingBillButton } from '@/components/ui/TicketingBillButton';
import Link from 'next/link';

export default function TicketingPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="relative mx-auto h-screen max-w-md bg-gray-50">
      <StepIndicator currentStep={2} />
      <TicketInfo />
      <DiscountSection />
      <TicketPrice quantity={quantity} setQuantity={setQuantity} />
      <PriceDetail quantity={quantity} />
      <div className="fixed bottom-0 w-full max-w-md">
        <Link href="payment1/payment2">
          <TicketingBillButton>다음</TicketingBillButton>
        </Link>
      </div>
    </div>
  );
}
