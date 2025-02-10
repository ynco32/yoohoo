import { UserLevel } from '@/types/sightReviews';

export const getUserProfileImage = (userLevel: UserLevel): string => {
  const profileImages = {
    ROOKIE: '/images/cat.png',
    AMATEUR: '/images/cat.png',
    SEMI_PRO: '/images/cat.png',
    PROFESSIONAL: '/images/cat.png',
  };

  return profileImages[userLevel];
};
