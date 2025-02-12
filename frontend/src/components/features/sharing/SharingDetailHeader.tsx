import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { StatusDropdown } from './StatusDropdown';
import { Modal } from '@/components/common/Modal';
import { sharingAPI } from '@/lib/api/sharing';

interface SharingDetailHeaderProps {
  sharingId: number;
  title: string;
  nickname: string;
  writerId: number;
  status: SharingStatus;
  profileImage?: string;
  startTime: string;
  onStatusChange?: (newStatus: SharingStatus) => void;
}

export const SharingDetailHeader = ({
  sharingId,
  title,
  nickname,
  writerId,
  status,
  startTime,
  profileImage = '/images/profile.png',
  onStatusChange,
}: SharingDetailHeaderProps) => {
  const params = useParams();
  const concertId = Number(params.concertId);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { isScraped, toggleScrap } = useSharingScrapStore();
  const [isToggling, setIsToggling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isAuthor = user?.userId === writerId;
  const scraped = isScraped(sharingId);

  // 수정 삭제
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    router.push(`/sharing/${concertId}/${sharingId}/edit`);
    setShowMenu(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setShowMenu(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await sharingAPI.deleteSharing(sharingId);
      router.replace('/sharing');
    } catch (error) {
      console.error('Failed to delete sharing:', error);
      if (error) {
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
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

  // 스크랩
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

  // 상태 변경
  const handleStatusChange = async (newStatus: SharingStatus) => {
    try {
      await sharingAPI.updateSharingStatus(sharingId, newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
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
    <>
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
          {/* 오른쪽 영역: 메뉴 버튼과 상태/스크랩 */}
          <div className="flex flex-col items-end gap-4">
            {/* 메뉴 버튼 또는 스크랩 버튼 */}
            {isAuthor ? (
              <div className="menu-container relative">
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
            {/* 상태 드롭다운 또는 상태 표시 */}
            {isAuthor ? (
              <StatusDropdown
                currentStatus={status}
                onStatusChange={handleStatusChange}
                isAuthor={isAuthor}
              />
            ) : (
              <span
                className={`rounded-md px-2 py-1 text-xs text-white ${getStatusColor(status)}`}
              >
                {getStatusText(status)}
              </span>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="정말로 게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        type="confirm"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
