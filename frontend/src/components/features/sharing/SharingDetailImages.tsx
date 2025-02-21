import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SharingDetailImagesProps {
  image: string;
}

export const SharingDetailImages = ({ image }: SharingDetailImagesProps) => {
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

  return (
    <>
      <div
        className="relative h-[270px] w-full cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={image}
          alt="나눔 이미지"
          sizes="(max-width: 430px) 100vw, 430px"
          fill
          className="object-cover"
        />
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
                alt="나눔 이미지"
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

export default SharingDetailImages;
