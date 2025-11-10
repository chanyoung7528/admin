import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shared/components/ui/avatar";
import { CustomDocsPage } from "../components/CustomDocsPage";
import { Badge } from "@repo/shared/components/ui/badge";
import {
  User,
  Crown,
  Check,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react";

const meta = {
  title: "UI Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Avatar"
          description="사용자 프로필 이미지 또는 아이콘을 표시하는 Avatar 컴포넌트입니다. 이미지 로딩 실패 시 폴백을 지원합니다."
          installationDeps={["@radix-ui/react-avatar", "clsx", "tailwind-merge"]}
          implementationCode={`import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Example() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.jpg" alt="User" />
      <AvatarFallback>HG</AvatarFallback>
    </Avatar>
  );
}`}
          exampleCode={`// 실제 사용 예시
function UserProfile({ user }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}`}
        />
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 아바타
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// 폴백만 있는 아바타
export const WithFallback: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>HG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KY</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>LC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>PM</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// 다양한 크기
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-lg">XL</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-xl">2XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// 아이콘과 함께
export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-100 text-green-600">
          <Check className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-yellow-100 text-yellow-600">
          <Crown className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};

// 상태 표시
export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>HG</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>KY</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-white" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>LC</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
      </div>
    </div>
  ),
};

// 배지와 함께
export const WithBadge: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="relative inline-block">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>HG</AvatarFallback>
        </Avatar>
        <Badge className="absolute -right-1 -top-1 h-5 min-w-5 p-0.5 text-xs">
          5
        </Badge>
      </div>

      <div className="relative inline-block">
        <Avatar>
          <AvatarFallback>KY</AvatarFallback>
        </Avatar>
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 min-w-5 p-0.5 text-xs"
        >
          99+
        </Badge>
      </div>

      <div className="relative inline-block">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            <Crown className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute -bottom-1 -right-1 px-1.5 py-0 text-xs">
          Pro
        </Badge>
      </div>
    </div>
  ),
};

// 그룹 아바타
export const AvatarGroup: Story = {
  render: () => (
    <div className="space-y-6">
      {/* 기본 그룹 */}
      <div className="flex -space-x-2">
        <Avatar className="border-2 border-background">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>HG</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-background">
          <AvatarFallback>KY</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-background">
          <AvatarFallback>LC</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-background">
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <Avatar className="border-2 border-background">
          <AvatarFallback className="bg-muted text-muted-foreground">
            +5
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 작은 크기 그룹 */}
      <div className="flex -space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Avatar key={i} className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="text-xs">
              {String.fromCharCode(65 + i)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* 큰 크기 그룹 */}
      <div className="flex -space-x-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Avatar key={i} className="h-12 w-12 border-2 border-background">
            <AvatarFallback>
              {String.fromCharCode(65 + i)}
              {i + 1}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 사용자 프로필
export const UserProfile: Story = {
  render: () => (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HG</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">홍길동</h3>
            <p className="text-sm text-muted-foreground">@hong123</p>
            <div className="mt-2 flex gap-2">
              <Badge>관리자</Badge>
              <Badge variant="secondary">
                <Crown className="h-3 w-3" />
                Pro
              </Badge>
            </div>
          </div>
        </div>
        <button className="rounded-md p-2 hover:bg-accent">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>hong@example.com</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>010-1234-5678</span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 rounded-md border px-4 py-2 text-sm hover:bg-accent">
          메시지
        </button>
        <button className="flex-1 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          팔로우
        </button>
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 사용자 목록
export const UserList: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2 rounded-lg border bg-card">
      {[
        { name: "홍길동", email: "hong@example.com", status: "online" },
        { name: "김영희", email: "kim@example.com", status: "away" },
        { name: "이철수", email: "lee@example.com", status: "offline" },
        { name: "박민수", email: "park@example.com", status: "online" },
      ].map((user, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                  user.status === "online"
                    ? "bg-green-500"
                    : user.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-accent">
            보기
          </button>
        </div>
      ))}
    </div>
  ),
};

// 실제 사용 예시 - 댓글
export const Comments: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      {[
        {
          name: "홍길동",
          time: "2시간 전",
          comment: "정말 유용한 정보네요! 감사합니다.",
          likes: 12,
        },
        {
          name: "김영희",
          time: "5시간 전",
          comment: "저도 비슷한 경험이 있습니다. 좋은 글 잘 읽었습니다.",
          likes: 8,
        },
        {
          name: "이철수",
          time: "1일 전",
          comment: "더 자세한 설명을 부탁드려도 될까요?",
          likes: 3,
        },
      ].map((comment, i) => (
        <div key={i} className="flex gap-3 rounded-lg border bg-card p-4">
          <Avatar>
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{comment.name}</p>
                <p className="text-xs text-muted-foreground">{comment.time}</p>
              </div>
            </div>
            <p className="mt-2 text-sm">{comment.comment}</p>
            <div className="mt-3 flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                {comment.likes}
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground">
                답글
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

// 실제 사용 예시 - 팀 멤버
export const TeamMembers: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">팀 멤버</h3>
          <p className="text-sm text-muted-foreground">
            프로젝트에 참여 중인 멤버 목록
          </p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          멤버 초대
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "홍길동", role: "팀 리더", avatar: "", badge: "Admin" },
          { name: "김영희", role: "개발자", avatar: "", badge: "Dev" },
          { name: "이철수", role: "디자이너", avatar: "", badge: "Design" },
          { name: "박민수", role: "마케터", avatar: "", badge: "Marketing" },
        ].map((member, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{member.badge}</Badge>
              <button className="rounded-md p-1 hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
