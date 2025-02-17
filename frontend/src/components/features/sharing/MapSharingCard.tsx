import React from 'react';
import Image from 'next/image';
import { SharingPost, SharingStatus } from '@/types/sharing';
import { ClockIcon } from '@heroicons/react/24/outline';

interface MapSharingCardProps extends SharingPost {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MapSharingCard = ({
  title,
  status,
  startTime,
  photoUrl,
  onClick,
}: MapSharingCardProps) => {
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
    <div
      onClick={onClick}
      className="w-[240px] overflow-hidden rounded-lg bg-white shadow-lg"
    >
      <div className="p-3">
        <div className="flex gap-2">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src={photoUrl ?? '/images/card.png'}
              alt={title}
              fill
              sizes="(max-width: 48px) 100vw, 48px"
              className="rounded object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="truncate text-sm font-medium">{title}</h3>
            <div className="flex items-center gap-3 text-xs">
              <span
                className={`rounded px-1.5 py-0.5 text-white ${getStatusColor(status)}`}
              >
                {getStatusText(status)}
              </span>
              <div className="flex items-center text-gray-900">
                <ClockIcon className="mr-1 h-3 w-3" />
                <span>{startTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
