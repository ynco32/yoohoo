'use client';

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
      className="flex flex-col items-center pb-lg pt-xl"
      onClick={handleClick}
    >
      <h1 className="mb-md text-head-bold text-white">{nickname}</h1>
      <MenuCard className="mb-2xl h-24 w-24 overflow-hidden rounded-full bg-secondary-300 mobile:h-28 mobile:w-28 tablet:h-32 tablet:w-32">
        🐘
      </MenuCard>
    </div>
  );
};
