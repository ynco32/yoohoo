import { TextButton } from '@/components/ui/TextButton';
import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="bg-success-gradient relative w-full max-w-[430px]">
        <div className="flex h-screen flex-col justify-between p-6">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex justify-center pt-20">
              <Image
                src={SVGIcons.SuccessLogo}
                alt="Success"
                width={160}
                height={160}
                className="mb-4"
              />
            </div>
            <span className="text-xl font-semibold">{message}</span>
          </div>
          <TextButton variant="primary" onClick={onClose} className="w-full">
            돌아가기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
