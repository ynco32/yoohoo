import { useEffect, useRef } from 'react';
import Image from 'next/image';

declare global {
  interface Window {
    kakao: any;
  }
}

interface SharingLocationMapProps {
  venueLocation: {
    latitude: number;
    longitude: number;
  };
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const SharingLocationMap = ({
  venueLocation,
  onLocationSelect,
  initialLocation,
}: SharingLocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // 지도 인스턴스 저장
  const listenerKeyRef = useRef<any>(null);

  // 지도 초기화
  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;

      const centerPosition = new window.kakao.maps.LatLng(
        initialLocation?.latitude || venueLocation.latitude,
        initialLocation?.longitude || venueLocation.longitude
      );

      const options = {
        center: centerPosition,
        level: 2,
        minLevel: 1,
        maxLevel: 5,
      };

      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(
          mapContainerRef.current,
          options
        );

        // 드래그 이벤트 핸들러
        const dragEndHandler = () => {
          const newCenter = mapRef.current.getCenter();
          const newLocation = {
            latitude: newCenter.getLat(),
            longitude: newCenter.getLng(),
          };
          onLocationSelect(newLocation);
        };

        // 이벤트 리스너 등록 (최초 한 번만)
        listenerKeyRef.current = window.kakao.maps.event.addListener(
          mapRef.current,
          'dragend',
          dragEndHandler
        );
      } else {
        mapRef.current.setCenter(centerPosition);
      }
    };

    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(initializeMap);
      };
      document.head.appendChild(script);
    }

    // cleanup
    return () => {
      if (listenerKeyRef.current) {
        window.kakao?.maps?.event.removeListener(listenerKeyRef.current);
      }
    };
  }, [
    initialLocation,
    onLocationSelect,
    venueLocation.latitude,
    venueLocation.longitude,
  ]);

  // 중심 위치 업데이트를 위한 useEffect
  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const centerPosition = new window.kakao.maps.LatLng(
      initialLocation?.latitude || venueLocation.latitude,
      initialLocation?.longitude || venueLocation.longitude
    );

    mapRef.current.setCenter(centerPosition);
  }, [initialLocation, venueLocation.latitude, venueLocation.longitude]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
        style={{
          width: '48px',
          height: '48px',
          zIndex: 1,
        }}
      >
        <Image
          src="/images/conkiri.png"
          alt="location marker"
          width={48}
          height={48}
          priority
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};
