'use client';

import { SharingDetailHeader } from './SharingDetailHeader';
import { SharingDetailImages } from './SharingDetailImages';
import { SharingDetailContent } from './SharingDetailContent';
import { SharingDetailMap } from './SharingDetailMap';
import { SharingDetailComments } from './SharingDetailComments';
import { getMockSharingDetail, MOCK_COMMENTS } from '@/types/sharing';

interface SharingDetailProps {
  id: number;
}

export const SharingDetail = ({ id }: SharingDetailProps) => {
  const detailData = getMockSharingDetail(id);

  return (
    <div className="h-[calc(100vh-56px)] w-full max-w-[430px]">
      {/* 내부 컨테이너 */}
      <div className="h-full overflow-y-auto">
        {/* 헤더 */}
        <SharingDetailHeader {...detailData} />

        {/* 이미지 */}
        <SharingDetailImages
          image={detailData.photoUrl || '/images/card.png'}
        />

        {/* 상세 정보 */}
        <SharingDetailContent
          content={detailData.content || ''}
          startTime={detailData.startTime}
        />

        {/* 지도 */}
        <SharingDetailMap
          latitude={detailData.latitude ?? 0}
          longitude={detailData.longitude ?? 0}
        />

        {/* 댓글 */}
        <SharingDetailComments comments={MOCK_COMMENTS} />
      </div>
    </div>
  );
};
