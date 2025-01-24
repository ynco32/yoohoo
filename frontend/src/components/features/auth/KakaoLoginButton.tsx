import {KAKAO_AUTH_URL} from '@/lib/constans/auth';

export default function KakaoLoginButton(){
    const handleKakaoLogin = () =>{
        window.location.href = KAKAO_AUTH_URL;
    }
    return(
    <button onClick={handleKakaoLogin}  className="flex items-center justify-center w-[300px] bg-[#FEE500] py-3 px-4 rounded-lg hover:bg-[#FEE500]/90 transition-colors">
    카카오로 시작작하기
    </button>
    )
}



