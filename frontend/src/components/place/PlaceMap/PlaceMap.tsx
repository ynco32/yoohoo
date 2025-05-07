'use client';

import React from 'react';

interface PlaceMapProps {
  arenaId: number;
}

export default function PlaceMap({ arenaId }: PlaceMapProps) {
  // 실제로는 arenaId로 공연장 위치/편의시설 정보 fetch해서 지도에 표시
  return (
    <div>
      <h2>지도 보기</h2>
      <span>여기에 공연장 지도와 편의시설 위치가 표시됩니다.</span>
    </div>
  );
}
