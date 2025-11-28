import { Button, ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="ErrorBoundary"
          description="React 컴포넌트 트리에서 발생하는 에러를 선언적으로 처리하는 컴포넌트입니다. react-error-boundary를 기반으로 하며, 다양한 폴백 UI 옵션을 제공합니다."
          installationDeps={['react-error-boundary']}
          implementationCode={`import { ErrorBoundary, useErrorHandler } from "@repo/shared/components/ui";

// 기본 사용법
export default function App() {
  return (
    <ErrorBoundary fallback="default">
      <YourComponent />
    </ErrorBoundary>
  );
}

// 비동기 에러 처리
function AsyncComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('API 요청 실패');
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error);
    }
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
}`}
          exampleCode={`// 라우트 레벨 에러 바운더리
export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary
      fallback="default"
      showHomeButton={true}
      onError={(error, info) => {
        console.error('라우트 에러:', error, info);
      }}
    >
      <Outlet />
    </ErrorBoundary>
  ),
});

// 페이지 레벨 에러 바운더리
export default function DashboardPage() {
  return (
    <ErrorBoundary
      fallback="default"
      title="대시보드 로딩 실패"
      description="데이터를 불러오는 중 문제가 발생했습니다."
    >
      <DashboardContent />
    </ErrorBoundary>
  );
}

// 섹션 레벨 에러 바운더리
export function DashboardChart() {
  return (
    <ErrorBoundary fallback="simple">
      <ComplexChart data={chartData} />
    </ErrorBoundary>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 에러를 발생시키는 테스트 컴포넌트
 */
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('의도적으로 발생시킨 테스트 에러입니다!');
  }
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center gap-2 text-green-600">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">정상 작동 중입니다</span>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">컴포넌트가 정상적으로 렌더링되고 있습니다.</p>
    </div>
  );
};

/**
 * 비동기 에러를 발생시키는 컴포넌트
 */
const AsyncBuggyComponent = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      setCount(count + 1);
      // 비동기 에러 시뮬레이션
      await new Promise((_, reject) => setTimeout(() => reject(new Error('비동기 작업 실패! 서버와의 연결이 끊어졌습니다.')), 800));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="mb-2 font-semibold">비동기 API 호출 테스트</h3>
        <p className="text-muted-foreground text-sm">버튼을 클릭하면 비동기 에러가 발생합니다.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? <RefreshCw className="animate-spin" /> : <AlertTriangle />}
          {isLoading ? '처리 중...' : '비동기 에러 발생시키기'}
        </Button>
        <span className="text-muted-foreground text-sm">시도 횟수: {count}</span>
      </div>
    </div>
  );
};

/**
 * 조건부 에러 발생 컴포넌트
 */
const ConditionalErrorComponent = () => {
  const [shouldError, setShouldError] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="mb-2 font-semibold">에러 바운더리 테스트</h3>
        <p className="text-muted-foreground text-sm">버튼을 클릭하여 의도적인 에러를 발생시킬 수 있습니다.</p>
      </div>
      <BuggyComponent shouldThrow={shouldError} />
      {!shouldError && (
        <Button onClick={() => setShouldError(true)} variant="destructive">
          <AlertTriangle />
          에러 발생시키기
        </Button>
      )}
    </div>
  );
};

// 기본 ErrorBoundary 스타일
export const Default: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[800px]">
      <ErrorBoundary fallback="default" title="문제가 발생했습니다" description="예상치 못한 오류가 발생했습니다. 다시 시도해 주세요." showHomeButton={true}>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 심플한 ErrorBoundary 스타일
export const Simple: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[600px]">
      <ErrorBoundary fallback="simple">
        <ConditionalErrorComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 최소한의 ErrorBoundary 스타일
export const Minimal: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[400px]">
      <ErrorBoundary fallback="minimal">
        <ConditionalErrorComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 비동기 에러 처리
export const AsyncError: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[800px]">
      <ErrorBoundary fallback="default" title="비동기 작업 실패" description="서버 요청 중 문제가 발생했습니다.">
        <AsyncBuggyComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 커스텀 폴백 컴포넌트
export const CustomFallback: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[600px]">
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 dark:border-purple-800 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="text-6xl">🚨</div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">앗! 문제가 발생했어요</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">{error.message}</p>
            <div className="flex gap-2">
              <Button onClick={resetErrorBoundary} variant="default">
                다시 시도하기
              </Button>
              <Button onClick={() => console.log('에러 로그:', error)} variant="outline">
                에러 상세 보기
              </Button>
            </div>
          </div>
        )}
      >
        <ConditionalErrorComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 에러 로깅 포함
export const WithErrorLogging: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[800px]">
      <ErrorBoundary
        fallback="default"
        onError={(error, info) => {
          // 실제 환경에서는 여기서 Sentry, LogRocket 등으로 전송
          console.group('🚨 에러 발생');
          console.error('에러:', error);
          console.error('컴포넌트 스택:', info.componentStack);
          console.groupEnd();
        }}
        onReset={() => {
          console.log('✅ 에러 바운더리 리셋됨');
        }}
      >
        <ConditionalErrorComponent />
      </ErrorBoundary>
    </div>
  ),
};

// 중첩된 ErrorBoundary
export const Nested: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[900px] space-y-4">
      <ErrorBoundary fallback="default" title="외부 에러 바운더리">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 font-semibold">외부 컴포넌트</h3>
          <p className="text-muted-foreground mb-4 text-sm">이 영역의 에러는 외부 에러 바운더리에서 처리됩니다.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <ErrorBoundary fallback="simple">
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">내부 섹션 A</h4>
                <ConditionalErrorComponent />
              </div>
            </ErrorBoundary>

            <ErrorBoundary fallback="simple">
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">내부 섹션 B</h4>
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">정상 작동</span>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  ),
};

// 폼에서의 ErrorBoundary 활용
const FormWithError = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleError = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // 폼 제출 시뮬레이션
    try {
      await new Promise((_, reject) => setTimeout(() => reject(new Error('폼 제출 중 서버 오류 발생: 연결 시간 초과')), 800));
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="mb-4 font-semibold">사용자 등록 폼</h3>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">이름</label>
        <input type="text" className="w-full rounded-md border px-3 py-2" placeholder="이름을 입력하세요" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">이메일</label>
        <input type="email" className="w-full rounded-md border px-3 py-2" placeholder="email@example.com" />
      </div>
      <Button type="submit" disabled={submitted} className="w-full">
        {submitted && <RefreshCw className="animate-spin" />}
        {submitted ? '제출 중...' : '제출하기 (에러 발생)'}
      </Button>
    </form>
  );
};

export const FormError: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-[600px]">
      <ErrorBoundary fallback="simple">
        <FormWithError />
      </ErrorBoundary>
    </div>
  ),
};

// 대시보드 레이아웃에서의 활용
export const DashboardLayout: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="w-full max-w-5xl">
      <ErrorBoundary fallback="default" showHomeButton={true}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">대시보드</h2>
              <p className="text-muted-foreground text-sm">시스템 전체 현황을 확인하세요</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: '총 사용자', value: '1,234', status: 'success' },
              { title: '활성 세션', value: '892', status: 'success' },
              { title: '에러 발생', value: 'N/A', status: 'error' },
            ].map((stat, i) => (
              <ErrorBoundary key={i} fallback="minimal">
                {stat.status === 'error' ? (
                  <div
                    className="cursor-pointer rounded-lg border p-6 transition-colors hover:border-red-500"
                    onClick={() => {
                      throw new Error('데이터 로드 실패: 서버에 연결할 수 없습니다.');
                    }}
                  >
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    <p className="text-muted-foreground mt-1 text-xs">클릭하여 에러 발생</p>
                  </div>
                ) : (
                  <div className="rounded-lg border p-6">
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs text-green-600">↑ 정상</p>
                  </div>
                )}
              </ErrorBoundary>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ErrorBoundary fallback="simple">
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 font-semibold">최근 활동</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>사용자 활동 {i}</span>
                      <span className="ml-auto">{i}분 전</span>
                    </div>
                  ))}
                </div>
              </div>
            </ErrorBoundary>

            <ErrorBoundary fallback="simple">
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 font-semibold">시스템 알림</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-muted-foreground flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>알림 {i}</span>
                      <span className="ml-auto">{i}시간 전</span>
                    </div>
                  ))}
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  ),
};
