import { useEffect, useRef } from 'react';

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
  const markerRef = useRef<any>(null); // 마커 인스턴스 저장

  useEffect(() => {
    const loadKakaoMap = () => {
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
    };

    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;

      // 초기 중심 위치 설정
      const centerPosition = new window.kakao.maps.LatLng(
        initialLocation?.latitude || venueLocation.latitude,
        initialLocation?.longitude || venueLocation.longitude
      );

      const options = {
        center: centerPosition,
        level: 2,
      };

      // 지도 초기화(최초에만 실행행)
      if (!mapRef.current) {
        mapRef.current = new window.kakao.maps.Map(
          mapContainerRef.current,
          options
        );
      } else {
        // 기존 지도 인스턴스가 있으면 중심 위치만 업데이트트
        mapRef.current.setCenter(centerPosition);
      }

      if (!markerRef.current) {
        markerRef.current = new window.kakao.maps.Marker({
          position: centerPosition,
          map: mapRef.current,
        });
      } else {
        // 마커가 존재하면 위치 업데이트 및 지도에 다시 추가가
        markerRef.current.setMap(mapRef.current);
        markerRef.current.setPosition(centerPosition);
      }

      // 지도 이동 이벤트 리스너너
      window.kakao.maps.event.addListener(mapRef.current, 'dragend', () => {
        if (!markerRef.current) return;

        const newCenter = mapRef.current.getCenter();
        markerRef.current.setPosition(newCenter);

        // 새로운 위치 정보 전달
        const newLocation = {
          latitude: newCenter.getLat(),
          longitude: newCenter.getLng(),
        };
        onLocationSelect(newLocation);
      });
    };

    loadKakaoMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [initialLocation]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
