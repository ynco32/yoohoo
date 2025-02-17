import React from 'react';
import Image from 'next/image';
import { ContentCard } from '@/components/ui/ContentCard';
import { SharingPost, SharingStatus } from '@/types/sharing';
import { ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SharingCardProps extends SharingPost {
  wrapperClassName?: string; // 지도에서만 스타일 적용하기 위함
  concertId: number;
  isLastItem?: boolean;
}

/**
 * 나눔 게시글 카드 컴포넌트
 * @description 나눔 게시글의 기본 정보를 카드 형태로 보여주는 컴포넌트
 */
export const SharingCard = ({
  sharingId,
  title,
  writer,
  status,
  startTime,
  photoUrl,
  concertId,
  isLastItem,
  wrapperClassName = 'border-0', // 스타일 기본값
}: SharingCardProps) => {
  const getStatusText = (status: SharingStatus) => {
    switch (status) {
      case 'ONGOING':
        return '진행중';
      case 'UPCOMING':
        return '준비중';
      case 'CLOSED':
        return '마감';
      default:
        return '';
    }
  };

  const getStatusColor = (status: SharingStatus) => {
    switch (status) {
      case 'ONGOING':
        return 'bg-status-success';
      case 'UPCOMING':
        return 'bg-status-caution';
      case 'CLOSED':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={`${!isLastItem ? 'border-b border-gray-200' : ''}`}>
      <Link href={`/sharing/${concertId}/${sharingId}`} passHref>
        <ContentCard className={wrapperClassName}>
          <div className="flex w-full">
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={photoUrl ?? '/images/card.png'}
                alt={title}
                fill
                sizes="(max-width: 96px) 100vw, 96px"
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between pl-4">
              <div>
                <h3 className="line-clamp-2 text-base font-medium">{title}</h3>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">{writer}</div>
                <div className="flex items-center justify-between text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{startTime}</span>
                  </div>
                  <span
                    className={`group rounded-md px-2 py-1 text-xs text-white ${getStatusColor(status)}`}
                  >
                    {getStatusText(status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ContentCard>
      </Link>
    </div>
  );
};
