'use client';

import { SharingDetailHeader } from './SharingDetailHeader';
import { SharingStatus } from '@/types/sharing';
import { SharingDetailImages } from './SharingDetailImages';
import { SharingDetailContent } from './SharingDetailContent';
import { SharingDetailMap } from './SharingDetailMap';
import { SharingDetailComments } from './SharingDetailComments';

interface SharingDetailProps {
  id: number;
}

export const SharingDetail = ({ id }: SharingDetailProps) => {
  // 더미 데이터
  const detailData = {
    sharingId: id,
    title: '포카 나눔합니다~~~',
    content: '편의점 앞에서 포카 나눔합니다\n1인당 한 장씩 드려요 선착순',
    photoUrl: '/images/card.png',
    status: 'UPCOMING' as SharingStatus,
    startTime: '2025-02-12T15:38',
    nickname: '닉네임',
    latitude: 37.51924,
    longitude: 127.127343,
  };

  return (
    <div className="fixed bottom-0 top-[56px] mb-5 w-full max-w-[430px]">
      {/* 내부 컨테이너 */}
      <div className="h-full overflow-y-auto">
        {/* 헤더 */}
        <SharingDetailHeader {...detailData} />

        {/* 이미지 */}
        <SharingDetailImages image={detailData.photoUrl} />

        {/* 상세 정보 */}
        <SharingDetailContent
          content={detailData.content}
          startTime={detailData.startTime}
        />

        {/* 지도 */}
        <SharingDetailMap
          latitude={detailData.latitude}
          longitude={detailData.longitude}
        />

        {/* 댓글 */}
        <SharingDetailComments />
      </div>
    </div>
  );
};
