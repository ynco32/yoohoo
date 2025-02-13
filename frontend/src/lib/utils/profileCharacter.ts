import Level1Image from '../../../public/images/profile/level1.png';
import Level2Image from '../../../public/images/profile/level2.png';
import Level3Image from '../../../public/images/profile/level3.png';
import Level4Image from '../../../public/images/profile/level4.png';
import CatImage from '../../../public/images/cat.png';
import { StaticImageData } from 'next/image';

export const getUserProfileImage = (userLevel: string): string => {
  const idx = Number(userLevel);
  const profileImages: Record<1 | 2 | 3 | 4, StaticImageData> = {
    1: Level1Image,
    2: Level2Image,
    3: Level3Image,
    4: Level4Image,
  };

  if (idx in profileImages) {
    return profileImages[idx as 1 | 2 | 3 | 4].src;
  }

  return CatImage.src;
};
