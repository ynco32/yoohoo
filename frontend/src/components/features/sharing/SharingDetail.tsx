'use client';

import { useEffect, useState } from 'react';
import { SharingDetailHeader } from './SharingDetailHeader';
import { SharingDetailImages } from './SharingDetailImages';
import { SharingDetailContent } from './SharingDetailContent';
import { SharingDetailMap } from './SharingDetailMap';
import { SharingDetailComments } from './SharingDetailComments';
import { sharingAPI } from '@/lib/api/sharing';
import { SharingPost } from '@/types/sharing';
import { MOCK_COMMENTS } from '@/types/sharing';

interface SharingDetailProps {
  id: number;
}

export const SharingDetail = ({ id }: SharingDetailProps) => {
  const [detailData, setDetailData] = useState<SharingPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharingDetail = async () => {
      try {
        setIsLoading(true);
        const response = await sharingAPI.getSharingDetail(id);
        setDetailData(response);
      } catch (err) {
        console.error('Error fetching sharing detail:', err);
        setError(
          err instanceof Error
            ? err.message
            : '데이터를 불러오는데 실패했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharingDetail();
  }, [id]);

  if (isLoading) {
    return <div className="py-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  if (!detailData) {
    return <div className="py-4 text-center">게시글을 찾을 수 없습니다.</div>;
  }

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
