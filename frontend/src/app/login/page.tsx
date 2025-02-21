'use client';

import Image from 'next/image';
import { SVGIcons } from '@/assets/svgs';
import KakaoLoginButton from '@/components/features/auth/KakaoLoginButton';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-radial from-[#DBEEF1] to-white px-4">
      {/* [텍스트] 로그인 안내문구 */}
      <div className="sm:top-[420px] absolute left-1/2 top-[420px] w-full max-w-[300px] -translate-x-1/2">
        <div className="sm:text-xl text-center font-pretendard text-lg font-bold leading-[132%] text-[#515151]">
          간편하게 로그인하고
          <br />
          다양한 서비스를 즐겨 보세요!
        </div>
      </div>

      {/* [이미지] 콘끼리 캐릭터 */}
      <Image
        src={SVGIcons.ConkiriVer1}
        width={180}
        height={110}
        alt="baby 콘끼리"
        className="sm:top-[280px] absolute left-1/2 top-[280px] h-[100px] w-[160px] -translate-x-1/2 object-cover"
      />

      {/* [버튼] 카카오 로그인 */}
      <KakaoLoginButton className="absolute bottom-[50px] left-1/2 h-auto w-[90vw] max-w-[340px] -translate-x-1/2 object-cover" />

      {/* [이미지] 콘끼리 로고 */}
      <Image
        src={SVGIcons.Logo}
        width={188}
        height={69}
        alt="콘끼리 로고"
        className="absolute left-1/2 top-[140px] -translate-x-1/2 object-cover"
      />
    </div>
  );
}
