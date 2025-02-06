'use client';

import { useRouter } from 'next/navigation';
import { IconWrapper } from '../../ui/IconWrapper';
import { MenuCard } from '../../ui/MenuCard';
import { SVGIconName } from '@/assets/svgs';

/**
 * @component MenuItem
 * @description 메인 메뉴의 각 아이템을 렌더링하는 컴포넌트입니다.
 * 아이콘, 라벨, 설명을 포함하며 클릭 시 지정된 경로로 이동합니다.
 *
 * @typedef {Object} MenuItemProps
 * @property {SVGIconName} icon - 메뉴에 표시될 아이콘의 이름
 * @property {string} label - 메뉴의 제목
 * @property {string} href - 클릭 시 이동할 경로
 * @property {string} [description] - 메뉴에 대한 부가 설명
 * @property {string} [className] - 추가적인 스타일링을 위한 클래스
 * @property {'default' | 'large' | 'wide'} [layout] - 메뉴 아이템의 크기 설정
 *   - default: 기본 크기 (1x1)
 *   - large: 세로로 긴 크기 (1x2)
 *   - wide: 가로로 긴 크기 (2x1)
 */

export interface MenuItemProps {
  icon: SVGIconName;
  label: string;
  href: string;
  description?: string;
  className?: string;
  layout?: 'default' | 'large' | 'wide';
}

export const MenuItem = ({
  icon,
  label,
  href,
  className = '',
  description = '',
  layout = 'default',
}: MenuItemProps) => {
  const router = useRouter();
  const layoutClasses = {
    default: '',
    large: 'row-span-2',
    wide: 'col-span-2',
  };

  return (
    <MenuCard
      onClick={() => router.push(href)}
      className={`relative flex flex-col justify-between overflow-hidden p-4 ${className} ${layoutClasses[layout]}`}
    >
      <IconWrapper icon={icon} label={label} description={description} />
    </MenuCard>
  );
};
