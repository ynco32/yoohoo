'use client';

import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';
import { MenuCard } from '@/components/ui/MenuCard';
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
      className="flex flex-col items-center pb-0 pt-sm"
      onClick={handleClick}
    >
      <MenuCard className="h-55 relative mx-auto w-full max-w-sm overflow-hidden rounded-userProfile bg-secondary-300 px-sm tablet:px-md">
        {/* 배경 이미지 */}
        <Image
          src={SVGIcons.ProfileBg}
          alt="background pattern"
          fill
          className="z-0 object-cover"
          priority
        />
        {/* 프로필 이미지 */}
        <div className="relative z-10">
          <Image
            src={SVGIcons.Artwork}
            alt={nickname}
            width={224}
            height={160}
            className="object-contain"
            priority
          />
        </div>
        {/* 유저 정보 섹션 */}
        <div className="absolute bottom-sm left-md z-10">
          <UserInfo nickname={nickname} level={level} steps={steps} />
        </div>
      </MenuCard>
    </div>
  );
};
