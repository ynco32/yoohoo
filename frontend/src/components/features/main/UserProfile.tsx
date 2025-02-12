'use client';

import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';
import { useRouter } from 'next/navigation';
import { UserInfo } from './UserInfo';
import { useUserStore } from '@/store/useUserStore';

/**
 * @component UserProfile
 * @description 사용자의 프로필 섹션을 표시하는 컴포넌트입니다.
 * API에서 사용자 정보를 가져와 프로필 배경, 아트워크 이미지, 그리고 사용자 정보를 표시합니다.
 * 클릭 시 기본적으로 마이페이지로 이동하며, onClick prop이 제공되면 해당 함수를 실행합니다.
 */
export const UserProfile = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();
  const { user, isLoading, error } = useUserStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/mypage');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[35vh] w-full items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[35vh] w-full items-center justify-center">
        <div className="text-status-warning">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[35vh] w-full items-center justify-center">
        <div className="text-gray-500">No user data available</div>
      </div>
    );
  }

  return (
    <div
      className="h-[35vh] w-full px-4 py-2 mobile:h-[30vh] mobile:px-6 mobile:py-3 tablet:h-[35vh] tablet:px-8 tablet:py-4"
      onClick={handleClick}
    >
      <div className="relative h-full w-full overflow-hidden rounded-userProfile bg-secondary-300">
        {/* 배경 이미지 */}
        <Image
          src={SVGIcons.ProfileBg}
          alt="background pattern"
          fill
          className="absolute inset-0 z-0 object-cover"
          sizes="100vw"
          priority
        />

        {/* 컨텐츠 컨테이너 */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between p-4 mobile:p-3 tablet:p-4">
          {/* 프로필 이미지 */}
          <div className="relative h-4/5 w-full">
            <div className="z-10 flex h-full items-center justify-center">
              <Image
                src={user.profileUrl || SVGIcons.Artwork}
                alt={user.nickname}
                className="h-full w-auto object-contain"
                width={0}
                height={0}
                sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, 40vw"
                priority
              />
            </div>
          </div>

          {/* 유저 정보 섹션 */}
          <div className="h-1/5 w-full">
            <UserInfo
              nickname={user.nickname}
              level={user.level || '0'}
              tier={user.tier || 'Unranked'}
              className="text-sm mobile:text-base tablet:text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
