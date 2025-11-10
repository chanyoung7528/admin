import type { Meta, StoryObj } from "@storybook/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shared/components/ui/tabs";
import { CustomDocsPage } from "../components/CustomDocsPage";
import { Badge } from "@repo/shared/components/ui/badge";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Home,
  FileText,
} from "lucide-react";

const meta = {
  title: "UI Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Tabs"
          description="탭으로 콘텐츠를 구분하여 표시하는 컴포넌트입니다. 여러 섹션을 효율적으로 관리할 수 있습니다."
          installationDeps={["@radix-ui/react-tabs", "clsx", "tailwind-merge"]}
          implementationCode={`import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Example() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="password">비밀번호</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p>계정 설정 내용</p>
      </TabsContent>
      <TabsContent value="password">
        <p>비밀번호 변경 내용</p>
      </TabsContent>
    </Tabs>
  );
}`}
          exampleCode={`// 실제 사용 예시 - 프로필 설정
function ProfileSettings() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">프로필</TabsTrigger>
        <TabsTrigger value="account">계정</TabsTrigger>
        <TabsTrigger value="security">보안</TabsTrigger>
        <TabsTrigger value="notifications">알림</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-4">
        {/* 프로필 설정 폼 */}
      </TabsContent>
      
      <TabsContent value="account" className="space-y-4">
        {/* 계정 설정 폼 */}
      </TabsContent>
    </Tabs>
  );
}`}
        />
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 탭
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Tab 1 Content</h3>
          <p className="text-sm text-muted-foreground">
            첫 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Tab 2 Content</h3>
          <p className="text-sm text-muted-foreground">
            두 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Tab 3 Content</h3>
          <p className="text-sm text-muted-foreground">
            세 번째 탭의 내용입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 아이콘과 함께
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="home">
          <Home className="h-4 w-4" />
          홈
        </TabsTrigger>
        <TabsTrigger value="users">
          <Users className="h-4 w-4" />
          사용자
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4" />
          설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">대시보드</h3>
          <p className="text-sm text-muted-foreground">
            전체 시스템 현황을 확인하세요.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="users" className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">사용자 관리</h3>
          <p className="text-sm text-muted-foreground">
            사용자 목록과 권한을 관리합니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">시스템 설정</h3>
          <p className="text-sm text-muted-foreground">
            시스템 환경을 설정합니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 배지와 함께
export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="all">
          전체
          <Badge variant="secondary" className="ml-2">
            24
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="unread">
          읽지 않음
          <Badge variant="destructive" className="ml-2">
            5
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="archived">
          보관됨
          <Badge variant="outline" className="ml-2">
            12
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">전체 알림 (24)</h3>
          <p className="text-sm text-muted-foreground">
            모든 알림을 확인할 수 있습니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="unread">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">읽지 않은 알림 (5)</h3>
          <p className="text-sm text-muted-foreground">
            아직 확인하지 않은 알림입니다.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="archived">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">보관된 알림 (12)</h3>
          <p className="text-sm text-muted-foreground">
            보관 처리된 알림 목록입니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 전체 너비
export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full max-w-4xl">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">
          개요
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex-1">
          분석
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex-1">
          보고서
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex-1">
          설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">시스템 개요</h3>
          <p className="text-muted-foreground">
            전체 시스템의 주요 지표를 확인하세요.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">데이터 분석</h3>
          <p className="text-muted-foreground">
            상세한 데이터 분석 결과를 확인하세요.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">보고서</h3>
          <p className="text-muted-foreground">
            생성된 보고서를 확인하고 다운로드하세요.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">설정</h3>
          <p className="text-muted-foreground">
            시스템 설정을 변경하세요.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 실제 사용 예시 - 프로필 설정
export const ProfileSettings: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-full max-w-2xl">
      <TabsList>
        <TabsTrigger value="profile">
          <User className="h-4 w-4" />
          프로필
        </TabsTrigger>
        <TabsTrigger value="account">
          <Settings className="h-4 w-4" />
          계정
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="h-4 w-4" />
          알림
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCard className="h-4 w-4" />
          결제
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">프로필 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">이름</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                defaultValue="홍길동"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">이메일</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2"
                defaultValue="hong@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">소개</label>
              <textarea
                className="w-full rounded-md border px-3 py-2"
                rows={3}
                defaultValue="안녕하세요, 홍길동입니다."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button className="rounded-md border px-4 py-2 text-sm">
                취소
              </button>
              <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                저장
              </button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="account" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">계정 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                사용자 이름
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                defaultValue="hong123"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">언어</label>
              <select className="w-full rounded-md border px-3 py-2">
                <option>한국어</option>
                <option>English</option>
                <option>日本語</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                시간대
              </label>
              <select className="w-full rounded-md border px-3 py-2">
                <option>Asia/Seoul</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">알림 설정</h3>
          <div className="space-y-4">
            {[
              { label: "이메일 알림", desc: "중요한 업데이트를 이메일로 받기" },
              { label: "푸시 알림", desc: "모바일 기기로 알림 받기" },
              { label: "뉴스레터", desc: "주간 뉴스레터 구독" },
              { label: "마케팅", desc: "프로모션 및 이벤트 정보 받기" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  defaultChecked={i < 2}
                />
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="billing" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">결제 정보</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">현재 플랜</p>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">프리미엄 플랜</span>
                  <Badge>활성</Badge>
                </div>
                <p className="text-2xl font-bold">₩29,900 / 월</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  다음 결제일: 2024.12.01
                </p>
              </div>
            </div>
            <div>
              <button className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent">
                플랜 변경
              </button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 실제 사용 예시 - 대시보드
export const Dashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full max-w-4xl">
      <TabsList>
        <TabsTrigger value="overview">
          <BarChart3 className="h-4 w-4" />
          개요
        </TabsTrigger>
        <TabsTrigger value="orders">
          <ShoppingCart className="h-4 w-4" />
          주문
          <Badge variant="secondary" className="ml-2">
            12
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="products">
          <Package className="h-4 w-4" />
          제품
        </TabsTrigger>
        <TabsTrigger value="customers">
          <Users className="h-4 w-4" />
          고객
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "총 매출", value: "₩12,345,678", change: "+12.5%" },
            { label: "주문 수", value: "1,234", change: "+8.2%" },
            { label: "신규 고객", value: "89", change: "+23.1%" },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-green-600">{stat.change}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="font-semibold">최근 주문</h3>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">주문 #{i}234</p>
                    <p className="text-sm text-muted-foreground">
                      2시간 전
                    </p>
                  </div>
                  <Badge>배송 중</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="products" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">제품 관리</h3>
          <p className="text-sm text-muted-foreground">
            제품 목록과 재고를 관리합니다.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="customers" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">고객 관리</h3>
          <p className="text-sm text-muted-foreground">
            고객 정보와 활동을 확인합니다.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// 실제 사용 예시 - 문서 뷰어
export const DocumentViewer: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-full max-w-4xl">
      <TabsList>
        <TabsTrigger value="preview">
          <FileText className="h-4 w-4" />
          미리보기
        </TabsTrigger>
        <TabsTrigger value="code">코드</TabsTrigger>
        <TabsTrigger value="raw">원본</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="space-y-4">
        <div className="rounded-lg border bg-card p-8">
          <h1 className="mb-4 text-3xl font-bold">문서 제목</h1>
          <p className="mb-4 text-muted-foreground">
            이것은 문서의 미리보기입니다. 렌더링된 결과를 확인할 수 있습니다.
          </p>
          <h2 className="mb-2 text-xl font-semibold">섹션 1</h2>
          <p className="text-muted-foreground">
            첫 번째 섹션의 내용입니다.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="code" className="space-y-4">
        <div className="rounded-lg border bg-slate-950 p-6">
          <code className="text-sm text-slate-50">
            <pre>{`<div>
  <h1>문서 제목</h1>
  <p>내용...</p>
</div>`}</pre>
          </code>
        </div>
      </TabsContent>

      <TabsContent value="raw" className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="font-mono text-sm text-muted-foreground">
            # 문서 제목<br />
            <br />
            이것은 문서의 원본 내용입니다...
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
