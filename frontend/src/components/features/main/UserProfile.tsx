'use client';

import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';
import { useRouter } from 'next/navigation';
import { UserInfo } from './UserInfo';

interface UserProfileProps {
  nickname: string;
  level: string;
  steps: number;
  onClick?: () => void;
}

export const UserProfile = ({
  nickname,
  level,
  steps,
  onClick,
}: UserProfileProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/mypage');
    }
  };

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
            <div className="flex h-full items-center justify-center">
              <Image
                src={SVGIcons.Artwork}
                alt={nickname}
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
              nickname={nickname}
              level={level}
              steps={steps}
              className="text-sm mobile:text-base tablet:text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
