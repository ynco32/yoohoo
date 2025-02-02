'use client';

import Image from 'next/image';
import { Artwork, ProfileBg } from '@/assets/svgs';
import { MenuCard } from '@/components/ui/MenuCard';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  nickname: string;
  onClick?: () => void;
}

export const UserProfile = ({ nickname, onClick }: UserProfileProps) => {
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
      className="flex flex-col items-center pb-0 pt-2xl"
      onClick={handleClick}
    >
      <MenuCard className="rounded-userProfile relative mx-auto h-60 w-full max-w-sm overflow-hidden bg-secondary-300 px-sm tablet:px-md">
        {/* 배경 이미지 */}
        <Image
          src={ProfileBg}
          alt="background pattern"
          fill
          className="z-0 object-cover"
          priority
        />
        {/* 프로필 이미지 */}
        <div className="relative z-10">
          <Image
            src={Artwork}
            alt={nickname}
            width={224}
            height={160}
            className="object-contain"
            priority
          />
        </div>
      </MenuCard>
    </div>
  );
};
