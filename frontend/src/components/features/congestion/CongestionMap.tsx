import { useRef, useEffect } from 'react';

interface LocationInfo {
  latitude: number;
  longitude: number;
}

interface ProcessedCongestion {
  congestion: number;
  congestionLevel: number;
}

interface Position {
  latitude: number;
  longitude: number;
}

interface CongestionDisplayProps {
  position: Position;
  data: {
    location: LocationInfo;
    congestion: ProcessedCongestion;
  }[];
}

export const CongestionMap = ({ position, data }: CongestionDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapContainerRef.current;
        const centerPosition = new window.kakao.maps.LatLng(
          position.latitude,
          position.longitude
        );

        const options = {
          center: centerPosition, // 현재 글의 위치를 중심으로
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 히트맵 원 생성
        for (let i = 0; i < data.length; i++) {
          const baseOpacity = 0.2;
          const steps = 10; // 그라데이션 단계 수
          const radiusStep = 15; // 각 단계마다 반지름 증가량

          for (let j = 0; j < steps; j++) {
            let fillColor = '#E85353';
            if (data[i].congestion.congestionLevel === 1) {
              fillColor = '#9CFF78';
            } else if (data[i].congestion.congestionLevel === 2) {
              fillColor = '#FFFb79';
            } else if (data[i].congestion.congestionLevel === 3) {
              fillColor = '#FFB575';
            }

            const circle = new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(
                data[i].location.latitude,
                data[i].location.longitude
              ), // 원의 중심좌표 입니다
              radius: 150 + j * radiusStep, // 미터 단위의 원의 반지름입니다
              strokeWeight: 0, // 선의 두께입니다
              fillColor: fillColor, // 채우기 색깔입니다
              fillOpacity: baseOpacity * (1 - j / steps), // 채우기 불투명도 입니다
            });

            circle.setMap(map);
          }
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
  }, [data, position.latitude, position.longitude]);

  return (
    <div>
      <div className="h-[90vh] w-full overflow-hidden rounded-xl">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
};
