'use client';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useEffect, useState } from 'react';
import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import TicketingArea from '@/components/features/ticketing/TicketingArea';

export default function Area() {
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);

  useEffect(() => {
    console.log('새로고침 됨');
    setisSecurityMessageOpen(true);
  }, []);

  return (
    <div>
      <SecurityMessagePopup
        isOpen={isSecurityMessageOpen}
        onPostpone={() => setisSecurityMessageOpen(false)} // 미루기 기능 활성화 추후 상태 저장 추가
        onSuccess={() => setisSecurityMessageOpen(false)}
      />
      <TicketingArea />
      <TicketingBottomBar isActive={false}>다음 </TicketingBottomBar>
    </div>
  );
}
