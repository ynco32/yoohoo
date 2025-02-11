import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  BookmarkIcon as BookmarkOutline,
  EllipsisVerticalIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { SharingStatus } from '@/types/sharing';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { useSharingScrapStore } from '@/store/useSharingScrapStore';
import { useUserStore } from '@/store/useUserStore';

interface SharingDetailHeaderProps {
  sharingId: number;
  title: string;
  nickname: string;
  writerId: number;
  status: SharingStatus;
  profileImage?: string;
  startTime: string;
}

export const SharingDetailHeader = ({
  sharingId,
  title,
  nickname,
  writerId,
  status,
  startTime,
  profileImage = '/images/profile.png',
}: SharingDetailHeaderProps) => {
  const user = useUserStore((state) => state.user);
  const { isScraped, toggleScrap } = useSharingScrapStore();
  const [isToggling, setIsToggling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = user?.userId === writerId;
  const scraped = isScraped(sharingId);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    // 수정 페이지로 이동 로직
  };

  const handleDelete = () => {
    // 삭제 로직
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleScrapClick = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggleScrap(sharingId);
    } catch (error) {
      console.error('Failed to toggle scrap:', error);
    } finally {
      setIsToggling(false);
    }
  };

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
          <div className="relative">
            {isAuthor ? (
              <div className="menu-container">
                {/* 외부 클릭 감지를 위한 클래스 추가 */}
                <button
                  onClick={handleMenuClick}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 z-10 min-w-[100px] rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={handleEdit}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleScrapClick}
                disabled={isToggling}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                {scraped ? (
                  <BookmarkSolid className="text-primary h-6 w-6" />
                ) : (
                  <BookmarkOutline className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
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
