'use client';

import React, { useEffect, useRef, useState } from 'react';
import TagButton from '@/components/common/TagButton/TagButton';
import styles from './PlaceMap.module.scss';
import useKakaoMap from '@/hooks/useKakaoMap';
import IconButton from '@/components/common/IconButton/IconButton';

interface PlaceMapProps {
  latitude: number;
  longitude: number;
}

const categoryItems = [
  '화장실',
  '물품 보관소',
  '편의시설',
  '공연 관련 시설',
] as const;
type CategoryType = (typeof categoryItems)[number];

const dummyMarkers: Record<
  CategoryType,
  { name: string; lat: number; lng: number }[]
> = {
  화장실: [
    { name: '남자 화장실', lat: 37.5196, lng: 127.1263 },
    { name: '여자 화장실', lat: 37.5192, lng: 127.1258 },
  ],
  '물품 보관소': [{ name: 'A 게이트 보관소', lat: 37.5195, lng: 127.126 }],
  편의시설: [{ name: '편의점', lat: 37.5197, lng: 127.1264 }],
  '공연 관련 시설': [{ name: '무대 입구', lat: 37.5193, lng: 127.1259 }],
};

export default function PlaceMap({ latitude, longitude }: PlaceMapProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('화장실');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null); // ✅ 현재 오버레이 저장
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const { map } = useKakaoMap(mapRef, {
    center: { lat: latitude, lng: longitude },
    level: 3,
    maxLevel: 5,
    minLevel: 1,
  });

  // 내 위치 이동 함수
  const moveToMyLocation = () => {
    if (!map || !navigator.geolocation) {
      alert('위치 서비스를 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = new window.kakao.maps.LatLng(latitude, longitude);

        // 기존 마커 제거
        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
        }

        // 마커 표시
        const marker = new window.kakao.maps.Marker({
          map,
          position: latlng,
        });
        userMarkerRef.current = marker;

        // 지도 중심 이동
        map.setCenter(latlng);
      },
      (err) => {
        alert('위치 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };

  // 지도 클릭 시 오버레이 닫기 (한 번만 등록)
  useEffect(() => {
    if (!map) return;

    const handleClickMap = () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };

    window.kakao.maps.event.addListener(map, 'click', handleClickMap);
  }, [map]);

  // 마커 + 오버레이 렌더링
  useEffect(() => {
    if (!map) return;

    // 기존 오버레이 닫기
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

    const markerList: kakao.maps.Marker[] = [];

    dummyMarkers[activeCategory].forEach(({ name, lat, lng }) => {
      const position = new window.kakao.maps.LatLng(lat, lng);

      const marker = new window.kakao.maps.Marker({
        map,
        position,
        title: name,
      });

      const overlayContent = document.createElement('div');
      overlayContent.className = styles.overlay;
      overlayContent.innerHTML = `<div class="${styles.overlayBox}">${name}</div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: overlayContent,
        yAnchor: 1,
        zIndex: 3,
      });

      // 마커 클릭 시 오버레이 표시
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (overlayRef.current) {
          overlayRef.current.setMap(null);
        }
        overlay.setMap(map);
        overlayRef.current = overlay;
      });

      markerList.push(marker);
    });

    return () => {
      markerList.forEach((m) => m.setMap(null));
    };
  }, [map, activeCategory]);

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.categoryBar}>
        {categoryItems.map((name) => (
          <TagButton
            key={name}
            onClick={() => setActiveCategory(name)}
            type={activeCategory === name ? 'active' : 'default'}
          >
            {name}
          </TagButton>
        ))}
      </div>

      <IconButton
        icon='gps'
        onClick={moveToMyLocation}
        className={styles.myLocationBtn}
        iconSize={24}
      />

      <div ref={mapRef} className={styles.kakaoMap} />
    </div>
  );
}
