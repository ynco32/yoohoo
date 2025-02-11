// 카카오맵 API로 지도 불러와서 보여주는 컴포넌트
import { useRef, useEffect } from 'react';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

interface ProcessedCongestion {
  congestion: number;
}

interface CongestionDisplayProps {
  data: {
    location: LocationInfo;
    congestion: ProcessedCongestion;
  }[];
}

export const CongestionMap = ({ data }: CongestionDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapContainerRef.current;
        const position = new window.kakao.maps.LatLng(37.519193, 127.127495);

        const options = {
          center: position, // 현재 글의 위치를 중심으로
          level: 6,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 히트맵 원 생성
        for (let i = 0; i < data.length; i++) {
          const circle = new window.kakao.maps.Circle({
            center: new window.kakao.maps.LatLng(
              data[i].location.latitude,
              data[i].location.longitude
            ), // 원의 중심좌표 입니다
            radius: 175, // 미터 단위의 원의 반지름입니다
            strokeWeight: 1, // 선의 두께입니다
            strokeColor: '#FF0000', // 선의 색깔입니다
            strokeOpacity: data[i].congestion.congestion, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#FF0000', // 채우기 색깔입니다
            fillOpacity: data[i].congestion.congestion * 2, // 채우기 불투명도 입니다
          });

          circle.setMap(map);
        }
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
  }, [data]);

  return (
    <div>
      {' '}
      {/* margin 추가 */}
      <div className="h-[500px] w-full overflow-hidden rounded-xl">
        {' '}
        {/* rounded와 overflow-hidden 추가 */}
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
