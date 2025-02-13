'use client';

import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { deleteSightReview } from '@/lib/api/sightReview';
import { useRouter } from 'next/navigation';

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

  const isAuthor = user?.userId === writerId;
  const router = useRouter();

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    try {
      await deleteSightReview(reviewId);
      // 삭제 성공 후 처리 (예: 리다이렉트 또는 목록 새로고침)

      try {
        router.back();
      } catch (e) {
        // 이전 페이지가 없는 경우 기본 페이지로 이동
        console.error('삭제 성공 후 라우팅 실패', e);
        router.push('/main');
      }
    } catch (error) {
      // 에러 처리
      console.error('리뷰 삭제 실패:', error);
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동
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
                      onClick={handleDelete}
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
  );
};
