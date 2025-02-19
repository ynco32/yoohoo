'use client';

import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { deleteSightReview } from '@/lib/api/sightReview';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/Modal';

interface ReviewHeaderProps {
  concertTitle: string;
  nickName: string;
  writerId: number;
  reviewId: number;
  profilePicture: string;
  seatInfo: string;
}

export const ReviewHeader = ({
  concertTitle,
  nickName,
  reviewId,
  writerId,
  profilePicture,
  seatInfo,
}: ReviewHeaderProps) => {
  const user = useUserStore((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAuthor = user?.userId === writerId;
  const router = useRouter();

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    try {
      await deleteSightReview(reviewId);
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    router.push(`/sight/reviews/${reviewId}/edit`);
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

  return (
    <>
      <div className="mb-4 flex items-center">
        <div className="flex w-full items-center gap-2">
          <Image
            src={profilePicture}
            alt={`${nickName}의 프로필 사진`}
            width={0}
            height={0}
            sizes="100vw"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-grow flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{nickName}</h2>
              <span className="rounded-md bg-sight-badge px-2 py-1 text-xs text-gray-100">
                {seatInfo}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{concertTitle}</span>
              {isAuthor && (
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
                        onClick={handleDeleteClick}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="리뷰를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        type="confirm"
        variant="danger"
      />
    </>
  );
};
