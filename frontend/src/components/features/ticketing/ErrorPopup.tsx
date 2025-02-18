// // 티켓팅 하다가 나는 에러 보여주는는 팝업
import Popup from '@/components/ui/Popup';

// interface errorPopupProps {
//   isOpen: boolean;
//   onClick: () => void;
//   children: string | null;
// }

// export const ErrorPopup = ({ isOpen, onClick, children }: errorPopupProps) => {
//   return (
//     <Popup className="z-100 text-center" isOpen={isOpen}>
//       {children}
//       <button onClick={onClick} className="mt-2 text-status-warning">
//         확인
//       </button>
//     </Popup>
//   );
// };

// [TypeScript] 타입 정의
interface ErrorPopupProps {
  isOpen: boolean;
  onClick: () => void;
  children: string | null;
}

// [React] 에러 팝업 컴포넌트
export const ErrorPopup = ({ isOpen, onClick, children }: ErrorPopupProps) => {
  return (
    <Popup className="z-100 text-center" isOpen={isOpen}>
      {/* [Tailwind] flex 컨테이너로 수직 정렬 */}
      <div className="flex flex-col items-center gap-4">
        {/* 에러 메시지 */}
        <div className="text-base">{children}</div>
        {/* 확인 버튼 */}
        <button
          onClick={onClick}
          className="rounded-md bg-status-warning px-4 py-2 text-white hover:bg-status-warning/90"
        >
          확인
        </button>
      </div>
    </Popup>
  );
};
