import { TextButton } from '@/components/ui/TextButton';
import Image from 'next/image';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText?: string;
  style?: React.CSSProperties;
}

export function SuccessModal({
  isOpen,
  onClose,
  message,
  buttonText = '돌아가기',
  style,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center" style={style}>
      <div className="relative w-full max-w-[430px] bg-success-gradient">
        <div className="flex h-screen flex-col justify-between p-6">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex justify-center pt-20">
              <Image
                src="/images/successLogo.png"
                alt="Success"
                width={160}
                height={160}
                className="mb-4"
              />
            </div>
            <span className="text-xl font-semibold">{message}</span>
          </div>
          <TextButton variant="primary" onClick={onClose} className="w-full">
            {buttonText}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
