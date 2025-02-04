import { ViewMode } from '@/types/sharing';

/**
 * 토글 버튼 Props 타입
 * @property viewMode - 현재 선택된 뷰 모드 ('list' | 'map')
 * @property onModeChange - 뷰 모드 변경 시 호출되는 콜백 함수
 */
interface ViewModeToggleProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

/**
 * 지도/목록 뷰 토글 버튼 컴포넌트
 * @description 나눔 게시글을 지도 또는 목록으로 볼 수 있게 해주는 토글 버튼
 */
export const ViewModeToggle = ({
  viewMode,
  onModeChange,
}: ViewModeToggleProps) => {
  return (
    <div className="flex gap-2">
      {/* 지도 보기 버튼 */}
      <button
        className={`rounded-full px-4 py-2 ${
          viewMode === 'map' ? 'bg-primary-main text-white' : 'bg-gray-100'
        }`}
        onClick={() => onModeChange('map')}
      >
        지도
      </button>
      {/* 목록 보기 버튼 */}
      <button
        className={`rounded-full px-4 py-2 ${
          viewMode === 'list' ? 'bg-primary-main text-white' : 'bg-gray-100'
        }`}
        onClick={() => onModeChange('list')}
      >
        목록
      </button>
    </div>
  );
};
