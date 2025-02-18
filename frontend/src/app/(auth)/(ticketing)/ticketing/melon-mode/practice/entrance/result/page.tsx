'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
// import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';

export default function EntranceResultPage() {
  const router = useRouter();
  // const { reactionTime } = useTicketintPracticeResultStore();

  const handleRetry = () => {
    router.push('entrance');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={50}
      goodScore={100}
      badScore={200}
    />
  );
}
