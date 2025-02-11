import TicketingBottomGreenButton from './TicketingBottomGreenButton';
import TicketingRefreshButton from './TicketingRefreshButton';

interface TicketingBottomBarProps {
  selectedSeat: number;
  isActiive: boolean;
}

export default function TicketingBottomBar({
  selectedSeat,
  isActiive,
}: TicketingBottomBarProps) {
  const refresh = () => {
    // 리프레시 코드
  };

  return (
    // [Tailwind] 포지셔닝 및 너비 조정
    // - bottom-0: 하단에 고정
    // - max-w-[430px]: 부모 컨테이너 너비에 맞춤
    // - px-4: 좌우 패딩
    // - pb-4: 하단 패딩
    <div className="fixed bottom-0 w-full max-w-[430px] bg-white px-4 pb-4">
      <div className="flex gap-2">
        <TicketingRefreshButton onClick={refresh} />
        <TicketingBottomGreenButton type={isActiive ? 'active' : 'nonActive'}>
          다음 {selectedSeat}석
        </TicketingBottomGreenButton>
      </div>
    </div>
  );
}
