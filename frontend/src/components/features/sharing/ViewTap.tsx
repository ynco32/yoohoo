import { ViewTabItem } from '@/types/sharing';
import { BookmarkIcon, UserIcon } from '@heroicons/react/24/outline';

interface ViewTabProps {
  currentTab: ViewTabItem | null;
  onTabChange: (tab: ViewTabItem | null) => void;
}

export const ViewTab = ({ currentTab, onTabChange }: ViewTabProps) => {
  return (
    <div className="flex w-full">
      <button
        className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition-colors ${
          currentTab === 'scrap'
            ? 'bg-primary-main text-white'
            : 'text-gray-600'
        }`}
        onClick={() => onTabChange(currentTab === 'scrap' ? null : 'scrap')}
      >
        <BookmarkIcon className="h-4 w-4" />
        <span>북마크 보기</span>
      </button>
      <button
        className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition-colors ${
          currentTab === 'my' ? 'bg-primary-main text-white' : 'text-gray-600'
        }`}
        onClick={() => onTabChange(currentTab === 'my' ? null : 'my')}
      >
        <UserIcon className="h-4 w-4" />
        <span>내 나눔글 보기</span>
      </button>
    </div>
  );
};
