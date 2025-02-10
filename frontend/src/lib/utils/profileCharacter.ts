import { UserLevel } from '@/types/sightReviews';

export const getUserProfileImage = (userLevel: UserLevel): string => {
  const profileImages = {
    ROOKIE: '/images/profile/rookie.png',
    AMATEUR: '/images/profile/amateur.png',
    SEMI_PRO: '/images/profile/semi-pro.png',
    PROFESSIONAL: '/images/profile/professional.png',
  };

  return profileImages[userLevel];
};
