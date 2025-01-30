'use client';

import { useEffect, useRef } from 'react';
import { SharingCard } from './SharingCard';
import ReactDOMServer from 'react-dom/server';
import { SharingPost } from '@/types/sharing';

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

interface SharingMapProps {
  posts: SharingPost[];
  venueLocation: {
    latitude: number;
    longitude: number;
  };
}

export const SharingMap = ({ posts, venueLocation }: SharingMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // 현재 열린 오버레이를 추적하기 위한 ref
  const currentOverlayRef = useRef<any>(null);

  // 커스텀 오버레이 생성 함수
  // SharingCard를 오버레이 컨텐츠로 사용
  const createOverlay = (post: SharingPost, map: any, position: any) => {
    const overlayContent = ReactDOMServer.renderToString(
      <div className="w-[320px]">
        <SharingCard
          {...post}
          wrapperClassName="bg-white shadow-lg border-0 rounded-lg"
        />
      </div>
    );

    return new window.kakao.maps.CustomOverlay({
      content: overlayContent,
      position: position,
      xAnchor: 0.5,
      yAnchor: 1.5,
      map: map,
    });
  };

  // 마커 클릭 이벤트 핸들러
  const handleMarkerClick = (map: any, marker: any, post: SharingPost) => {
    return () => {
      // 기존 오버레이 닫기
      if (currentOverlayRef.current) {
        currentOverlayRef.current.setMap(null);
      }

      // 마커 위치로 지도 이동
      map.panTo(marker.getPosition());

      // 새 오버레이 생성 및 표시
      const overlay = createOverlay(post, map, marker.getPosition());
      currentOverlayRef.current = overlay;
    };
  };

  useEffect(() => {
    // 카카오맵 초기화 함수
    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;

      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(
          venueLocation.latitude,
          venueLocation.longitude
        ),
        level: 3,
      });

      // 마커 및 이벤트 생성
      posts.forEach((post) => {
        if (!post.latitude || !post.longitude) return;

        const position = new window.kakao.maps.LatLng(
          post.latitude,
          post.longitude
        );

        const marker = new window.kakao.maps.Marker({
          position,
          map,
        });

        // 마커 클릭 이벤트 등록
        window.kakao.maps.event.addListener(
          marker,
          'click',
          handleMarkerClick(map, marker, post)
        );
      });

      // 지도 클릭 시 오버레이 닫기
      window.kakao.maps.event.addListener(map, 'click', () => {
        if (currentOverlayRef.current) {
          currentOverlayRef.current.setMap(null);
          currentOverlayRef.current = null;
        }
      });
    };

    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => window.kakao.maps.load(initializeMap);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [posts, venueLocation]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
