'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';
import { useSuccessRate } from '@/hooks/useSuccessRate';

export default function EntranceResultPage() {
  const router = useRouter();
  const { reactionTime } = useTicketintPracticeResultStore();
  const { calculateSuccessRate } = useSuccessRate('entrance');

  const handleRetry = () => {
    router.push('./');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={50}
      goodScore={100}
      badScore={200}
      successRate={calculateSuccessRate(reactionTime)}
    />
  );
}
