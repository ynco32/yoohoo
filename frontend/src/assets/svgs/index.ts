// src/assets/svgs/index.ts
import { FunctionComponent, SVGProps } from 'react';

export type SVGIconProps = SVGProps<SVGSVGElement>;
export type SVGIconComponent = FunctionComponent<SVGIconProps>;

export const SVGIcons = {
  Artwork: '/svgs/Artwork.svg',
  BG: '/svgs/BG.svg',
  CongestionIcon: '/svgs/main/CongestionIcon.svg',
  Conkiri: '/svgs/conkiri.svg',
  Logo: '/svgs/logo.svg',
  SharingIcon: '/svgs/main/SharingIcon.svg',
  SightIcon: '/svgs/main/SightIcon.svg',
  TicketIcon: '/svgs/main/TicketIcon.svg',
  SightBg: '/svgs/main/SightBg.svg',
} as const;

// Individual exports
export const Artwork = '/svgs/Artwork.svg';
export const BG = '/svgs/BG.svg';
export const CongestionIcon = '/svgs/main/CongestionIcon.svg';
export const Conkiri = '/svgs/conkiri.svg';
export const Logo = '/svgs/logo.svg';
export const SharingIcon = '/svgs/main/SharingIcon.svg';
export const SightIcon = '/svgs/main/SightIcon.svg';
export const TicketIcon = '/svgs/main/TicketIcon.svg';
export const SightBg = '/svgs/main/SightBg.svg';

// Export type for SVG icon names
export type SVGIconName = keyof typeof SVGIcons;
