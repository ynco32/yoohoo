// components/features/sharing/SharingDetailHeader.tsx
import Image from 'next/image';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { SharingStatus } from '@/types/sharing';
import { ClockIcon } from '@heroicons/react/24/outline';
import { formatDateTime } from '@/lib/utils/dateFormat';

interface SharingDetailHeaderProps {
  title: string;
  nickname: string;
  status: SharingStatus;
  profileImage?: string;
  startTime: string;
}

export const SharingDetailHeader = ({
  title,
  nickname,
  status,
  startTime,
  profileImage = '/images/profile.png',
}: SharingDetailHeaderProps) => {
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
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="relative h-10 w-10">
            {' '}
            {/* 원형 프로필 */}
            <Image
              src={profileImage}
              alt="프로필"
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-medium">{title}</h1>
            <p className="text-sm text-gray-600">{nickname}</p>
            <div className="mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-900">
                <ClockIcon className="h-6 w-6" />
                {formatDateTime(startTime)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-end flex flex-col items-end gap-2">
          <BookmarkIcon className="h-6 w-6" />
          <span
            className={`rounded-md px-2 py-1 text-xs text-white ${getStatusColor(status)}`}
          >
            {getStatusText(status)}
          </span>
        </div>
      </div>
    </div>
  );
};
