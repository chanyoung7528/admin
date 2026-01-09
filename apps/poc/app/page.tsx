'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SessionUser } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                카카오 로그인 데모
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              로그인 성공!
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt={user.nickname || '프로필'}
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.nickname || '사용자'}
                  </p>
                  {user.email && (
                    <p className="text-sm text-gray-600">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      사용자 ID
                    </dt>
                    <dd className="text-sm text-gray-900">{user.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      로그인 제공자
                    </dt>
                    <dd className="text-sm text-gray-900">{user.provider}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">
                      연결 시간
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(user.connectedAt).toLocaleString('ko-KR')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
