import { TextButton } from '@/components/ui/TextButton';
import Image from 'next/image';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  secondMessage?: string;
  buttonText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  message,
  secondMessage,
  buttonText = '돌아가기',
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
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

            {secondMessage ? (
              <div>
                <div>{message}</div>
                <div>{secondMessage}</div>
              </div>
            ) : (
              <span className="text-xl font-semibold">{message}</span>
            )}
          </div>
          <TextButton variant="primary" onClick={onClose} className="w-full">
            {buttonText}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
