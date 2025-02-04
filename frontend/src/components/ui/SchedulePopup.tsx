// src/components/ui/Popup/index.tsx

import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

// [TypeScript] Props 타입 정의
// isOpen: 팝업 열림/닫힘 상태
// onClose: 팝업을 닫는 함수
// title: 팝업 상단에 표시될 제목
// children: 팝업 내부에 들어갈 내용
// width: 팝업의 너비 (sm, md, lg 중 선택)
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const Popup = ({ isOpen, onClose, title, children }: PopupProps) => {
  // 팝업이 닫혀있으면 아무것도 렌더링하지 않음
  // 이는 DOM에서 완전히 제거됨을 의미
  if (!isOpen) return null;

  // 팝업 너비 설정을 위한 Tailwind 클래스 매핑
  // const widthClasses = {
  //   sm: 'max-w-sm', // 최대 너비 384px
  //   md: 'max-w-md', // 최대 너비 448px
  //   lg: 'max-w-lg', // 최대 너비 512px
  //   sm: 'w-full max-w-[320px]',
  //   md: 'w-full max-w-[384px]',
  //   lg: 'w-full max-w-[448px]',
  // };

  const popupContent = (
    // 전체 화면을 덮는 최상위 컨테이너
    <div className="fixed inset-0 z-50">
      {/* 배경 딤처리 + 클릭 시 팝업 닫힘 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* 팝업을 하단에 위치시키는 컨테이너 */}
      <div className="fixed inset-x-0 bottom-0 flex justify-center">
        {/* 모바일 화면 크기로 제한된 실제 팝업 영역 */}
        <div className="w-full max-w-[430px] bg-white">
          {/* 헤더 영역: 제목과 닫기 버튼 */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
              aria-label="팝업 닫기"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* 컨텐츠 영역 */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );

  // body에 직접 렌더링
  return createPortal(popupContent, document.body); // 팝업이 올라오면 헤더도 못 누르도록
};

export default Popup;
