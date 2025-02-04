import Link from 'next/link';
import { IconButton } from '@/components/ui/IconButton';
import { ReactNode } from 'react';
interface Platform {
  name: string;
  path?: string; // 막아두느라 링크를 안 넣을수도 있으니까 ?:
  icon: ReactNode;
}

export default function Platform({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex flex-col gap-3 bg-primary-50 px-3 py-3">
      {platforms.map((platform: Platform) =>
        platform.path ? (
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
