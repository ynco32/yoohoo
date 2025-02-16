import { useState, useCallback } from 'react';
import { SharingLocationMap } from './SharingLocationMap';

interface SharingLocationSelectProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  venueLocation: {
    latitude: number;
    longitude: number;
  };
  // 초기 위치
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const SharingLocationSelect = ({
  onLocationSelect,
  venueLocation,
  initialLocation,
}: SharingLocationSelectProps) => {
  const [selectedLocation, setSelectedLocation] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(initialLocation);

  const handleLocationSelect = useCallback(
    (location: { latitude: number; longitude: number }) => {
      setSelectedLocation(location);
    },
    []
  );

  return (
    <div className="relative mx-auto -mt-[56px] h-full max-w-[430px]">
      <div className="h-full">
        <SharingLocationMap
          venueLocation={venueLocation}
          onLocationSelect={handleLocationSelect}
          initialLocation={selectedLocation}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <button
          className={`w-full rounded-lg py-4 text-white transition-colors ${
            selectedLocation
              ? 'hover:bg-primary-dark bg-primary-main'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
          disabled={!selectedLocation}
        >
          이 위치로 설정하기
        </button>
      </div>
    </div>
  );
};
