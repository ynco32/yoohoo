type ViewTabItem = 'all' | 'my' | 'scrap';

interface ViewTabProps {
  currentTab: ViewTabItem;
  onTabChange: (tab: ViewTabItem) => void;
}

export const ViewTab = ({ currentTab, onTabChange }: ViewTabProps) => {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      <button
        className={`rounded-md px-3 py-1 text-sm ${
          currentTab === 'all' ? 'bg-primary text-white' : 'text-gray-600'
        }`}
        onClick={() => onTabChange('all')}
      >
        전체
      </button>
      <button
        className={`rounded-md px-3 py-1 text-sm ${
          currentTab === 'my' ? 'bg-primary text-white' : 'text-gray-600'
        }`}
        onClick={() => onTabChange('my')}
      >
        My
      </button>
      <button
        className={`rounded-md px-3 py-1 text-sm ${
          currentTab === 'scrap' ? 'bg-primary text-white' : 'text-gray-600'
        }`}
        onClick={() => onTabChange('scrap')}
      >
        스크랩
      </button>
    </div>
  );
};
