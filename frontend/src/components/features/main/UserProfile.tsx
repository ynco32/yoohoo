'use client';

import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';
import { useRouter } from 'next/navigation';
import { UserInfo } from './UserInfo';
import { useUserStore } from '@/store/useUserStore';
import { getUserProfileImage } from '@/lib/utils/profileCharacter';

/**
 * @component UserProfile
 * @description 사용자의 프로필 섹션을 표시하는 컴포넌트입니다.
 * API에서 사용자 정보를 가져와 프로필 배경, 아트워크 이미지, 그리고 사용자 정보를 표시합니다.
 * 클릭 시 기본적으로 마이페이지로 이동하며, onClick prop이 제공되면 해당 함수를 실행합니다.
 */
export const UserProfile = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();
  const { user, isLoading, error } = useUserStore();

  if (user) {
    console.log(user.profileUrl);
  }
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
    <div className="h-[23vh]" onClick={handleClick}>
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
        <div className="relative h-full p-4 mobile:p-3 tablet:p-4">
          {/* 프로필 이미지 */}
          <div className="relative h-full w-full">
            <Image
              fill
              src={getUserProfileImage(user.level || '')}
              alt={user.nickname}
              className="object-contain"
            />
          </div>
          {/* 유저 정보 섹션 - absolute로 이미지와 겹치게 배치 */}
          {/* <div className="absolute bottom-3 left-5 w-full">
            <UserInfo
              nickname={user.nickname}
              level={user.level || '0'}
              tier={user.tier || 'Unranked'}
              className="text-sm mobile:text-base tablet:text-lg"
            />
          </div> */}
          {/* 유저 정보 섹션 - absolute로 이미지와 겹치게 배치 */}
          <div className="absolute bottom-3 left-0 right-0 w-full">
            <div className="flex justify-end pe-5">
              <span className="text-title-bold text-primary-500">
                {user.nickname} 님
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
