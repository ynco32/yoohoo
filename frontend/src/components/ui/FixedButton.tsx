interface FixedButtonProps {
  onClick?: () => void;
  children: React.ReactNode; // 백엔드에서 뭘로 넘겨줄지 모르니 일단 다 들어가게 하기
  disabled?: boolean; // 활성화 유무
}

export default function FixedButton({
  onClick,
  children,
  disabled = false, // 기본값 비활성화된 걸로로
}: FixedButtonProps) {
  const ButtonType = disabled
    ? 'bg-gray-300 text-white disabled'
    : 'bg-[#00C73C] text-white';

  const fixedBottom =
    'fixed max-w-[430px] bottom-0 w-full rounded-none py-4 text-center ';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${fixedBottom} ${ButtonType}`}
    >
      {children}
    </button>
  );
}
