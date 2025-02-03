import { useRef, useEffect } from 'react';

interface SharingDetailMapProps {
  latitude: number;
  longitude: number;
}

export const SharingDetailMap = ({
  latitude,
  longitude,
}: SharingDetailMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapContainerRef.current;
        const position = new window.kakao.maps.LatLng(latitude, longitude);

        const options = {
          center: position, // 현재 글의 위치를 중심으로
          level: 2,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        new window.kakao.maps.Marker({
          position: position,
          map: map,
        });
      }
    };

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(loadKakaoMap);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude]);

  return (
    <div className="mx-4 pb-5 pt-5">
      {' '}
      {/* margin 추가 */}
      <div className="h-[200px] w-full overflow-hidden rounded-xl">
        {' '}
        {/* rounded와 overflow-hidden 추가 */}
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
