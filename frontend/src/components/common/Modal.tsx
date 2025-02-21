// components/common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  type?: 'alert' | 'confirm';
  variant?: 'primary' | 'danger';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  type = 'alert',
  variant = 'primary',
}: ModalProps) => {
  if (!isOpen) return null;

  const buttonColorClasses = {
    primary: 'bg-shigt-button text-white',
    danger: 'bg-shigt-button text-white',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        onClick={type === 'alert' ? onClose : undefined}
      />
      <div className="absolute left-1/2 top-1/2 w-full max-w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 text-center">
        <p className="mb-4 text-lg font-medium">{title}</p>

        <div className={`${type === 'confirm' ? 'flex gap-2' : ''}`}>
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="w-full flex-1 rounded-lg border border-gray-300 py-3"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={type === 'alert' ? onClose : onConfirm}
            className={`w-full flex-1 rounded-lg bg-sight-button py-3 text-white ${buttonColorClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
