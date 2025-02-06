import Popup from '@/components/ui/Popup';
import PopupButton from '@/components/ui/PopupButton';

interface AreaPopupProps {
  onClose: () => void;
  onMove: () => void;
  isOpen: boolean;
}
export default function AreaPopup({ onClose, onMove, isOpen }: AreaPopupProps) {
  if (!isOpen) return null;

  //// 더미 데이터
  const Area: string = '2층 E 구역';
  /////
  return (
    <Popup className="text-center">
      <div className="text-center text-xl font-bold">선택 구역</div>
      <div className="m-1 bg-gray-50 p-3">{Area}</div>
      <div className="text-caption1 text-gray-500">
        상세 구역 잔여좌석 현황이 <br /> 제공되지 않는 상품입니다.
      </div>
      <div className="mt-3 flex justify-between justify-evenly gap-3 border-t pt-3">
        <PopupButton onClick={onClose}>닫기</PopupButton>
        <PopupButton onClick={onMove}>이동</PopupButton>
      </div>
    </Popup>
  );
}
