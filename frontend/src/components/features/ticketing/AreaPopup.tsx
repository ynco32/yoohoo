import Popup from '@/components/ui/Popup';
import PopupButton from '@/components/ui/PopupButton';

export default function AreaPopup() {
  //// 더미 데이터
  const Area: string = '2층 E 구역';
  /////
  return (
    <Popup className="text-center">
      <div className="text-center text-xl font-bold">선택 구역</div>
      <div className="bg-gray-50">{Area}</div>
      <div>
        상세 구역 잔여좌석 현황이 제공되지 않는 상품입니다. - css 수정 예정
      </div>
      <div className="flex">
        <PopupButton>닫기</PopupButton>
        <PopupButton>이동</PopupButton>
      </div>
    </Popup>
  );
}
