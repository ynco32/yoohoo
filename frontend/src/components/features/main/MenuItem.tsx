'use client';

import { useRouter } from 'next/navigation';
import { IconWrapper } from '../../ui/IconWrapper';
import { MenuCard } from '../../ui/MenuCard';

interface MenuItemProps {
  icon: string;
  label: string;
  href: string;
}

export const MenuItem = ({ icon, label, href }: MenuItemProps) => {
  const router = useRouter();

  return (
    <MenuCard onClick={() => router.push(href)}>
      <IconWrapper icon={icon} label={label} />
    </MenuCard>
  );
};
