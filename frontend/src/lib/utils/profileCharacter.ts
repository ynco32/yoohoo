import { Images } from '@/assets/images';

export const getUserProfileImage = (userLevel: string): string => {
  const idx = Number(userLevel);
  const profileImages: Record<1 | 2 | 3 | 4, string> = {
    1: Images.Level1,
    2: Images.Level2,
    3: Images.Level3,
    4: Images.Level4,
  };

  if (idx in profileImages) {
    return profileImages[idx as 1 | 2 | 3 | 4];
  }

  return Images.Cat;
};
