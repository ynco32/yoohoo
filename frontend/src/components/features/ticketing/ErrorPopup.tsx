// 티켓팅 하다가 나는 에러 보여주는는 팝업
import Popup from '@/components/ui/Popup';

interface errorPopupProps {
  isOpen: boolean;
  onClick: () => void;
  children: string | null;
}

export const ErrorPopup = ({ isOpen, onClick, children }: errorPopupProps) => {
  return (
    <Popup className="text-center" isOpen={isOpen}>
      {children}
      <button onClick={onClick} className="mt-2 text-status-warning">
        확인
      </button>
    </Popup>
  );
};
