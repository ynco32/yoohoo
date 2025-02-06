import Link from 'next/link';
import { IconButton } from '@/components/ui/IconButton';
import { ReactNode } from 'react';
interface PlatformButtonProps {
  name: string;
  path?: string | null | undefined; // 막아두느라 링크를 안 넣을수도 있으니까 ?:
  icon: ReactNode;
}

export default function PlatformButtons({
  platforms,
}: {
  platforms: PlatformButtonProps[];
}) {
  return (
    <div className="flex flex-col gap-3 bg-primary-50 px-3 py-3">
      {platforms.map((platform: PlatformButtonProps) =>
        platform.path != null ? (
          <Link key={platform.name} href={platform.path}>
            <IconButton leftIcon={platform.icon}>{platform.name}</IconButton>
          </Link>
        ) : (
          <IconButton key={platform.name} leftIcon={platform.icon}>
            {platform.name}
          </IconButton>
        )
      )}
    </div>
  );
}
