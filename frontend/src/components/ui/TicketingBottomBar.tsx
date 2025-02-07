import TicketingBottomGreenButton from './TicketingBottomGreenButton';
import TicketingRefreshButton from './TicketingRefreshButton';

interface TicketingBottomBarProps {
  selectedSeat: number;
  isActiive: boolean;
}

export default function ({ selectedSeat, isActiive }: TicketingBottomBarProps) {
  const refresh = () => {
    // 리프레시 코드
  };

  return (
    <div className="inset-b-0 gap2 w-max-[100px] fixed flex w-full">
      <TicketingRefreshButton onClick={refresh} />
      <TicketingBottomGreenButton type={isActiive ? 'active' : 'nonActive'}>
        다음 {selectedSeat}석
      </TicketingBottomGreenButton>
    </div>
  );
}
