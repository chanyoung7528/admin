'use client';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
    kakaoAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '');
    kakaoAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '');
    kakaoAuthUrl.searchParams.set('response_type', 'code');

    window.location.href = kakaoAuthUrl.toString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">카카오 계정으로 간편하게 로그인하세요</p>
        </div>

        <div className="mt-8">
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
        </div>
      </div>
    </div>
  );
}
