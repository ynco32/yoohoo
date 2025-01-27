import { SharingList } from '@/components/features/sharing/SharingList';

export default function ConcertSharingPage({
  params,
}: {
  params: { concertId: string };
}) {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      <div className="flex-1 overflow-auto">
        <SharingList />
      </div>
    </div>
  );
}
