'use client';
import SecurityMessagePopup from '@/components/features/ticketing/SecurityMessagePopup';
import { useEffect, useState } from 'react';
import AreaPopup from '@/components/features/ticketing/AreaPopup';
import TicketingBottomBar from '@/components/ui/TicketingBottomBar';
import { useRouter } from 'next/navigation';

export default function Real2() {
  const router = useRouter();
  const [isSecurityMessageOpen, setisSecurityMessageOpen] = useState(false);
  const [isAreaPopupOpen, setIsAreaPopupOpen] = useState(false);

  useEffect(() => {
    setisSecurityMessageOpen(true);
  }, []);

  const onMoveClick = () => {
    // 라우터로 구역 세부 페이지로 이동하기
    router.push('real/seat');
  };

  return (
    <div>
      {/* 임시로 만든 구역 블록! 누르면 구역 관련 알림 창이 뜸뜸*/}
      <span
        onClick={() => setIsAreaPopupOpen(true)}
        className="inline-block flex h-[100px] w-[100px] items-center justify-center bg-primary-main"
      >
        임시 구역
      </span>

      <SecurityMessagePopup
        isOpen={isSecurityMessageOpen}
        onPostpone={() => {}} // 미루기 기능 없애기
        onSuccess={() => setisSecurityMessageOpen(false)}
      />
      <AreaPopup
        isOpen={isAreaPopupOpen}
        onClose={() => setIsAreaPopupOpen(false)}
        onMove={onMoveClick}
      />
      <TicketingBottomBar isActiive={false} selectedSeat={0} />
    </div>
  );
}
