'use client';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
    kakaoAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '');
    kakaoAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '');
    kakaoAuthUrl.searchParams.set('response_type', 'code');

    window.location.href = kakaoAuthUrl.toString();
  };

  const handleNaverLogin = () => {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('naver_state', state);

    const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize');
    naverAuthUrl.searchParams.set('response_type', 'code');
    naverAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '');
    naverAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI || '');
    naverAuthUrl.searchParams.set('state', state);

    window.location.href = naverAuthUrl.toString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">간편하게 로그인하세요</p>
        </div>

        <div className="mt-8 space-y-3">
          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#000000] transition-colors hover:bg-[#FEE500]/90"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
            </svg>
            카카오로 로그인
          </button>

          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            onClick={handleNaverLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#03C75A]/90"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
            </svg>
            네이버로 로그인
          </button>
        </div>

        {/* 에러 메시지 표시 */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>* 동일한 이메일로는 하나의 플랫폼만 가입 가능합니다</p>
        </div>
      </div>
    </div>
  );
}
