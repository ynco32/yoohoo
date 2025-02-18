'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TicketingPracticeResultModal from '@/components/features/ticketing/TicketingPracticeResultModal';
// import { useTicketintPracticeResultStore } from '@/store/useTicketingPracticeResult';

export default function SecurityMessageResultPage() {
  const router = useRouter();
  // const { reactionTime } = useTicketintPracticeResultStore();

  const handleRetry = () => {
    router.push('./');
  };

  return (
    <TicketingPracticeResultModal
      handleRetry={handleRetry}
      bestScore={300}
      goodScore={600}
      badScore={1000}
    />
  );
}
