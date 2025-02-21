// pages/ticketing/1.tsx
'use client';

import { useState, useEffect } from 'react';
import Page1 from '@/components/features/ticketing/pages/1';
import { ScheduleSelection } from '@/components/features/ticketing/ScheduleSelection';
import QueuePopup from '@/components/ui/QueuePopup';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
import { useTicketingTimer } from '@/hooks/useTicketingTimer';
import { useQueueStore } from '@/store/useQueueStore';
import { ErrorPopup } from '@/components/features/ticketing/ErrorPopup';
import { useErrorStore } from '@/store/useErrorStore';

export default function Ticketing1() {
  const [isSchedulePopupOpen, setSchedulePopupOpen] = useState(false);
  const [isQueuePopupOpen, setQueuePopupOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { queueNumber, waitingTime, peopleBehind } = useQueueStore();

  const { enterQueue } = useWebSocketQueue();
  const { buttonDisabled, buttonMessage } = useTicketingTimer();
  const { error, clearError } = useErrorStore();

  const handleScheduleSelect = () => {
    setSchedulePopupOpen(false);
    setQueuePopupOpen(true);

    // 티켓팅 진행 상태 저장
    // document.cookie = 'ticketing-progress=1; path=/';
    // console.log('쿠키 설정:', document.cookie);

    enterQueue();
  };

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  return (
    <div>
      <Page1
        isfixedButtonDisabled={buttonDisabled}
        fixedButtonOnClick={() => setSchedulePopupOpen(true)}
        fixedButtonMessage={buttonMessage}
      />

      <ScheduleSelection
        isOpen={isSchedulePopupOpen}
        onClose={() => setSchedulePopupOpen(false)}
        onScheduleSelect={handleScheduleSelect}
      />

      <QueuePopup
        title="ASIA TOUR LOG in SEOUL"
        queueNumber={queueNumber}
        behindMe={peopleBehind}
        expectedTime={waitingTime}
        onClose={() => setQueuePopupOpen(false)}
        isOpen={isQueuePopupOpen && !hasError} // 에러가 있으면 오픈되지 않음.
      />

      {error && (
        <ErrorPopup isOpen={!!error} onClick={clearError}>
          {error.message}
        </ErrorPopup>
      )}
    </div>
  );
}
