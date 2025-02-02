import { SharingMap } from './SharingMap';
import { SharingPost } from '@/types/sharing';

interface SharingDetailMapProps {
  latitude: number;
  longitude: number;
}

export const SharingDetailMap = ({
  latitude,
  longitude,
}: SharingDetailMapProps) => {
  return (
    <div className="h-[200px] p-4">
      <SharingMap
        posts={[]} // 마커 표시 없는 상태
        concertId={0} // replace 0 with the appropriate concertId value
        venueLocation={{
          latitude,
          longitude,
        }}
      />
    </div>
  );
};
