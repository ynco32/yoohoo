'use client';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useEffect, useState } from 'react';

export default function Real2() {
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  useEffect(() => {
    setisSecurityMessageOpen(true);
  }, []);
  return (
    <div>
      <SecurityMessagePopup
        isOpen={isSecurityMessageOpen}
        onPostpone={() => {}} // 미루기 기능 없애기
        onSuccess={() => setisSecurityMessageOpen(false)}
      />
    </div>
  );
}
