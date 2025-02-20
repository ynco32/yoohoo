'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useSuccessRate } from '@/hooks/useSuccessRate';

export default function SecurityMessageResultPage() {
  const router = useRouter();
  const { reactionTime } = useTicketintPracticeResultStore();
  const { calculateSuccessRate } = useSuccessRate('entrance');

  const handleRetry = () => {
    router.push('./');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={3000}
      goodScore={5000}
      badScore={6500}
      successRate={calculateSuccessRate(reactionTime)}
    />
  );
}
