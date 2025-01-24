import { ConcertList } from '@/components/features/sharing/ConcertList';

export default function SharingPage() {
  return (
    <div className="mt-[56px] flex h-[calc(100vh-56px)] flex-col">
      <div className="px-4 py-4"></div>
      <div className="flex-1 overflow-auto px-4">
        <ConcertList />
        <div className="h-10" />
      </div>
    </div>
  );
}
