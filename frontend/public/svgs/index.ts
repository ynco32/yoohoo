import Artwork from './Artwork.svg';
import BG from './BG.svg';
import CongestionIcon from './main/CongestionIcon.svg';
import Conkiri from './conkiri.svg';
import Logo from './logo.svg';
import SharingIcon from './main/SharingIcon.svg';
import SightIcon from './main/SightIcon.svg';
import TicketIcon from './main/TicketIcon.svg';
import SightBg from './main/SightBg.svg';

// SVG 컴포넌트들의 공통 props 타입 정의
export interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  desc?: string;
  className?: string;
}

// 각 SVG 컴포넌트에 대한 타입 정의
export type SVGComponent = React.FC<SVGComponentProps>;

// 모든 SVG 컴포넌트를 객체로 export
export const SVGIcons = {
  Artwork,
  BG,
  CongestionIcon,
  Conkiri,
  Logo,
  SharingIcon,
  SightIcon,
  TicketIcon,
  SightBg,
} as const;

// 개별 컴포넌트 export
export {
  Artwork,
  BG,
  CongestionIcon,
  Conkiri,
  Logo,
  SharingIcon,
  SightIcon,
  TicketIcon,
  SightBg,
};

// SVG 아이콘 이름들의 union 타입
export type SVGIconName = keyof typeof SVGIcons;
