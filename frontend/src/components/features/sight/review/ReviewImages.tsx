import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ReviewImagesProps {
  image: string | null;
}

export const ReviewImages = ({ image }: ReviewImagesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!image) return null;

  return (
    <>
      <div className="scrollbar-hide relative mb-4 w-full overflow-x-auto">
        <div className="flex gap-2 pb-4">
          <div className="w-64 flex-none first:pl-4 last:pr-4">
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Image
                src={image}
                width={0}
                height={0}
                sizes="100vw"
                alt="Review image"
                className="h-48 w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 bg-black/80" />

            {/* 이미지 컨테이너 */}
            <div className="relative h-screen w-screen">
              <Image
                src={image}
                fill
                alt="Review image"
                className="object-contain p-4"
                quality={100}
              />

              {/* 닫기 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ReviewImages;
