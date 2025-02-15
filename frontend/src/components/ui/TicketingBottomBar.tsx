'use client';
import TicketingBottomGreenButton from './TicketingBottomGreenButton';
// import TicketingRefreshButton from './TicketingRefreshButton';
import ArrowPathButton from './ArrowPathButton';

interface TicketingBottomBarProps {
  selectedSeat?: number | string;
  isActive: boolean;
  children?: string;
  onClick?: () => void;
}
export default function TicketingBottomBar({
  selectedSeat,
  isActive,
  children,
  onClick,
}: TicketingBottomBarProps) {
  const refresh = () => {
    window.location.reload();
  };

  return (
    // [Tailwind] 포지셔닝 및 너비 조정
    // - bottom-0: 하단에 고정
    // - max-w-[430px]: 부모 컨테이너 너비에 맞춤
    // - px-4: 좌우 패딩
    // - pb-4: 하단 패딩
    <div className="fixed bottom-0 w-full max-w-[430px] bg-white px-4 pb-4">
      <div className="flex gap-2">
        <ArrowPathButton onClick={refresh} />
        <TicketingBottomGreenButton
          onClick={onClick}
          type={isActive ? 'active' : 'nonActive'}
        >
          {selectedSeat}
          {children}
        </TicketingBottomGreenButton>
      </div>
    </div>
  );
}
