import type { Meta, StoryObj } from '@storybook/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@repo/shared/components/ui/sidebar';
import { CustomDocsPage } from '../components/CustomDocsPage';
import { Home, Settings, Users, FileText, BarChart, HelpCircle } from 'lucide-react';

const meta = {
  title: 'UI Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Sidebar"
          description="접고 펼칠 수 있는 반응형 사이드바 컴포넌트입니다. 데스크톱에서는 고정되고, 모바일에서는 Sheet로 표시됩니다."
          installationDeps={[
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tooltip',
            'class-variance-authority',
            'lucide-react',
            'clsx',
            'tailwind-merge',
          ]}
          implementationCode={`// 기본 Sidebar 구조
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-4 py-2 text-lg font-semibold">My App</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home />
                  <span>홈</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="px-4 py-2 text-sm">© 2024</p>
      </SidebarFooter>
    </Sidebar>
  );
}

// 사용 예시
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1>페이지 제목</h1>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Sidebar
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">My App</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users />
                      <span>사용자</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText />
                      <span>문서</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart />
                      <span>분석</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-2">
              <p className="text-xs text-muted-foreground">© 2024 My App</p>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">대시보드</h1>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-2 text-xl font-semibold">환영합니다!</h2>
              <p className="text-muted-foreground">사이드바를 접고 펼치려면 왼쪽 상단의 버튼을 클릭하세요.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">카드 1</h3>
                <p className="text-sm text-muted-foreground">콘텐츠 내용</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">카드 2</h3>
                <p className="text-sm text-muted-foreground">콘텐츠 내용</p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

// 여러 그룹
export const MultipleGroups: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>대시보드</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart />
                      <span>분석</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>관리</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users />
                      <span>사용자</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings />
                      <span>설정</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>지원</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText />
                      <span>문서</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HelpCircle />
                      <span>도움말</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-4 py-2">
              <p className="text-xs text-muted-foreground">버전 1.0.0</p>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">메인 콘텐츠</h1>
          </header>
          <main className="flex-1 p-4">
            <p className="text-muted-foreground">여러 그룹으로 메뉴를 구성할 수 있습니다.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

// Floating 변형
export const FloatingVariant: Story = {
  render: () => (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar variant="floating">
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">Floating</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users />
                      <span>사용자</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings />
                      <span>설정</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Floating Sidebar</h1>
          </header>
          <main className="flex-1 p-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-2 text-xl font-semibold">Floating 변형</h2>
              <p className="text-muted-foreground">사이드바가 떠있는 스타일로 표시됩니다.</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

// Inset 변형
export const InsetVariant: Story = {
  render: () => (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">Inset</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart />
                      <span>분석</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText />
                      <span>문서</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Inset Sidebar</h1>
          </header>
          <main className="flex-1 p-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-2 text-xl font-semibold">Inset 변형</h2>
              <p className="text-muted-foreground">메인 콘텐츠가 둥근 모서리와 그림자를 가진 inset 스타일입니다.</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

// 아이콘만 표시
export const IconCollapsible: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">App</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="홈">
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="사용자">
                      <Users />
                      <span>사용자</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="문서">
                      <FileText />
                      <span>문서</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="분석">
                      <BarChart />
                      <span>분석</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="설정">
                      <Settings />
                      <span>설정</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">아이콘 모드</h1>
          </header>
          <main className="flex-1 p-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-2 text-xl font-semibold">아이콘만 표시</h2>
              <p className="mb-4 text-muted-foreground">사이드바가 접혀있을 때 아이콘만 표시되고, 마우스를 올리면 툴팁이 나타납니다.</p>
              <p className="text-sm text-muted-foreground">💡 사이드바 토글 버튼을 클릭해서 펼쳐보세요!</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

// 버튼 크기 변형
export const ButtonSizes: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">버튼 크기</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Small 크기</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="sm">
                      <Home />
                      <span>홈</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="sm">
                      <Users />
                      <span>사용자</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Default 크기</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText />
                      <span>문서</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChart />
                      <span>분석</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Large 크기</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                      <Settings />
                      <span>설정</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                      <HelpCircle />
                      <span>도움말</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">버튼 크기 변형</h1>
          </header>
          <main className="flex-1 p-4">
            <p className="text-muted-foreground">메뉴 버튼은 sm, default, lg 세 가지 크기를 지원합니다.</p>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};
