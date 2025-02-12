// pages/ticketing/1.tsx
'use client';

import { useState } from 'react';
import Page1 from '@/components/features/ticketing/pages/1';
import { ScheduleSelection } from '@/components/features/ticketing/ScheduleSelection';
import QueuePopup from '@/components/ui/QueuePopup';
import { useWebSocketQueue } from '@/hooks/useWebSocketQueue';
import { useTicketingTimer } from '@/hooks/useTicketingTimer';

export default function Ticketing1() {
  const [isSchedulePopupOpen, setSchedulePopupOpen] = useState(true);
  const [isQueuePopupOpen, setQueuePopupOpen] = useState(false);

  const { queueNumber, waitingTime, peopleBehind, enterQueue } =
    useWebSocketQueue();
  const { buttonDisabled, buttonMessage } = useTicketingTimer();

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
    </div>
  );
}
