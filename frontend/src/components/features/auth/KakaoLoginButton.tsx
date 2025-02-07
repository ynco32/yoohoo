import { KAKAO_AUTH_URL } from '@/lib/constans/auth';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

interface KakaoLoginButtonProps {
  className: string;
}

export default function KakaoLoginButton({ className }: KakaoLoginButtonProps) {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <button
      onClick={handleKakaoLogin}
      className={`flex items-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 transition-colors hover:bg-[#FEE500]/90 ${className}`}
    >
      <ChatBubbleOvalLeftIcon className="w-6" />
      <span className="flex-1 text-center">카카오로 시작하기</span>
    </button>
  );
}
