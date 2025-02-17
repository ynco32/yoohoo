// pages/ticketing/1.tsx
'use client';

import { useState } from 'react';
import Page1 from '@/components/features/ticketing/pages/1';
import { ScheduleSelection } from '@/components/features/ticketing/ScheduleSelection';
import QueuePopup from '@/components/ui/QueuePopup';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
// import { useTicketingTimer } from '@/hooks/useTicketingTimer';
import { useTicketingTimer } from '@/hooks/useTicketingTimer';
import { useQueueStore } from '@/store/useQueueStore';
import { ErrorPopup } from '@/components/features/ticketing/ErrorPopup';
import { useErrorStore } from '@/store/useErrorStore';

export default function Ticketing1() {
  const [isSchedulePopupOpen, setSchedulePopupOpen] = useState(false);
  const [isQueuePopupOpen, setQueuePopupOpen] = useState(false);
  const { queueNumber, waitingTime, peopleBehind } = useQueueStore();

  const { enterQueue } = useWebSocketQueue();
  const { buttonDisabled, buttonMessage } = useTicketingTimer();
  const { error, clearError } = useErrorStore();

  const handleScheduleSelect = () => {
    setSchedulePopupOpen(false);
    setQueuePopupOpen(true);
    enterQueue();
  };

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
        isOpen={isQueuePopupOpen}
      />

      {error && (
        <ErrorPopup isOpen={!!error} onClick={clearError}>
          {error.message}
        </ErrorPopup>
      )}
    </div>
  );
}
