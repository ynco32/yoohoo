'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
// import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';

export default function GrapeResultPage() {
  const router = useRouter();
  // const { reactionTime } = useTicketintPracticeResultStore();

  const handleRetry = () => {
    router.push('./');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={500}
      goodScore={1000}
      badScore={1600}
    />
  );
}
