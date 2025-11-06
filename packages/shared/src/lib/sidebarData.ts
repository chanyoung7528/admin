import { SidebarData } from "../types/sidebar";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  MessagesSquare,
  Monitor,
  DollarSign,
  Activity,
  ShoppingCart,
  FileText,
  Package,
  TrendingUp,
  Brain,
  FileCheck,
  BarChart3,
  Command,
} from "lucide-react";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Admin Dashboard",
      logo: Command,
      plan: "Management System",
    },
  ],
  navGroups: [
    {
      title: "Management",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "사용자 관리",
          icon: Users,
          items: [
            {
              title: "사용자 현황",
              url: "/user/list",
            },
            {
              title: "사용자 Insight",
              url: "/user/insight",
            },
            {
              title: "신규회원 등록",
              url: "/user/register",
            },
            {
              title: "메시지 발송",
              url: "/user/message",
            },
            {
              title: "1:1 문의/요청 관리",
              url: "/inquiry",
            },
          ],
        },
        {
          title: "이용 현황",
          icon: Activity,
          items: [
            {
              title: "모니터링",
              url: "/monitoring",
            },
            {
              title: "Dashboard",
              url: "/dashboard",
            },
            {
              title: "결제/정산",
              url: "/report",
            },
          ],
        },
      ],
    },
    {
      title: "MY BODY",
      items: [
        {
          title: "이용 현황",
          icon: Activity,
          items: [
            {
              title: "모니터링",
              url: "/my-body/monitoring",
            },
            {
              title: "Dashboard",
              url: "/my-body/dashboard",
            },
          ],
        },
        {
          title: "정산 관리",
          icon: DollarSign,
          items: [
            {
              title: "결제/정산 내역",
              url: "/my-body/settlement",
            },
            {
              title: "운영 Report",
              url: "/my-body/report",
            },
          ],
        },
      ],
    },
    {
      title: "MY FOOD",
      items: [
        {
          title: "발주 관리",
          icon: ShoppingCart,
          items: [
            {
              title: "주문/입고/판매 내역",
              url: "/my-food/order",
            },
            {
              title: "계산서 출력",
              url: "/my-food/invoice",
            },
            {
              title: "1:1 문의/요청 관리",
              url: "/my-food/inquiry",
            },
          ],
        },
        {
          title: "이용 현황",
          icon: TrendingUp,
          items: [
            {
              title: "모니터링",
              url: "/my-food/monitoring",
            },
            {
              title: "구매/배송 내역",
              url: "/my-food/delivery",
            },
            {
              title: "Dashboard",
              url: "/my-food/dashboard",
            },
          ],
        },
        {
          title: "B2B 정산 관리",
          icon: BarChart3,
          items: [
            {
              title: "결제/정산 내역",
              url: "/my-food/settlement",
            },
            {
              title: "운영 Report",
              url: "/my-food/report",
            },
          ],
        },
      ],
    },
    {
      title: "MY MIND",
      items: [
        {
          title: "콘텐츠 관리",
          icon: Brain,
          items: [
            {
              title: "이용 내역",
              url: "/my-mind/usage",
            },
            {
              title: "계산서 출력",
              url: "/my-mind/invoice",
            },
            {
              title: "1:1 문의/요청 관리",
              url: "/my-mind/inquiry",
            },
          ],
        },
        {
          title: "이용 현황",
          icon: FileCheck,
          items: [
            {
              title: "모니터링",
              url: "/my-mind/monitoring",
            },
            {
              title: "콘텐츠 계약/제공 내역",
              url: "/my-mind/contract",
            },
            {
              title: "Dashboard",
              url: "/my-mind/dashboard",
            },
          ],
        },
        {
          title: "B2B 정산 관리",
          icon: DollarSign,
          items: [
            {
              title: "결제/정산 내역",
              url: "/my-mind/settlement",
            },
            {
              title: "운영 Report",
              url: "/my-mind/report",
            },
          ],
        },
      ],
    },
  ],
};
