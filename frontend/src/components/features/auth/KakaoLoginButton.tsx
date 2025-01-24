import { KAKAO_AUTH_URL } from '@/lib/constans/auth';

export default function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <button
      onClick={handleKakaoLogin}
      className="flex w-[300px] items-center justify-center rounded-lg bg-[#FEE500] px-4 py-3 transition-colors hover:bg-[#FEE500]/90"
    >
      카카오로 시작하기
    </button>
  );
}
