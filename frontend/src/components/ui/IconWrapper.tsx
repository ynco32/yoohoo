// IconWrapper.tsx
'use client';

import Image from 'next/image';
import { SVGIcons, SVGIconName } from '@/assets/svgs';

interface IconWrapperProps {
  icon: SVGIconName;
  label: string;
}

export const IconWrapper = ({ icon, label }: IconWrapperProps) => {
  return (
    <>
      <span className="mb-3 text-3xl" aria-label={label}>
        <Image
          src={SVGIcons[icon]}
          alt={label}
          width={32} // h-8 = 32px
          height={32} // w-8 = 32px
          className="h-8 w-8"
        />
      </span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </>
  );
};
