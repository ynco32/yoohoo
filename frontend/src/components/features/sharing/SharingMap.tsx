'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { MapSharingCard } from './MapSharingCard';
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
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]); // 마커들을 저장할 ref
  const currentOverlayRef = useRef<any>(null);
  const router = useRouter();

  // 카카오맵 초기화 상태 추적
  const [kakaoMapInitialized, setKakaoMapInitialized] = useState(false);

  /**
   * React로 동적 오버레이 생성
   * - 실제 DOM 요소를 생성하여 카카오맵 오버레이에 추가
   * - 클릭 이벤트를 React에서 관리
   */
  const createOverlay = useCallback(
    (post: SharingPost, map: any, position: any) => {
      const overlayContainer = document.createElement('div');
      overlayContainer.className = 'overlay-content';
      overlayContainer.style.pointerEvents = 'auto';
      overlayContainer.style.cssText = `
        position: relative;
        transform: translate(-50%, -170%);
        margin-bottom: 10px;
      `;

      createRoot(overlayContainer).render(
        <MapSharingCard
          {...post}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
              router.push(`/sharing/${concertId}/${post.sharingId}`);
            }, 0);
          }}
        />
      );

      return new window.kakao.maps.CustomOverlay({
        content: overlayContainer,
        position: position,
        xAnchor: 0,
        yAnchor: 0,
        map: map,
        zIndex: 1,
      });
    },
    [router, concertId]
  );

  /**
   * 마커 클릭 시 오버레이 표시
   * - 클릭한 마커 위치에 `createOverlay()`를 생성하여 추가
   * - 기존 오버레이가 존재하면 먼저 제거
   */
  const handleMarkerClick = useCallback(
    (map: any, marker: any, post: SharingPost) => {
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
    },
    [createOverlay]
  );

  // 1. 카카오맵 SDK 로딩 및 맵 초기화를 위한 useEffect
  useEffect(() => {
    console.log('카카오맵 초기화 useEffect 실행');

    // 이미 초기화되었으면 스킵
    if (kakaoMapInitialized) return;

    const initializeMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) {
        console.log('카카오맵 초기화 실패: 맵 또는 컨테이너 없음');
        return;
      }

      // 맵 생성
      mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(
          venueLocation.latitude,
          venueLocation.longitude
        ),
        level: 3,
        maxLevel: 5, // 최대 줌 레벨
        minLevel: 1, // 최소 줌 레벨
      });

      // 지도 클릭 이벤트는 맵 생성 시 한 번만 등록
      window.kakao.maps.event.addListener(mapRef.current, 'click', (e: any) => {
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

      console.log('카카오맵 초기화 완료');
      setKakaoMapInitialized(true);
    };

    // 카카오맵 SDK가 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오맵 SDK 이미 로드됨');
      initializeMap();
    } else {
      console.log('카카오맵 SDK 로딩 시작');
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
      script.onload = () => {
        console.log('카카오맵 SDK 스크립트 로드 완료');
        window.kakao.maps.load(() => {
          console.log('카카오맵 SDK 초기화 완료');
          initializeMap();
        });
      };
      document.head.appendChild(script);
    }

    // 컴포넌트 언마운트 시 맵 참조 정리
    return () => {
      // 맵 초기화 정리는 여기서 하지 않음 (별도 useEffect에서 처리)
    };
  }, [venueLocation]);

  // 2. 마커 생성 및 관리를 위한 useEffect
  useEffect(() => {
    console.log('마커 생성 useEffect 실행', {
      kakaoMapInitialized,
      postsLength: posts.length,
      currentMarkers: markersRef.current.length,
    });

    // 맵이 초기화되고 포스트 데이터가 있을 때만 마커 생성
    if (kakaoMapInitialized && mapRef.current) {
      // 기존 마커들 모두 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // 새로운 마커 생성 (posts가 있을 때만)
      if (posts.length > 0) {
        console.log('마커 생성 시작');

        posts.forEach((post) => {
          if (!post.latitude || !post.longitude) {
            console.log('위치 정보 없는 포스트 스킵:', post.sharingId);
            return;
          }

          const position = new window.kakao.maps.LatLng(
            post.latitude,
            post.longitude
          );
          const marker = new window.kakao.maps.Marker({
            position,
            map: mapRef.current,
          });

          window.kakao.maps.event.addListener(
            marker,
            'click',
            handleMarkerClick(mapRef.current, marker, post)
          );

          markersRef.current.push(marker);
        });

        console.log('마커 생성 완료, 총 마커 수:', markersRef.current.length);
      }
    }
  }, [kakaoMapInitialized, posts, handleMarkerClick]);

  // 3. 컴포넌트 언마운트 시 정리를 위한 useEffect
  useEffect(() => {
    return () => {
      console.log('SharingMap 컴포넌트 언마운트 - 정리 작업 시작');

      // 마커 제거
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];
      }

      // 오버레이 제거
      if (currentOverlayRef.current) {
        currentOverlayRef.current.setMap(null);
        currentOverlayRef.current = null;
      }

      // 맵 참조 초기화
      mapRef.current = null;
      setKakaoMapInitialized(false);

      console.log('SharingMap 컴포넌트 언마운트 - 정리 작업 완료');
    };
  }, []);

  // 4. 재시도 메커니즘을 위한 useEffect (선택적)
  useEffect(() => {
    // 맵은 초기화되었지만 마커가 없고 포스트는 있는 경우
    if (
      kakaoMapInitialized &&
      posts.length > 0 &&
      markersRef.current.length === 0
    ) {
      console.log('마커가 생성되지 않아 3초 후 재시도합니다');

      const retryTimeout = setTimeout(() => {
        console.log('마커 생성 재시도 시작');

        if (!mapRef.current) {
          console.log('재시도 실패: 맵 참조 없음');
          return;
        }

        // 마커 생성 로직
        posts.forEach((post) => {
          if (!post.latitude || !post.longitude) return;

          const position = new window.kakao.maps.LatLng(
            post.latitude,
            post.longitude
          );
          const marker = new window.kakao.maps.Marker({
            position,
            map: mapRef.current,
          });

          window.kakao.maps.event.addListener(
            marker,
            'click',
            handleMarkerClick(mapRef.current, marker, post)
          );

          markersRef.current.push(marker);
        });

        console.log('마커 재시도 완료, 총 마커 수:', markersRef.current.length);
      }, 3000);

      return () => clearTimeout(retryTimeout);
    }
  }, [kakaoMapInitialized, posts, handleMarkerClick]);

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
