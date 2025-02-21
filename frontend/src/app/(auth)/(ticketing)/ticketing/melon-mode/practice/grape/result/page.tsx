'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useSuccessRate } from '@/hooks/useSuccessRate';

export default function GrapeResultPage() {
  const router = useRouter();
  const { reactionTime } = useTicketintPracticeResultStore();
  const { calculateSuccessRate } = useSuccessRate('grape');

  const handleRetry = () => {
    router.push('./');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={500}
      goodScore={1000}
      badScore={1600}
      successRate={calculateSuccessRate(reactionTime)}
    />
  );
}
