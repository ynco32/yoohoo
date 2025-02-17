import { WriteButton } from '@/components/common/WriteButton';
import { ViewMode } from '@/types/sharing';
import { MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';

interface BottomControlsProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  concertId: number;
}

export const BottomControls = ({
  viewMode,
  onModeChange,
  concertId,
}: BottomControlsProps) => {
  return (
    <>
      {/* View Toggle */}
      <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center rounded-lg bg-sight-button p-1">
          <button
            onClick={() => onModeChange('map')}
            className={`flex items-center rounded-md px-3 py-1.5 ${
              viewMode === 'map' ? 'bg-white shadow-sm' : 'text-white'
            }`}
          >
            <MapIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onModeChange('list')}
            className={`flex items-center rounded-md px-3 py-1.5 ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'text-white'
            }`}
          >
            <ListBulletIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Write Button */}
      <div className="fixed bottom-1 right-1 z-50 w-full max-w-[430px]">
        <WriteButton path={`/sharing/${concertId}/write`} />
      </div>
    </>
  );
};
