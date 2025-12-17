import { Badge } from '@repo/shared/components/ui/badge';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, Check, Clock, Crown, Info, Shield, Star, TrendingDown, TrendingUp, X, Zap } from 'lucide-react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Badge"
          description="상태, 카테고리, 라벨 등을 표시하는 Badge 컴포넌트입니다."
          installationDeps={['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge']}
          implementationCode={`import { Badge } from "@components/ui/badge";

export default function Example() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}`}
          exampleCode={`// 실제 사용 예시
function UserStatus({ status }: { status: string }) {
  const variants = {
    active: "default",
    pending: "secondary",
    inactive: "outline",
  } as const;

  return (
    <Badge variant={variants[status]}>
      {status === "active" && <Check />}
      {status === "pending" && <Clock />}
      {status === "inactive" && <X />}
      {status}
    </Badge>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Badge
 */
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Badge',
  },
};

// 모든 변형
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

// 아이콘과 함께
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <Check />
        완료
      </Badge>
      <Badge variant="secondary">
        <Clock />
        대기 중
      </Badge>
      <Badge variant="outline">
        <Info />
        정보
      </Badge>
      <Badge variant="destructive">
        <X />
        실패
      </Badge>
      <Badge>
        <Star />
        즐겨찾기
      </Badge>
      <Badge variant="secondary">
        <Zap />
        프리미엄
      </Badge>
    </div>
  ),
};

// 상태 표시
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">주문 상태</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Check />
            배송 완료
          </Badge>
          <Badge variant="secondary">
            <Clock />
            배송 중
          </Badge>
          <Badge variant="outline">
            <Clock />
            준비 중
          </Badge>
          <Badge variant="destructive">
            <X />
            취소됨
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">사용자 상태</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Check />
            활성
          </Badge>
          <Badge variant="secondary">
            <Clock />
            대기
          </Badge>
          <Badge variant="outline">
            <AlertCircle />
            일시정지
          </Badge>
          <Badge variant="destructive">
            <X />
            비활성
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">결제 상태</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Check />
            결제 완료
          </Badge>
          <Badge variant="secondary">
            <Clock />
            결제 대기
          </Badge>
          <Badge variant="destructive">
            <X />
            결제 실패
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// 카테고리 배지
export const CategoryBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium">제품 카테고리</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">전자기기</Badge>
          <Badge variant="outline">의류</Badge>
          <Badge variant="outline">식품</Badge>
          <Badge variant="outline">가구</Badge>
          <Badge variant="outline">도서</Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">태그</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">신규</Badge>
          <Badge variant="secondary">인기</Badge>
          <Badge variant="secondary">세일</Badge>
          <Badge variant="secondary">베스트</Badge>
          <Badge variant="secondary">추천</Badge>
        </div>
      </div>
    </div>
  ),
};

// 수량/카운트 배지
export const CountBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">알림</span>
          <Badge>12</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">메시지</span>
          <Badge variant="destructive">5</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">업데이트</span>
          <Badge variant="secondary">3</Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">댓글 24</Badge>
        <Badge variant="outline">좋아요 156</Badge>
        <Badge variant="outline">공유 8</Badge>
        <Badge variant="outline">조회수 1.2K</Badge>
      </div>
    </div>
  ),
};

// 트렌드 배지
export const TrendBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <TrendingUp />
        +12.5%
      </Badge>
      <Badge variant="destructive">
        <TrendingDown />
        -8.3%
      </Badge>
      <Badge variant="secondary">
        <TrendingUp />
        상승세
      </Badge>
      <Badge variant="outline">
        <TrendingDown />
        하락세
      </Badge>
    </div>
  ),
};

// 역할/권한 배지
export const RoleBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>
          <Crown />
          관리자
        </Badge>
        <Badge variant="secondary">
          <Shield />
          운영자
        </Badge>
        <Badge variant="outline">
          <Star />
          프리미엄
        </Badge>
        <Badge variant="outline">일반 사용자</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Admin</Badge>
        <Badge variant="secondary">Moderator</Badge>
        <Badge variant="outline">Member</Badge>
        <Badge variant="outline">Guest</Badge>
      </div>
    </div>
  ),
};

// 크기 변형
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="text-xs">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="px-3 py-1 text-sm">Large</Badge>
    </div>
  ),
};

// 실제 사용 예시 - 사용자 목록
export const UserList: Story = {
  render: () => (
    <div className="bg-card w-full max-w-2xl space-y-2 rounded-lg border">
      {[
        { name: '홍길동', role: '관리자', status: '활성', email: 'hong@example.com' },
        { name: '김영희', role: '운영자', status: '활성', email: 'kim@example.com' },
        { name: '이철수', role: '멤버', status: '대기', email: 'lee@example.com' },
        { name: '박민수', role: '멤버', status: '비활성', email: 'park@example.com' },
      ].map((user, i) => (
        <div key={i} className="flex items-center justify-between border-b p-4 last:border-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">{user.name.charAt(0)}</div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === '관리자' ? 'default' : user.role === '운영자' ? 'secondary' : 'outline'}>{user.role}</Badge>
            <Badge variant={user.status === '활성' ? 'default' : user.status === '대기' ? 'secondary' : 'destructive'}>
              {user.status === '활성' && <Check />}
              {user.status === '대기' && <Clock />}
              {user.status === '비활성' && <X />}
              {user.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  ),
};

// 실제 사용 예시 - 제품 카드
export const ProductCard: Story = {
  render: () => (
    <div className="bg-card w-full max-w-sm rounded-lg border shadow-sm">
      <div className="aspect-video w-full bg-gray-200"></div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">노트북 스탠드</h3>
          <div className="flex gap-1">
            <Badge variant="destructive" className="text-xs">
              세일
            </Badge>
            <Badge variant="secondary" className="text-xs">
              신규
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground mb-3 text-sm">인체공학적 디자인의 프리미엄 노트북 스탠드</p>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline">전자기기</Badge>
          <Badge variant="outline">액세서리</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">₩45,000</span>
            <span className="text-muted-foreground ml-2 text-sm line-through">₩60,000</span>
          </div>
          <Badge>
            <Star />
            4.8
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 알림 목록
export const NotificationList: Story = {
  render: () => (
    <div className="bg-card w-full max-w-md space-y-2 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">알림</h3>
        <Badge variant="destructive">3</Badge>
      </div>

      {[
        {
          type: 'success',
          title: '주문이 완료되었습니다',
          time: '방금 전',
        },
        {
          type: 'info',
          title: '새로운 메시지가 도착했습니다',
          time: '5분 전',
        },
        {
          type: 'warning',
          title: '결제가 필요합니다',
          time: '1시간 전',
        },
      ].map((notif, i) => (
        <div key={i} className="hover:bg-accent flex items-start gap-3 rounded-lg p-3">
          <div className="mt-1">
            {notif.type === 'success' && (
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            )}
            {notif.type === 'info' && (
              <div className="rounded-full bg-blue-100 p-1">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
            )}
            {notif.type === 'warning' && (
              <div className="rounded-full bg-yellow-100 p-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notif.title}</p>
            <p className="text-muted-foreground text-xs">{notif.time}</p>
          </div>
          <Badge variant={notif.type === 'success' ? 'default' : notif.type === 'info' ? 'secondary' : 'outline'} className="text-xs">
            {notif.type === 'success' && '완료'}
            {notif.type === 'info' && '새 소식'}
            {notif.type === 'warning' && '중요'}
          </Badge>
        </div>
      ))}
    </div>
  ),
};

// 실제 사용 예시 - 대시보드 통계
export const DashboardStats: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: '총 매출',
          value: '₩12,345,678',
          change: '+12.5%',
          trend: 'up',
        },
        {
          title: '신규 사용자',
          value: '1,234',
          change: '+8.2%',
          trend: 'up',
        },
        {
          title: '활성 주문',
          value: '89',
          change: '-3.1%',
          trend: 'down',
        },
        {
          title: '전환율',
          value: '3.24%',
          change: '+0.5%',
          trend: 'up',
        },
      ].map((stat, i) => (
        <div key={i} className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">{stat.title}</p>
            <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'}>
              {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.change}
            </Badge>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  ),
};
