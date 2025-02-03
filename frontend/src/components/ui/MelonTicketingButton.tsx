interface MelonTicketingButtonProps {
  children: React.ReactNode; // 백엔드에서 뭘로 넘겨줄지 모르니 일단 다 들어가게 하기
  isActive: boolean; // 활성화 유무무
  ButtonType: 'active' | 'nonActive'; // 활성화된 상태, 안 된 상태
}

export default function MelonTicketingButton() {
  return (
    <div>
      <div></div>
    </div>
  );
}
