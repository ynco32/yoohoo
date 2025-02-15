// 이선좌 팝업
import Popup from '@/components/ui/Popup';

interface SeatTakenPopupProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SeatTakenPopup = ({ isOpen, onClick }: SeatTakenPopupProps) => {
  return (
    <Popup className="text-center" isOpen={isOpen}>
      다른 고객님이 결제 중인 좌석입니다.
      <button onClick={onClick} className="pt-2 text-primary-main">
        확인
      </button>
    </Popup>
  );
};
