interface SharingCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharingCompleteModal = ({
  isOpen,
  onClose,
}: SharingCompleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[320px] rounded-xl bg-white p-6 text-center">
        <p className="mb-6 text-lg font-medium">등록이 완료되었습니다</p>
        <button
          className="w-full rounded-lg bg-primary-main py-3 text-white"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};
