'use client';

import { useEffect, useRef } from 'react';
import { SharingPost } from '@/types/sharing';
import { VENUE_COORDINATES } from '@/lib/constans/venues';

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

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = mapContainerRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(
            venueLocation.latitude,
            venueLocation.longitude
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // posts 배열의 각 아이템에 대해 마커 생성
        posts.forEach((post) => {
          if (post.latitude && post.longitude) {
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                post.latitude,
                post.longitude
              ),
              map: map,
            });
          }
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
  }, [posts]); // posts를 의존성 배열에 추가

  return (
    <div className="h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
