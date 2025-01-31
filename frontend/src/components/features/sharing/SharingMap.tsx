'use client';

import { useEffect, useRef } from 'react';
import { SharingCard } from './SharingCard';
import { SharingPost } from '@/types/sharing';
import { useRouter } from 'next/navigation';
import { createRoot } from 'react-dom/client';

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
  concertId: number;
}

export const SharingMap = ({
  posts,
  venueLocation,
  concertId,
}: SharingMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentOverlayRef = useRef<any>(null);
  const router = useRouter();

  /**
   * React로 동적 오버레이 생성
   * - 실제 DOM 요소를 생성하여 카카오맵 오버레이에 추가
   * - 클릭 이벤트를 React에서 관리
   */
  const createOverlay = (post: SharingPost, map: any, position: any) => {
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'p-4 z-50 overlay-content';
    overlayContainer.style.pointerEvents = 'auto'; // 클릭 이벤트 허용

    // React로 동적 렌더링 (DOM에 직접 추가)
    createRoot(overlayContainer).render(
      <div
        className="w-[320px] cursor-pointer"
        onClick={(e) => {
          e.preventDefault(); // 새로고침 방지
          e.stopPropagation(); // 지도 클릭 이벤트 차단
          setTimeout(() => {
            router.push(`/sharing/${concertId}/${post.id}`);
          }, 0); // 카카오맵의 click 이벤트 처리가 끝난 후 router.push() 실행
        }}
      >
        <SharingCard
          {...post}
          concertId={concertId}
          wrapperClassName="bg-white shadow-lg border-0 rounded-lg cursor-pointer"
        />
      </div>
    );

    return new window.kakao.maps.CustomOverlay({
      content: overlayContainer,
      position: position,
      xAnchor: 5.5,
      yAnchor: 5.5,
      map: map,
    });
  };

  /**
   * 마커 클릭 시 오버레이 표시
   * - 클릭한 마커 위치에 `createOverlay()`를 생성하여 추가
   * - 기존 오버레이가 존재하면 먼저 제거
   */
  const handleMarkerClick = (map: any, marker: any, post: SharingPost) => {
    return () => {
      // 기존 오버레이 제거
      if (currentOverlayRef.current) {
        currentOverlayRef.current.setMap(null);
      }
      // 지도 이동
      map.panTo(marker.getPosition());

      // 오버레이 생성 후 지도에 추가
      const overlay = createOverlay(post, map, marker.getPosition());
      currentOverlayRef.current = overlay;
      overlay.setMap(map);
    };
  };

  useEffect(() => {
    /**
     * 카카오맵 초기화
     * - 맵 객체 생성 후 마커 & 이벤트 등록
     */
    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;

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
        const marker = new window.kakao.maps.Marker({ position, map });

        // 마커 클릭 시 오버레이 표시
        window.kakao.maps.event.addListener(
          marker,
          'click',
          handleMarkerClick(map, marker, post)
        );
      });

      /**
       * 지도 클릭 시 오버레이 닫기
       * - `setTimeout`을 활용하여 `click` 이벤트 후 실행되도록 조정
       * - `currentOverlayRef.current.getContent()`를 사용해 실제 오버레이 DOM을 가져와 비교
       */
      window.kakao.maps.event.addListener(map, 'click', (e: any) => {
        if (currentOverlayRef.current) {
          setTimeout(() => {
            const overlayElement = currentOverlayRef.current.getContent();
            if (!overlayElement.contains(e.target)) {
              currentOverlayRef.current.setMap(null);
              currentOverlayRef.current = null;
            }
          }, 10);
        }
      });
    };

    // 카카오맵 스크립트
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
