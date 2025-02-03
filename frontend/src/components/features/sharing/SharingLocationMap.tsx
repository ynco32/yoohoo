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
}

export const SharingLocationMap = ({
  venueLocation,
  onLocationSelect,
}: SharingLocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // map 인스턴스 저장용
  const markerRef = useRef<any>(null); // 마커 인스턴스 저장용

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;

      // 지도 생성
      const options = {
        center: new window.kakao.maps.LatLng(
          venueLocation.latitude,
          venueLocation.longitude
        ),
        level: 3,
      };

      // map 인스턴스 저장
      mapRef.current = new window.kakao.maps.Map(
        mapContainerRef.current,
        options
      );

      // 클릭 이벤트 등록
      window.kakao.maps.event.addListener(
        mapRef.current,
        'click',
        (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;

          // 기존 마커 제거
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // 새 마커 생성 및 저장
          const marker = new window.kakao.maps.Marker({
            position: latlng,
            map: mapRef.current,
          });

          markerRef.current = marker;
          onLocationSelect({
            latitude: latlng.getLat(),
            longitude: latlng.getLng(),
          });
        }
      );
    };

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => window.kakao.maps.load(initializeMap);
    document.head.appendChild(script);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      document.head.removeChild(script);
    };
  }, [venueLocation.latitude, venueLocation.longitude]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
