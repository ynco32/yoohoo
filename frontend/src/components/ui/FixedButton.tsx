interface FixedButtonProps {
  fixedButtonOnClick?: () => void;
  children: React.ReactNode; // 백엔드에서 뭘로 넘겨줄지 모르니 일단 다 들어가게 하기
  isfixedButtonDisabled?: boolean; // 활성화 유무
}

export default function FixedButton({
  fixedButtonOnClick,
  children,
  isfixedButtonDisabled = false, // 기본값 비활성화된 걸로로
}: FixedButtonProps) {
  const ButtonType = isfixedButtonDisabled
    ? 'bg-gray-300 text-white disabled'
    : 'bg-primary-main text-white';

  const fixedBottom =
    'fixed max-w-[430px] bottom-0 w-full rounded-none py-4 text-center ';

  return (
    <button
      type="button"
      onClick={fixedButtonOnClick}
      disabled={isfixedButtonDisabled}
      className={`${fixedBottom} ${ButtonType}`}
    >
      {children}
    </button>
  );
}
