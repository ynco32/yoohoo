import { FunctionComponent, SVGProps } from 'react';

export type SVGIconProps = SVGProps<SVGSVGElement>;
export type SVGIconComponent = FunctionComponent<SVGIconProps>;

export const SVGIcons = {
  Artwork: '/svgs/Artwork.svg',
  ProfileBg: '/svgs/main/ProfileBg.svg',
  Conkiri: '/svgs/conkiri.svg',
  ConkiriVer1: '/svgs/conkiri_ver1.svg',
  Logo: '/svgs/logo.svg',
  SharingIcon: '/svgs/main/SharingIcon.svg',
  SightIcon: '/svgs/main/sightIconFull.svg',
  TicketIcon: '/svgs/main/TicketIcon.svg',
  SightBg: '/svgs/main/SightBg.svg',
  CongestionIcon: '/svgs/main/CongestionIcon.svg',
  SharingBg: '/svgs/main/SharingBg.svg',
  TicketBg: '/svgs/main/Ticket.svg',
  CongestionBG: '/svgs/main/Congestion.svg',
  StageTypeCircular: '/svgs/sight/circular.svg',
  StageTypeBasic: '/svgs/sight/basic.svg',
  StageTypeExtended: '/svgs/sight/extended.svg',
  StageTypeAll: '/svgs/sight/allType.svg',
  TicketingConKiri: '/svgs/ticketing/ticketingConKiri.svg',
} as const;

// Export type for SVG icon names
export type SVGIconName = keyof typeof SVGIcons;
