'use client';

import { useRouter } from 'next/navigation';
import { IconWrapper } from '../../ui/IconWrapper';
import { MenuCard } from '../../ui/MenuCard';
import { SVGIconName } from '@/assets/svgs';
// MenuItem.tsx
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
      className={`${className} ${layoutClasses[layout]}`}
    >
      <IconWrapper icon={icon} label={label} />
    </MenuCard>
  );
};
