import { StaticImageData } from 'next/image';

export interface ImageProps {
  src: string | StaticImageData;
  alt?: string;
  width?: number;
  height?: number;
}

export const Images = {
  // Profile level images
  Level1: '/images/profile/level1.png',
  Level2: '/images/profile/level2.png',
  Level3: '/images/profile/level3.png',
  Level4: '/images/profile/level4.png',

  // Default images
  Cat: '/images/cat.png',
} as const;

export type ImageName = keyof typeof Images;
