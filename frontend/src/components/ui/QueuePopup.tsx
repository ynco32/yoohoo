import { XMarkIcon } from '@heroicons/react/24/outline';

interface QueuePopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  queueNumber: string | number;
  behindMe: number | string;
  expectedTime: string | number; //4시간 58분 29초
}

export default function QueuePopup({
  title,
  onClose,
  queueNumber,
  behindMe,
  expectedTime,
  isOpen,
}: QueuePopupProps) {
  if (!isOpen) return null; // isOpen 이 거짓이면 아무것도 리턴 안 함.
  return (
    //검은 배경
    <div className="fixed inset-0 bottom-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      {/* 팝업 부분 시작 */}
      <div className="relative w-80 rounded-lg bg-white p-6 text-center">
        <div className="flex justify-center">
          <p className="px-4 py-4 text-center text-body-bold">{title}</p>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
            aria-label="팝업 닫기"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="pb-5">
          <p>좌석 선택 진입 중</p>
          <p className="text-xl font-semibold text-[#00C73C]">
            내 대기 순서 {queueNumber}번째
          </p>
          <p>
            뒤에 {behindMe}명 / {expectedTime} 소요 예상
          </p>
        </div>
        <div className="text-left text-caption2">
          <p className="text-gray-500">
            현재 접속량이 많아 대기 중입니다. 잠시만 기다려 주시면 다음 단계로
            안전하게 자동 접속합니다.{' '}
          </p>
          <p>새로 고침 하시면 순번이 뒤로 밀리니 주의해주세요.</p>
        </div>
      </div>
    </div>
  );
}
