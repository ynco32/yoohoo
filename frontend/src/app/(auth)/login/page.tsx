'use client'

import Image from 'next/image';

export default function Login () {
    const REST_API_KEY = 'f1f70bb13d36d1b133a10e4e91d569d6';
    const REDIRECT_URI = 'http://localhost:8080/login/oauth2/code/kakao';
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    
    const handleKakaoLogin = () =>{
        // 카카오 로그인 구현
        console.log('카카오 로그인 시도');
        window.location.href = link;
    }
    
    return (
        <div className=" flex flex-col items-center justify-center ">\
            <Image
                      src="/images/poster.png"
                      alt="Logo"
                      width={300}
                      height={200}
                      priority
                      className="py-3"
                    />
            <h3 className="py-3 text-center">간편하게 로그인하고 <br/> 다양한 서비스를 즐겨보세요!</h3>
            <button onClick={handleKakaoLogin}  className="flex items-center justify-center w-[300px] bg-[#FEE500] py-3 px-4 rounded-lg hover:bg-[#FEE500]/90 transition-colors">
                카카오로 로그인하기
            </button>
        </div>
    )

}