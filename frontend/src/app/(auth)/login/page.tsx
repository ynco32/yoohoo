'use client';

import Image from 'next/image';
import KakaoLoginButton from '@/components/features/auth/KakaoLoginButton';

export default function Login() {
  return (
    <div className="bg-background flex flex-col items-center justify-center">
      <Image
        src="/images/poster.png"
        alt="Logo"
        width={300}
        height={200}
        priority
        className="py-3"
      />
      <h3 className="py-3 text-center">
        간편하게 로그인하고 <br /> 다양한 서비스를 즐겨보세요!
      </h3>
      <KakaoLoginButton />
    </div>
  );
}
